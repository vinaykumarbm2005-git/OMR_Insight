from flask import Blueprint

from controllers.submission_controller import upload_omr

submission_bp = Blueprint(
    "submission_bp",
    __name__
)

submission_bp.route(
    "/upload",
    methods=["POST"]
)(upload_omr)