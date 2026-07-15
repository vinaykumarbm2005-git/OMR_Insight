from flask import request, jsonify

from services.evaluation_service import evaluate_student
from services.result_service import get_exam_results


def evaluate():

    data = request.get_json()

    required_fields = [
        "exam_id",
        "student_id",
        "responses"
    ]

    for field in required_fields:
        if field not in data:
            return jsonify({
                "success": False,
                "message": f"{field} is required"
            }), 400

    result, error = evaluate_student(
        data["exam_id"],
        data["student_id"],
        data["responses"]
    )

    if error:
        return jsonify({
            "success": False,
            "message": error
        }), 400

    return jsonify({
        "success": True,
        "message": "Evaluation completed successfully",
        "data": {
            "score": result.score,
            "correct_answers": result.correct_answers,
            "incorrect_answers": result.incorrect_answers,
            "unattempted_questions": result.unattempted_questions
        }
    })


def fetch_exam_results(exam_id):

    results = get_exam_results(exam_id)

    return jsonify({
        "success": True,
        "data": [
            {
                "student_id": r.student.id,
                "student_name": r.student.name,
                "roll_number": r.student.roll_number,
                "score": r.score,
                "correct_answers": r.correct_answers,
                "incorrect_answers": r.incorrect_answers,
                "unattempted_questions": r.unattempted_questions
            }
            for r in results
        ]
    })