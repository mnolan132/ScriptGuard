from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS



app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}}) #CSRF protection

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///mydatabase.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False


db = SQLAlchemy(app)


