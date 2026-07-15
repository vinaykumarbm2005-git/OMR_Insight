from flask import request, jsonify

from extensions import db
from models.exam import Exam


def create_exam():

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "Request body is required"
        }), 400

    # Required for both old and new API formats
    if "exam_type" not in data:
        return jsonify({
            "success": False,
            "message": "exam_type is required"
        }), 400

    if "total_questions" not in data:
        return jsonify({
            "success": False,
            "message": "total_questions is required"
        }), 400

    exam_type = data["exam_type"]
    total_questions = int(data["total_questions"])

    # Backward-compatible defaults
    title = data.get(
        "title",
        f"{exam_type} Examination"
    )

    template_type = data.get(
        "template_type",
        exam_type
    )

    exam_set = data.get(
        "exam_set",
        "A"
    )

    total_marks = data.get(
        "total_marks",
        total_questions
    )

    negative_marking = data.get(
        "negative_marking",
        0.0
    )

    exam = Exam(
        title=title,
        exam_type=exam_type,
        template_type=template_type,
        exam_set=exam_set,
        total_questions=total_questions,
        total_marks=total_marks,
        negative_marking=negative_marking
    )

    db.session.add(exam)
    db.session.commit()

    return jsonify({
        "success": True,
        "message": "Exam created successfully",
        "exam_id": exam.id
    }), 201


def get_all_exams():

    exams = Exam.query.all()

    result = []

    for exam in exams:

        result.append({
            "id": exam.id,
            "title": exam.title,
            "exam_type": exam.exam_type,
            "template_type": exam.template_type,
            "exam_set": exam.exam_set,
            "total_questions": exam.total_questions,
            "total_marks": exam.total_marks,
            "negative_marking": exam.negative_marking
        })

    return jsonify(result)


def get_exam(exam_id):

    exam = Exam.query.get(exam_id)

    if not exam:
        return jsonify({
            "success": False,
            "message": "Exam not found"
        }), 404

    return jsonify({
        "id": exam.id,
        "title": exam.title,
        "exam_type": exam.exam_type,
        "template_type": exam.template_type,
        "exam_set": exam.exam_set,
        "total_questions": exam.total_questions,
        "total_marks": exam.total_marks,
        "negative_marking": exam.negative_marking
    })