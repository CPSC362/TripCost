import os

from flask import Flask, render_template, make_response, jsonify, request, g, \
     redirect, url_for
from flask_bootstrap import Bootstrap
from flask_appconfig import AppConfig
from flaskext.gravatar import Gravatar
from flask.ext.login import LoginManager, login_user, logout_user, \
     login_required

import json
import requests
import sqlite3

from TripCostUser import TripCostUser

# from flask_wtf import Form, RecaptchaField
# from wtforms import TextField, HiddenField, ValidationError, RadioField,\
#     BooleanField, SubmitField, IntegerField, FormField, validators
# from wtforms.validators import Required

#initialization

configFile = None

app = Flask(__name__, static_folder='assets')
AppConfig(app, configFile)
app.config['BOOTSTRAP_SERVE_LOCAL'] = True
app.config['DATABASE'] = os.path.join(app.root_path, 'tripcost.db')
app.config['SECRET_KEY'] = 'key'
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

login_manager = LoginManager()
login_manager.init_app(app)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        
        db = get_db()
        cursor = db.execute("select 1 from user where Username=?", [email])
        if cursor.fetchone() is None:
            db.execute('insert into user (Username, Password) values (?, ?)', [email, password])
            db.commit()
        
        return redirect( url_for('index') )
    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        remember = request.form.get('remember') == 'on'
        
        db = get_db()
        cursor = db.execute("select * from user where Username=?", [email])
        row = cursor.fetchone()
        if row is not None:
            print('valid email')
            if row['Password'] == password:
                print('valid password')
                user = load_user( unicode(row['UserID']) )
                login_user(user, remember=remember)
    #return render_template('login.html')
    return redirect( url_for('index') )

@app.route('/logout')
@login_required
def logout():
    logout_user()
    #return render_template('logout.html')
    return redirect( url_for('index') )

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/test')
@login_required
def test():
    return redirect( url_for('about') )

@login_manager.user_loader
def load_user(userid):
    db = get_db()
    cursor = db.execute("select 1 from user where UserID=?", [userid])
    if cursor.fetchone() is not None:
        cursor = db.execute("select Username from user where UserID=?", [userid])
        return TripCostUser( userid, cursor.fetchone()[0] )
    return None

def connect_db():
    connection = sqlite3.connect(app.config['DATABASE'])
    connection.row_factory = sqlite3.Row
    return connection

def init_db():
    with app.app_context():
        db = get_db()
        with app.open_resource('schema.sql', mode='r') as f:
            db.cursor().executescript( f.read() )
        db.commit()

def get_db():
    if not hasattr(g, 'sqlite_db'):
        g.sqlite_db = connect_db()
    return g.sqlite_db

@app.teardown_appcontext
def close_db(error):
    if hasattr(g, 'sqlite_db'):
        g.sqlite_db.close()

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', debug=True, port=port)