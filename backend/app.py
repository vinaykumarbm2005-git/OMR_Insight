from flask import Flask
from flask_cors import CORS

from config import Config
from extensions import db

from models import *

from routes.exam_routes import exam_bp
from routes.answer_key_routes import answer_key_bp



def create_app():

    app = Flask(__name__)

    app.config.from_object(Config)

    CORS(app)

    db.init_app(app)

    app.register_blueprint(
        exam_bp,
        url_prefix="/api/exams"
    )

    app.register_blueprint(
        answer_key_bp,
        url_prefix="/api/exams"
    )

    
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