from datetime import datetime

from extensions import db


class Result(db.Model):
    __tablename__ = "results"

    id = db.Column(db.Integer, primary_key=True)

    submission_id = db.Column(
        db.Integer,
        db.ForeignKey("omr_submissions.id"),
        nullable=False,
        unique=True
    )

    detected_answers = db.Column(
        db.JSON,
        nullable=False
    )

    score = db.Column(
        db.Float,
        nullable=False
    )

    correct_answers = db.Column(
        db.Integer,
        nullable=False
    )

    wrong_answers = db.Column(
        db.Integer,
        nullable=False
    )

    unanswered = db.Column(
        db.Integer,
        nullable=False
    )

    evaluated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    submission = db.relationship(
        "OMRSubmission",
        backref=db.backref(
            "result",
            uselist=False
        )
    )

    def __repr__(self):
        return f"<Result Submission {self.submission_id}>"