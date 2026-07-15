from flask import Blueprint

from controllers.answer_key_controller import upload_csv

answer_key_bp = Blueprint(
    "answer_key_bp",
    __name__
)

answer_key_bp.route(
    "/<int:exam_id>/answer-key/upload",
    methods=["POST"]
)(upload_csv)