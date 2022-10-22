from concurrent.futures import process
import csv
import io
from flask import Flask, jsonify, request, send_file
import os
import json
import science
app = Flask(__name__)

data_buoys_folder = "./data/buoys/"
data_csv_folder = "./data/csv/"
presets_folder = "./data/presets/"
data_mp4_folder = "./data/video/"


@app.after_request
def add_response_headers(response):
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")

    return response


@app.get("/buoys")
def get_all_buoys():
    entries = os.scandir(data_buoys_folder)
    output = list()
    for entry in entries:
        with open(os.path.join(data_buoys_folder, entry.name), "r") as file:
            current_buoy = json.load(file)
        buoy_short = {
            "name": current_buoy["name"],
            "status": current_buoy["status"],
            "anchor": current_buoy["anchor"],
            "warnings": current_buoy["warnings"]
        }
        output.append(buoy_short)
    response = jsonify(output)
    return response


@app.get("/buoy/<name>")
def get_buoy(name):
    with open(os.path.join(data_buoys_folder, name + ".json")) as file:
        buoy = json.load(file)
    response = jsonify(buoy)
    return response


@app.get("/data/csv/<file>")
def get_csv_file(file):
    csv_path = os.path.join(data_csv_folder, file + ".csv")
    if not os.path.isfile(csv_path):
        return "ERROR: %s is not a file!" % file
    return send_file(csv_path, mimetype="text/csv")


@app.get("/data/video/<file>")
def get_mp4_file(file):
    mp4_path = os.path.join(data_mp4_folder, file + ".mp4")
    if not os.path.isfile(mp4_path):
        return "ERROR: %s is not a file!" % file
    return send_file(mp4_path, mimetype="video/mp4")

def process_update(name, csv, batch_id, file_name):
    with open(os.path.join(data_buoys_folder, name + ".json"), "r") as file:
        buoy = json.load(file)
    sensors = buoy["sensors"]
    [s for s in sensors if s["name"] == file_name.removesuffix(".csv")][0]["batch_id"] = int(batch_id)
    buoy["warnings"] = []
    # update warnings according to new sensor data
    # also do data processing
    buoy["status"] = 0
    for sensor in sensors:
        if sensor["format"] == "csv":
            obj = {
                "name": sensor["name"],
                "rows": science.get_suspicious_rows(os.path.join(data_csv_folder, sensor["name"] + ".csv")),
                "diffs": science.get_suspicious_changes(os.path.join(data_csv_folder, sensor["name"] + ".csv")),
                "threshold": science.get_threshold_fails(os.path.join(data_csv_folder, sensor["name"] + ".csv"), sensor["limit_low"], sensor["limit_high"])
            }
            if len(obj["rows"]) or len(obj["diffs"]) or len(obj["threshold"]):
                buoy["status"] = 2
            buoy["warnings"].append(obj)
        elif sensor["format"] == "metadata":
            pass
        else: 
            continue
    # save buoy with warnings
    with open(os.path.join(data_buoys_folder, name + ".json"), "w") as file:
        json.dump(buoy, file)
    csv.save(os.path.join(data_csv_folder, file_name))
    return "ok"

@app.post("/buoy/update_ar/<name>")
def update_buoy_arduino(name):
    data = request.form
    _csv = csv.reader(io.StringIO(data["csv"]), ";")
    batch_id = data["batch_id"]
    file_name = data["file_name"]
    return process_update(name, _csv, batch_id, file_name)

@app.post("/buoy/update/<name>")
def update_buoy(name):
    data = request.form
    csv = request.files["csv"]
    batch_id = data["batch_id"]
    file_name = data["file_name"]
    return process_update(name, csv, batch_id, file_name)

@app.get("/presets/<name>")
def get_preset(name):
    preset_path = os.path.join(presets_folder, name + ".json")
    if not os.path.isfile(preset_path):
        return "ERROR: %s is not a file!" % name
    with open(preset_path, "r") as file:
        preset = json.load(file)
        return jsonify(preset)

@app.post("/presets/<name>")
def save_preset(name):
    data = request.get_json()
    with open(os.path.join(presets_folder, name + ".json"), "w") as file:
        json.dump(data, file)
        return "ok"

@app.get("/presets")
def get_all_presets():
    entries = os.scandir(presets_folder)
    return jsonify({"presets": [entry.name.removesuffix(".json") for entry in entries]})