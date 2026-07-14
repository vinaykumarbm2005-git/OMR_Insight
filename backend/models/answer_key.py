from extensions import db


class AnswerKey(db.Model):
    __tablename__ = "answer_keys"

    id = db.Column(db.Integer, primary_key=True)

    exam_id = db.Column(
        db.Integer,
        db.ForeignKey("exams.id"),
        nullable=False
    )

    question_number = db.Column(
        db.Integer,
        nullable=False
    )

    correct_answer = db.Column(
        db.String(2),
        nullable=False
    )

    chapter = db.Column(
        db.String(100),
        nullable=False
    )

    concept = db.Column(
        db.String(150),
        nullable=False
    )

    exam = db.relationship(
        "Exam",
        backref="answer_keys"
    )

    def __repr__(self):
        return f"<AnswerKey Exam {self.exam_id} Q{self.question_number}>"