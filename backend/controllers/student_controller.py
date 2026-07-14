from flask import jsonify, request

from services.student_service import (
    create_student,
    get_all_students,
    get_student
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