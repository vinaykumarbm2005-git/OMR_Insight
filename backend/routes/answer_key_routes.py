from flask import Blueprint

from controllers.answer_key_controller import (
    upload_answer_key,
    fetch_answer_key,
    edit_answer_key
)

answer_key_bp = Blueprint(
    "answer_key_bp",
    __name__
)

answer_key_bp.route(
    "/<int:exam_id>/answer-key",
    methods=["POST"]
)(upload_answer_key)

answer_key_bp.route(
    "/<int:exam_id>/answer-key",
    methods=["GET"]
)(fetch_answer_key)

answer_key_bp.route(
    "/<int:exam_id>/answer-key",
    methods=["PUT"]
)(edit_answer_key)