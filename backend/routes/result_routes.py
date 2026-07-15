from flask import Blueprint

from controllers.result_controller import (
    evaluate,
    fetch_exam_results
)

result_bp = Blueprint(
    "result_bp",
    __name__
)

result_bp.route(
    "/evaluate",
    methods=["POST"]
)(evaluate)

result_bp.route(
    "/exam/<int:exam_id>",
    methods=["GET"]
)(fetch_exam_results)