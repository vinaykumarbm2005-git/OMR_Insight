from flask import jsonify

from services.analytics_service import (
    get_dashboard_analytics,
    get_exam_analytics,
    get_student_analytics
)


def dashboard():

    data = get_dashboard_analytics()

    return jsonify({
        "success": True,
        "data": data
    })


def exam_analytics(exam_id):

    data = get_exam_analytics(exam_id)

    if not data:
        return jsonify({
            "success": False,
            "message": "Exam not found"
        }), 404

    return jsonify({
        "success": True,
        "data": data
    })


def student_analytics(student_id):

    data = get_student_analytics(student_id)

    if not data:
        return jsonify({
            "success": False,
            "message": "Student not found"
        }), 404

    return jsonify({
        "success": True,
        "data": data
    })