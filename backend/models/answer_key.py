from datetime import datetime

from extensions import db


class AnswerKey(db.Model):
    __tablename__ = "answer_keys"

    id = db.Column(db.Integer, primary_key=True)

    exam_id = db.Column(
        db.Integer,
        db.ForeignKey("exams.id"),
        nullable=False,
        unique=True
    )

    answers = db.Column(
        db.JSON,
        nullable=False
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    exam = db.relationship(
        "Exam",
        backref=db.backref(
            "answer_key",
            uselist=False
        )
    )

    def __repr__(self):
        return f"<AnswerKey Exam {self.exam_id}>"