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
            output.append(json.load(file))
    print(output)
    response = jsonify(output)
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response
