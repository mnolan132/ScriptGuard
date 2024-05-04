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

if __name__ == "__main__":
    with app.app_context():
        db.create_all()

    app.run(debug=True)


# internal_urls = extract.crawl("https://www.thepythoncode.com", 30)

# for url in internal_urls:
#     print(xss.scan_xss(url))
#     print(sql.scan_sql_injection(url))


# xss.scan_xss("https://alf.nu/alert1?world=alert&level=alert0")
# sql.scan_sql_injection("https://alf.nu/alert1?world=alert&level=alert0")