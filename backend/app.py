from flask import Flask
from flask_cors import CORS

from config import Config
from extensions import db
from flasgger import Swagger

from models import *

from routes.exam_routes import exam_bp
from routes.answer_key_routes import answer_key_bp
from routes.student_routes import student_bp
from routes.result_routes import result_bp
from routes.auth_routes import auth_bp
from routes.scanner_routes import scanner_bp
from routes.analytics_routes import analytics_bp

def create_app():

    app = Flask(__name__)
    app.config["SWAGGER"] = {
    "title": "OMR Insight API",
    "uiversion": 3
}

    app.config.from_object(Config)

    CORS(app)

    db.init_app(app)
    Swagger(app)

    # ==========================
    # API Version 1 Routes
    # ==========================

    app.register_blueprint(
        exam_bp,
        url_prefix="/api/v1/exams"
    )

    app.register_blueprint(
        answer_key_bp,
        url_prefix="/api/v1/exams"
    )

    app.register_blueprint(
        student_bp,
        url_prefix="/api/v1/students"
    )

    app.register_blueprint(
        result_bp,
        url_prefix="/api/v1/results"
    )

    app.register_blueprint(
    auth_bp,
    url_prefix="/api/v1/auth"
)
    
    app.register_blueprint(
    scanner_bp,
    url_prefix="/api/v1/scanner"
)
    
    app.register_blueprint(
    analytics_bp,
    url_prefix="/api/v1/analytics"
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
    app.run(
        debug=True
    )