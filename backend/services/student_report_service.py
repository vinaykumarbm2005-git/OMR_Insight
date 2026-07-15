from models.student import Student
from models.result import Result


def get_student_report(student_id):

    student = Student.query.get(student_id)

    if not student:
        return None

    result = Result.query.filter_by(
        student_id=student_id
    ).order_by(
        Result.scan_time.desc()
    ).first()

    if not result:
        return None

    return {
        "student": student,
        "exam": result.exam,
        "result": result
    }