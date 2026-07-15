from flask import jsonify, request

from services.answer_key_service import upload_answer_key


def upload_csv(exam_id):

    csv_file = request.files.get("answer_key")

    success, message = upload_answer_key(
        exam_id,
        csv_file
    )

    if not success:
        return jsonify({
            "success": False,
            "message": message
        }), 400

    return jsonify({
        "success": True,
        "message": message
    }), 201