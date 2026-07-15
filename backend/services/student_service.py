from extensions import db
from models.student import Student


def create_student(name, roll_number, exam_id):

    existing = Student.query.filter_by(
        roll_number=roll_number
    ).first()

    if existing:
        return None, "Student already exists"

    student = Student(
        name=name,
        roll_number=roll_number,
        exam_id=exam_id
    )

    db.session.add(student)
    db.session.commit()

    return student, None


def get_all_students():
    return Student.query.all()


def get_student(student_id):
    return Student.query.get(student_id)