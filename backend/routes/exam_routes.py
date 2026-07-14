
from flask import Blueprint

from controllers.exam_controller import (
    create_exam,
    get_all_exams,
    get_exam
)

exam_bp = Blueprint("exam_bp", __name__)

exam_bp.route("/", methods=["POST"])(create_exam)

exam_bp.route("/", methods=["GET"])(get_all_exams)

exam_bp.route("/<int:exam_id>", methods=["GET"])(get_exam)