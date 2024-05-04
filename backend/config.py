from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_wtf.csrf import CSRFProtect


app = Flask(__name__)
csrf = CSRFProtect()
csrf.init_app(app)
CORS(app, resources={r"/*": {"origins": "*", "send_wildcard": "False"}}) # Compliant


app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///mydatabase.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)
