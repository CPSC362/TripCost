import os

from flask import Flask, render_template, make_response, jsonify, request
from flask_bootstrap import Bootstrap
from flask_appconfig import AppConfig
from flaskext.gravatar import Gravatar

import json
import requests

# from flask_wtf import Form, RecaptchaField
# from wtforms import TextField, HiddenField, ValidationError, RadioField,\
#     BooleanField, SubmitField, IntegerField, FormField, validators
# from wtforms.validators import Required

#initialization

METERS_TO_MILES = 0.000621371

configFile = None

app = Flask(__name__, static_folder='assets')
AppConfig(app, configFile)
app.config['BOOTSTRAP_SERVE_LOCAL'] = True
app.debug = True

# Gravatar initialization
gravatar = Gravatar(app,
                    size=100,
                    rating='g',
                    default='retro',
                    force_default=False,
                    use_ssl=False,
                    base_url=None)
    
Bootstrap(app)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/vehicle-menu-year')
def vehicle_menu():
    req = requests.get('http://www.fueleconomy.gov/ws/rest/vehicle/menu/year', headers={'Accept': 'application/json'})
    return jsonify(req.json()), req.status_code

@app.route('/vehicle-menu-make')
def vehicle_make():
    vehicle = {
        'year': request.args.get('year')
    }

    req = requests.get('http://www.fueleconomy.gov/ws/rest/vehicle/menu/make', params=vehicle, headers={'Accept': 'application/json'})
    return jsonify(req.json()), req.status_code

@app.route('/vehicle-menu-model')
def vehicle_model():
    vehicle = {
        'year': request.args.get('year'),
        'make': request.args.get('make')
    }

    req = requests.get('http://www.fueleconomy.gov/ws/rest/vehicle/menu/model', params=vehicle, headers={'Accept': 'application/json'})
    return jsonify(req.json()), req.status_code

@app.route('/vehicle-menu-options')
def vehicle_options():
    vehicle = {
        'year': request.args.get('year'),
        'make': request.args.get('make'),
        'model': request.args.get('model')
    }

    req = requests.get('http://www.fueleconomy.gov/ws/rest/vehicle/menu/options', params=vehicle, headers={'Accept': 'application/json'})
    return jsonify(req.json()), req.status_code

@app.route('/calc-trip-cost', methods=['POST'])
def calc_trip_cost():
    vehicle = request.form['vehicle']
    directions = json.loads(request.form['trip'])
    
    #get request objects from fueleconomy.gov
    reqVehicle = requests.get('http://www.fueleconomy.gov/ws/rest/vehicle/' + str(vehicle), headers={'Accept': 'application/json'})
    reqSharedMpg = requests.get('http://www.fueleconomy.gov/ws/rest/ympg/shared/ympgVehicle/' + str(vehicle), headers={'Accept': 'application/json'})
    reqGasPrice = requests.get('http://www.fueleconomy.gov/ws/rest/fuelprices', headers={'Accept': 'application/json'})
    
    #get json from request objects
    vehicleInfo = reqVehicle.json()

    epaTripCost    = 0
    sharedTripCost = 0

    #this is just placeholder. Don't know if there needs to be any setup to get this number.
    distance = 0

    for route in directions['routes']:
        for leg in route['legs']:
            distance += leg['distance']['value']

    distance = distance * METERS_TO_MILES
    print distance

    if reqSharedMpg.content is not "":
        sharedMpgInfo = reqSharedMpg.json()
        
        #get average user submitted mpg
        sharedMpg = float(sharedMpgInfo['avgMpg'])

        #calc tripcost using shared data
        sharedTripCost = (distance / sharedMpg) * gasPrice

    gasPriceInfo = reqGasPrice.json()
    
    #get combined mpg for fueltype 1
    mpg = float(vehicleInfo['comb08U']) or float(vehicleInfo['comb08'])
    
    #determine fuel type to find gas price
    fuelType = str(vehicleInfo['fuelType1']).lower().split(' ', 1)[0]

    #use fueltype to find national average price for that type of fuel.
    gasPrice = float(gasPriceInfo[fuelType])
    
    #calc tripcost using epa estimate
    epaTripCost = (distance / mpg) * gasPrice

    tripCost = {}

    if epaTripCost is not 0:
        tripCost['epa'] = epaTripCost

    if sharedTripCost is not 0:
        tripCost['shared'] = sharedTripCost
    
    return jsonify(tripCost)

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', debug=True, port=port)