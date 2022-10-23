# Code22: Start NTNU Hackathon with Ocean Access

Task: Design a service for data storage and presentation

The goal of the application is to create a user-friendly interface that helps researchers and managers visualize and analyze data. The application is fully modular for easy customizing of data, and features an easy method for creation of new modules.

The webapp focuses on the frontend-part, and is missing a real database-system. For now, it's represented in json.
The backend is written in Flask, and the frontend using React.

## Installation

Requires python and npm.

In server folder:

`python3 -m venv venv && source venv/bin/activate`

`pip install Flask pandas numpy scipy geopy`

`./run.sh`

In client folder:

`npm install`

`npm run dev`

