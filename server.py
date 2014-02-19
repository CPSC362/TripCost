from flask import Flask, render_template
from flask_bootstrap import Bootstrap
from flask_appconfig import AppConfig

# from flask_wtf import Form, RecaptchaField
# from wtforms import TextField, HiddenField, ValidationError, RadioField,\
#     BooleanField, SubmitField, IntegerField, FormField, validators
# from wtforms.validators import Required

#initialization

configFile = None

app = Flask(__name__, static_folder='assets')
AppConfig(app, configFile)
app.config['BOOTSTRAP_SERVE_LOCAL'] = True
	
Bootstrap(app)

@app.route('/')
def index():
	return render_template('index.html')

if __name__ == '__main__':
	port = int(os.environ.get("PORT", 5000))
	app.run(host='0.0.0.0', debug=True, port=port)