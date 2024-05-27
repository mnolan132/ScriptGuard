from flask import request, jsonify
from werkzeug.security import check_password_hash, generate_password_hash
from config import app, db
from models import User
from xss_scan import scan_xss
from sql_scan import scan_sql_injection
from extract import crawl
import uuid

user_not_found = "User not found"

@app.route("/user/<string:user_id>", methods=["GET"])
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


@app.route("/create_user", methods=["POST"])
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
    hashed_password = generate_password_hash(password)

    new_user = User(id=user_id, first_name=first_name, last_name=last_name, email=email, password=hashed_password, is_developer=is_developer)

    try:
        db.session.add(new_user)
        db.session.commit()
    except Exception as e:
        return jsonify({"message": str(e)}, 400)
    
    return jsonify({"message": "User Created!"}), 201

@app.route("/login", methods=["POST"])
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

@app.route("/update_user/<string:user_id>", methods=["PATCH"])
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

@app.route("/delete_user/<string:user_id>", methods=["DELETE"])
def delete_user(user_id):
    user = User.query.get(user_id)

    if not user:
        return jsonify({"message": user_not_found}), 404

    db.session.delete(user)
    db.session.commit()

    return jsonify({"message": "User deleted!"}), 200

@app.route("/basic_scan", methods=["POST"])
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


@app.route("/deep_scan", methods=["POST"])
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
        
        xss_scan_results = ""
        sql_injection_scan_results = ""

        for internal_url in internal_urls:
            xss_scan_results += scan_xss(internal_url)
            sql_injection_scan_results += scan_sql_injection(internal_url)
        
        return jsonify({
            "message": "this function was successful",
            "xss": xss_scan_results,
            "sql": sql_injection_scan_results
        }), 200

        

if __name__ == "__main__":
    with app.app_context():
        db.create_all()

    app.run(debug=True)
