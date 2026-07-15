from flask import Blueprint

from controllers.analytics_controller import (
    dashboard,
    exam_analytics,
    student_analytics
)

analytics_bp = Blueprint(
    "analytics_bp",
    __name__
)

analytics_bp.route(
    "/dashboard",
    methods=["GET"]
)(dashboard)

analytics_bp.route(
    "/exams/<int:exam_id>",
    methods=["GET"]
)(exam_analytics)

analytics_bp.route(
    "/students/<int:student_id>",
    methods=["GET"]
)(student_analytics)