from flask import Flask, request, jsonify
import os
import json

app = Flask(__name__)

data_bouys_folder = "data/buoys/"
data_csv_folder = "data/csv/"


@app.get("/buoys")
def get_all_buoys():
    entries = os.scandir("data/buoys/")
    output = list()
    for entry in entries:
        with open(data_bouys_folder + entry.name, "r") as file:
            current_buoy = json.load(file)
        buoy_short = {
            "name": current_buoy["name"],
            "status": current_buoy["status"],
            "location": current_buoy["location"],
            "warnings": current_buoy["warnings"]
        }
        output.append(buoy_short)
    response = jsonify(output)
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response
