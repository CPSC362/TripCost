import os

from flask import Flask, render_template, make_response, jsonify
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
     year = request.args.get('year', '')
     req = requests.get('http://www.fueleconomy.gov/ws/rest/vehicle/menu/make', params={'year': year}, headers={'Accept': 'application/json'})
     return jsonify(req.json()), req.status_code


if __name__ == '__main__':
	port = int(os.environ.get("PORT", 5000))
	app.run(host='0.0.0.0', debug=True, port=port)