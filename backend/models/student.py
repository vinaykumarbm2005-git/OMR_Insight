from extensions import db


class Student(db.Model):
    __tablename__ = "students"

    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(
        db.String(100),
        nullable=False
    )

    roll_number = db.Column(
        db.String(50),
        nullable=False,
        unique=True
    )

    exam_id = db.Column(
        db.Integer,
        db.ForeignKey("exams.id"),
        nullable=False
    )

    exam = db.relationship(
        "Exam",
        backref="students"
    )

    def __repr__(self):
        return f"<Student {self.roll_number}>"
