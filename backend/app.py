from flask import Flask
from flask_cors import CORS

from config import DB_PATH, Config
from extensions import db
import models


def create_app():
    app = Flask(__name__)

    app.config.from_object(Config)

    CORS(app)
    print("DB URI:", app.config["SQLALCHEMY_DATABASE_URI"])
    db.init_app(app)

    with app.app_context():
        db.create_all()

    @app.route("/")
    def home():
        return {
            "success": True,
            "message": "ExamVision AI Backend Running"
        }

    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True)

