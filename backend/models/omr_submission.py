from datetime import datetime

from extensions import db


class OMRSubmission(db.Model):
    __tablename__ = "omr_submissions"

    id = db.Column(db.Integer, primary_key=True)

    exam_id = db.Column(
        db.Integer,
        db.ForeignKey("exams.id"),
        nullable=False
    )

    student_name = db.Column(
        db.String(100),
        nullable=False
    )

    usn = db.Column(
        db.String(50),
        nullable=False
    )

    image_path = db.Column(
        db.String(255),
        nullable=False
    )

    status = db.Column(
        db.String(30),
        default="Pending"
    )

    uploaded_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    exam = db.relationship(
        "Exam",
        backref="submissions"
    )

    def __repr__(self):
        return f"<OMRSubmission {self.usn}>"