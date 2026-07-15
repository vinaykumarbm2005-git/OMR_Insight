from flask import Blueprint

from controllers.student_controller import (
    add_student,
    fetch_students,
    fetch_student,
    student_report
)

student_bp = Blueprint(
    "student_bp",
    __name__
)

student_bp.route(
    "/",
    methods=["POST"]
)(add_student)

student_bp.route(
    "/",
    methods=["GET"]
)(fetch_students)

student_bp.route(
    "/<int:student_id>",
    methods=["GET"]
)(fetch_student)

student_bp.route(
    "/<int:student_id>/report",
    methods=["GET"]
)(student_report)