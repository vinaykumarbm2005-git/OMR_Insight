from flask import Blueprint

from controllers.result_controller import evaluate

result_bp = Blueprint(
    "result_bp",
    __name__
)

result_bp.route(
    "/evaluate",
    methods=["POST"]
)(evaluate)