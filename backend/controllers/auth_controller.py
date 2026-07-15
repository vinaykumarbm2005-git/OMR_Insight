from flask import request, jsonify


def login():

    data = request.get_json()

    username = data.get("username")
    password = data.get("password")

    if username == "admin" and password == "admin123":
        return jsonify({
            "success": True,
            "message": "Login successful",
            "data": {
                "username": username,
                "role": "Administrator",
                "token": "dummy-token-123456"
            }
        })

    return jsonify({
        "success": False,
        "message": "Invalid username or password"
    }), 401