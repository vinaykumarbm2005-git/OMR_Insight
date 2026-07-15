from flask import request, jsonify

from services.evaluation_service import evaluate_student


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