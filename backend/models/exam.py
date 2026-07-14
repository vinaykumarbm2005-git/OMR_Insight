from datetime import datetime

from extensions import db


class Exam(db.Model):
    __tablename__ = "exams"

    id = db.Column(db.Integer, primary_key=True)

    title = db.Column(db.String(200), nullable=False)

    exam_type = db.Column(db.String(50), nullable=False)

    template_type = db.Column(db.String(20), nullable=False)

    exam_set = db.Column(db.String(5), nullable=False)

    total_questions = db.Column(db.Integer, nullable=False)

    total_marks = db.Column(db.Float, nullable=False)

    negative_marking = db.Column(db.Float, default=0.0)

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    def __repr__(self):
        return f"<Exam {self.title}>"