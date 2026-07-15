from flask import jsonify, request

from services.student_service import (
    create_student,
    get_all_students,
    get_student
)

from services.student_report_service import (
    get_student_report
)


def add_student():

    data = request.get_json()

    student, error = create_student(
        data["name"],
        data["roll_number"],
        data["exam_id"]
    )

    if error:
        return jsonify({
            "success": False,
            "message": error
        }), 409

    return jsonify({
        "success": True,
        "message": "Student added successfully",
        "data": {
            "id": student.id
        }
    }), 201


def fetch_students():

    students = get_all_students()

    return jsonify({
        "success": True,
        "data": [
            {
                "id": s.id,
                "name": s.name,
                "roll_number": s.roll_number,
                "exam_id": s.exam_id
            }
            for s in students
        ]
    })


def fetch_student(student_id):

    student = get_student(student_id)

    if not student:
        return jsonify({
            "success": False,
            "message": "Student not found"
        }), 404

    return jsonify({
        "success": True,
        "data": {
            "id": student.id,
            "name": student.name,
            "roll_number": student.roll_number,
            "exam_id": student.exam_id
        }
    })


def student_report(student_id):

    report = get_student_report(student_id)

    if not report:
        return jsonify({
            "success": False,
            "message": "Report not found"
        }), 404

    return jsonify({
        "success": True,
        "data": {
            "student": {
                "id": report["student"].id,
                "name": report["student"].name,
                "roll_number": report["student"].roll_number
            },
            "exam": {
                "id": report["exam"].id,
                "title": report["exam"].title,
                "exam_type": report["exam"].exam_type
            },
            "result": {
                "score": report["result"].score,
                "correct_answers": report["result"].correct_answers,
                "incorrect_answers": report["result"].incorrect_answers,
                "unattempted_questions": report["result"].unattempted_questions
            }
        }
    })