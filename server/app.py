from flask import Flask, request, jsonify

app = Flask(__name__)

@app.get("/text")
def get_countries():
  response = jsonify({"text": "Hello world!"})
  response.headers.add("Access-Control-Allow-Origin", "*")
  return response
  