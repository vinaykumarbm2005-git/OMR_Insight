from flask import request, jsonify

from extensions import db
from models.exam import Exam


def create_exam():
    data = request.get_json()

    required_fields = [
        "title",
        "exam_type",
        "template_type",
        "exam_set",
        "total_questions",
        "total_marks"
    ]

    for field in required_fields:
        if field not in data:
            return jsonify({
                "success": False,
                "message": f"{field} is required"
            }), 400

    exam = Exam(
        title=data["title"],
        exam_type=data["exam_type"],
        template_type=data["template_type"],
        exam_set=data["exam_set"],
        total_questions=data["total_questions"],
        total_marks=data["total_marks"],
        negative_marking=data.get("negative_marking", 0.0)
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