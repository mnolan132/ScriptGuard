from flask import request, jsonify
from werkzeug.security import check_password_hash
from config import app, db
from models import User
from xss_scan import scan_xss
from sql_scan import scan_sql_injection
from extract import crawl



@app.route("/user", methods=["GET"])
def get_user():
    auth = request.authorization
    if not auth or not auth.username or not auth.password:
        return jsonify({"error": "Authorization Required"}), 401
    
    user = User.query.filter_by(email=auth.username).first()
    if not user or not check_password_hash(user.password, auth.password):
        return jsonify({"error": "Invalid credentials"}), 401

    return jsonify({
        "id": user.id,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
        "is_developer": user.is_developer
    })




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
    
    new_user = User(first_name=first_name, last_name=last_name, email=email, password=password, is_developer=is_developer)

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

    # If you want to use sessions:
    # session["user_id"] = user.id

    return jsonify({
        "id": user.id,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
        "is_developer": user.is_developer
    }), 200


@app.route("/basic-scan", methods=["GET"])
def basic_scan():
    url = request.json.get("url")
    xss_scan_results = scan_xss(url)
    sql_injection_scan_results = scan_sql_injection(url)
    return jsonify({"results": {
        "xss": xss_scan_results,
        "sql": sql_injection_scan_results
    }})

@app.route("/deep-scan", methods=["GET"])
def deep_scan():
    url = request.json.get("url")
    internal_urls = crawl(url)

    for internal_url in internal_urls:
        scan_xss(internal_url)
        scan_sql_injection(internal_url)

if __name__ == "__main__":
    with app.app_context():
        db.create_all()

    app.run(debug=True)
