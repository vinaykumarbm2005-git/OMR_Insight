from datetime import datetime

from extensions import db


class Result(db.Model):
    __tablename__ = "results"

    id = db.Column(db.Integer, primary_key=True)

    exam_id = db.Column(
        db.Integer,
        db.ForeignKey("exams.id"),
        nullable=False
    )

    student_id = db.Column(
        db.Integer,
        db.ForeignKey("students.id"),
        nullable=False
    )

    score = db.Column(
        db.Float,
        nullable=False,
        default=0
    )

    correct_answers = db.Column(
        db.Integer,
        nullable=False,
        default=0
    )

    incorrect_answers = db.Column(
        db.Integer,
        nullable=False,
        default=0
    )

    unattempted_questions = db.Column(
        db.Integer,
        nullable=False,
        default=0
    )

    scan_time = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    exam = db.relationship(
        "Exam",
        backref="results"
    )

    student = db.relationship(
        "Student",
        backref="results"
    )

    def __repr__(self):
        return f"<Result Exam {self.exam_id} Student {self.student_id}>"