import os

from flask import Flask, render_template, make_response, jsonify, request
from flask_bootstrap import Bootstrap
from flask_appconfig import AppConfig
from flaskext.gravatar import Gravatar

import requests

# from flask_wtf import Form, RecaptchaField
# from wtforms import TextField, HiddenField, ValidationError, RadioField,\
#     BooleanField, SubmitField, IntegerField, FormField, validators
# from wtforms.validators import Required

#initialization

configFile = None

app = Flask(__name__, static_folder='assets')
AppConfig(app, configFile)
app.config['BOOTSTRAP_SERVE_LOCAL'] = True

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

@app.route('/calc-trip-cost')
def calc_trip_cost():
	vehicle = request.args.get('vehicle')
	directions = requests.args.get('google')
	
	#get request objects from fueleconomy.gov
	reqvehicle = requests.get('http://www.fueleconomy.gov/ws/rest/vehicle/' + str(vehicle['id']), headers={'Accept': 'application/json'})
	reqsharedmpg = requests.get('http://www.fueleconomy.gov/ws/rest/ympg/shared/ympgVehicle/' + str(vehicle['id']), headers={'Accept': 'application/json'})
	reqgasprice = requests.get('http://www.fueleconomy.gov/ws/rest/fuelprices', headers={'Accept': 'application/json'})
	
	#get json from request objects
	vehicleinfo = reqvehicle.json()
	sharedmpginfo = reqsharedmpg.json()
	gaspriceinfo = reqgasprice.json()
	
	#get combined mpg for fueltype 1
	mpg = float(vehicleinfo['comb08U'])
	
	#get average user submitted mpg
	sharedmpg = float(sharedmpginfo['avgMpg'])
	
	#determine fuel type to find gas price
	fueltype = str(vehicleinfo['fuelType1']).lower().split(' ',1)[0]
	
	#use fueltype to find national average price for that type of fuel.
	gasprice = float(gaspriceinfo[fueltype])
	
	#this is just placeholder. Don't know if there needs to be any setup to get this number.
	distance=directions['distance']
	
	#calc tripcost using epa estimate
	epatripcost = (distance/mpg)*gasprice
	
	#calc tripcost using shared data
	sharedtripcost = (distance/sharedmpg)*gasprice
	
	#not sure if this is the right way to do this...
	tripcost = {'epa':epatripcost, 'shared':sharedtripcost}
	return jsonify(tripcost)

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', debug=True, port=port)