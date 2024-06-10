from flask import request, jsonify
import requests
from werkzeug.security import check_password_hash, generate_password_hash
from config import app, db
from models import User
from xss_scan import scan_xss
from sql_scan import scan_sql_injection
from extract import crawl
import uuid

user_not_found = "User not found" #re-useable code as this required throughout this file

@app.route("/user/<string:user_id>", methods=["GET"]) #returns a user to the frontend in JSON format
def get_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": user_not_found}), 404

    return jsonify({
        "id": user.id,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
        "is_developer": user.is_developer
    }), 200


@app.route("/create_user", methods=["POST"]) #Creates a new user from information passed from the frontend and saves to the database
def create_new_user():
    first_name = request.json.get("firstName")
    last_name = request.json.get("lastName")
    email = request.json.get("email")
    password = request.json.get("password")
    is_developer = request.json.get("isDeveloper")

    if not first_name or not last_name or not email or not password or not is_developer:
        return (
            jsonify({"message": "You must include a first name, last name, email address and password"}),
            400,
        )
    
    user_id = str(uuid.uuid4())
    hashed_password = generate_password_hash(password) #password is encrypted

    new_user = User(id=user_id, first_name=first_name, last_name=last_name, email=email, password=hashed_password, is_developer=is_developer)

    try:
        db.session.add(new_user)
        db.session.commit()
    except Exception as e:
        return jsonify({"message": str(e)}, 400)
    
    return jsonify({"message": "User Created!"}), 201

@app.route("/login", methods=["POST"]) #validates credentials entered in the frontend and returns validated user information 
def login():
    email = request.json.get("email")
    password = request.json.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    user = User.query.filter_by(email=email).first()

    if not user or not check_password_hash(user.password, password):
        return jsonify({"error": "Invalid email or password"}), 401

    return jsonify({
        "id": user.id,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
        "is_developer": user.is_developer
    }), 200

@app.route("/update_user/<string:user_id>", methods=["PATCH"]) #updates user information. User info is indexed by the user_id, which is unique
def update_user(user_id):
    user = User.query.get(user_id)

    if not user:
        return jsonify({"message": user_not_found}), 404
    
    data = request.json
    user.first_name = data.get("first_name", user.first_name)
    user.last_name = data.get("last_name", user.last_name)
    user.email = data.get("email", user.email)
    user.is_developer = data.get("isDeveloper", user.is_developer)

    db.session.commit()
    return jsonify({"message": "User updated", }), 200

@app.route("/delete_user/<string:user_id>", methods=["DELETE"]) #removed user information from the database. Indexed by user_id
def delete_user(user_id):
    user = User.query.get(user_id)

    if not user:
        return jsonify({"message": user_not_found}), 404

    db.session.delete(user)
    db.session.commit()

    return jsonify({"message": "User deleted!"}), 200

@app.route("/basic_scan", methods=["POST"]) #runs the scan functions and returns the findings to the frontend
def basic_scan():
    if request.method == "OPTIONS":
        # Handle CORS preflight request
        response = jsonify({"message": "CORS preflight request successful"})
        response.headers.add("Access-Control-Allow-Methods", "POST")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type")
        return response

    if request.method == "POST":
        url = request.json.get("url")
        xss_scan_results = scan_xss(url)
        sql_injection_scan_results = scan_sql_injection(url)
        return jsonify({
            "message": "this function was successful",
            "xss": xss_scan_results,
            "sql": sql_injection_scan_results
        }), 200


@app.route("/deep_scan", methods=["POST"]) #runs the crawl function to search for internal linked and then loops the scan functions over these links, returning information to the frontend
def deep_scan():
    if request.method == "OPTIONS":
        # Handle CORS preflight request
        response = jsonify({"message": "CORS preflight request successful"})
        response.headers.add("Access-Control-Allow-Methods", "POST")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type")
        return response

    if request.method == "POST":
        url = request.json.get("url")
        internal_urls = crawl(url)
        
        xss_scan_results = set()
        sql_injection_scan_results = set()

        for internal_url in internal_urls:
            try:
                xss_scan_result = scan_xss(internal_url)
                xss_scan_results.add(xss_scan_result)
            except requests.exceptions.RequestException as e:
                print(f"Error scanning {internal_url} for XSS: {e}")
                continue

            try:
                sql_injection_scan_result = scan_sql_injection(internal_url)
                sql_injection_scan_results.add(sql_injection_scan_result)
            except requests.exceptions.RequestException as e:
                print(f"Error scanning {internal_url} for SQL Injection: {e}")
                continue

        result_of_xss_scan = "No XSS threats were detected"
        result_of_sqli_scan = "No SQL Injection vulnerability detected"

        for item in list(xss_scan_results):
            if item == "XSS threats detected":
                result_of_xss_scan = item
                break
            
        for item in list(sql_injection_scan_results):
            if item == "SQL Injection vulnerability detected":
                result_of_sqli_scan = item
                break
        
        return jsonify({
            "message": "Deep scan completed successfully",
            "xss": result_of_xss_scan,
            "sql": result_of_sqli_scan
        }), 200


        

if __name__ == "__main__":
    with app.app_context():
        db.create_all()

    app.run(debug=True)
