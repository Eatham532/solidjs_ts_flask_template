from crypt import methods

from flask import request

from flaskr.api.utils import response_json, response_accepted, response_bad
from flaskr.db import get_db

def api_v1_setup(app):
    @app.route('/')
    def hello():
        return 'Hello, World!'

    @app.route("/api/v1/users", methods=["GET"])
    def list_users():
        db = get_db()
        cur = db.cursor()
        res = cur.execute("SELECT username, password FROM user")

        return response_json(res.fetchall())

    @app.route("/api/v1/add_user", methods=["POST"])
    def add_user():
        data = request.json
        if request.method == 'POST':
            username = data.get('username')
            password = data.get('password')

            if not username or not password:
                print("Invalid Arguments")
                return response_bad()

            conn = get_db()
            cur = conn.cursor()
            cur.execute("INSERT INTO user (username, password) VALUES (?, ?)", (username, password))
            conn.commit()
            print(username + password)
            print("Executed")
            return response_accepted()