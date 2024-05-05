from flask import request, jsonify
from config import app, db
from models import User
import extract as extract
import xss_scan as xss
import sql_scan as sql

@app.route("/user", methods=["GET"])
def get_user():
    user = User.query.filter_by("email")
    json_user = user.to_json()
    return jsonify({"user": json_user})

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


@app.route("/basic-scan", methods=["GET"])
def basic_scan():
    url = request.json.get("url")
    xss_scan_results = xss.scan_xss(url)
    sql_injection_scan_results = sql.scan_sql_injection(url)
    return jsonify({"results": {
        "xss": xss_scan_results,
        "sql": sql_injection_scan_results
    }})

@app.route("/deep-scan", methods=["GET"])
def deep_scan():
    url = request.json.get("url")
    internal_urls = extract.crawl(url)

    for internal_url in internal_urls:
        xss.scan_xss(internal_url)
        sql.scan_sql_injection(internal_url)

if __name__ == "__main__":
    with app.app_context():
        db.create_all()

    app.run(debug=True)
