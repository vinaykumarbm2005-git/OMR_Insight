from flask import jsonify, request

from services.answer_key_service import (
    create_answer_key,
    get_answer_key,
    update_answer_key
)


def upload_answer_key(exam_id):
    data = request.get_json()

    if "answers" not in data:
        return jsonify({
            "success": False,
            "message": "answers field is required"
        }), 400

    answer_key, error = create_answer_key(
        exam_id,
        data["answers"]
    )

    if error:
        return jsonify({
            "success": False,
            "message": error
        }), 400

    return jsonify({
        "success": True,
        "message": "Answer key uploaded successfully"
    }), 201


def fetch_answer_key(exam_id):
    answer_key = get_answer_key(exam_id)

    if not answer_key:
        return jsonify({
            "success": False,
            "message": "Answer key not found"
        }), 404

    return jsonify({
        "exam_id": answer_key.exam_id,
        "answers": answer_key.answers
    })


def edit_answer_key(exam_id):
    data = request.get_json()

    answer_key = update_answer_key(
        exam_id,
        data["answers"]
    )

    if not answer_key:
        return jsonify({
            "success": False,
            "message": "Answer key not found"
        }), 404

    return jsonify({
        "success": True,
        "message": "Answer key updated successfully"
    })