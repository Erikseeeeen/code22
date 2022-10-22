from flask import Flask, jsonify, request, send_file
import os
import json
import science
app = Flask(__name__)

data_buoys_folder = "./data/buoys/"
data_csv_folder = "./data/csv/"
data_mp4_folder = "./data/video/"


@app.after_request
def add_response_headers(response):
    response.headers.add("Access-Control-Allow-Origin", "*")
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
            "location": current_buoy["location"],
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


@app.post("/buoy/update/<name>")
def update_buoy(name):
    data = request.form
    csv = request.files["csv"]
    batch_id = data["batch_id"]
    file_name = data["file_name"]
    with open(os.path.join(data_buoys_folder, name + ".json"), "r") as file:
        buoy = json.load(file)
    sensors = buoy["sensors"]
    [s for s in sensors if s["name"] == file_name.removesuffix(".csv")][0]["batch_id"] = int(batch_id)
    buoy["warnings"] = []
    # update warnings according to new sensor data
    # also do data processing
    for sensor in sensors:
        if sensor["format"] != "csv":
            continue
        obj = {
            "name": sensor["name"],
            "rows": science.get_suspicious_rows(os.path.join(data_csv_folder, sensor["name"] + ".csv")),
            "diffs": science.get_suspicious_changes(os.path.join(data_csv_folder, sensor["name"] + ".csv")),
            "threshold": science.get_threshold_fails(os.path.join(data_csv_folder, sensor["name"] + ".csv"), sensor["threshold_low"], sensor["threshold_high"])
        }
        buoy["warnings"].append(obj)
    # save buoy with warnings
    with open(os.path.join(data_buoys_folder, name + ".json"), "w") as file:
        json.dump(buoy, file)
    csv.save(os.path.join(data_csv_folder, file_name))
    return "ok"