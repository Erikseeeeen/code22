from flask import Flask, jsonify, send_file
import os
import json
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
