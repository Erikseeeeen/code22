from sqlite3 import DatabaseError
from flask import Flask, request, jsonify
import os
import json

app = Flask(__name__)

data_bouys_folder = "data/buoys/"
data_csv_folder = "data/csv/"


@app.after_request
def add_response_headers(response):
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response


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
    return response


@app.get("/buoy/<name>")
def get_buoy(name):
    with open(data_bouys_folder + name + ".json") as file:
        buoy = json.load(file)
    response = jsonify(buoy)
    return response
