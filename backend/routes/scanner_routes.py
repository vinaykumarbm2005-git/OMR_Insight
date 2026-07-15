from flask import Blueprint

from controllers.scanner_controller import (
    start_scan,
    scan_status
)

scanner_bp = Blueprint(
    "scanner_bp",
    __name__
)

scanner_bp.route(
    "/start",
    methods=["POST"]
)(start_scan)

scanner_bp.route(
    "/status/<int:exam_id>",
    methods=["GET"]
)(scan_status)