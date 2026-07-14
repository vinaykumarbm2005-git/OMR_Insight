from flask import jsonify, request

from services.submission_service import upload_submission


def upload_omr():

    exam_id = request.form.get("exam_id")
    student_name = request.form.get("student_name")
    usn = request.form.get("usn")
    image = request.files.get("omr_image")

    if not exam_id or not student_name or not usn:
        return jsonify({
            "success": False,
            "message": "Missing required fields"
        }), 400

    submission, error = upload_submission(
        exam_id,
        student_name,
        usn,
        image
    )

    if error:
        return jsonify({
            "success": False,
            "message": error
        }), 400

    return jsonify({
        "success": True,
        "submission_id": submission.id,
        "message": "OMR uploaded successfully"
    }), 201