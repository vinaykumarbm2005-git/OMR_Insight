import os
from werkzeug.utils import secure_filename

from extensions import db
from models.exam import Exam
from models.omr_submission import OMRSubmission


UPLOAD_FOLDER = "uploads"


def upload_submission(exam_id, student_name, usn, image):

    exam = Exam.query.get(exam_id)

    if not exam:
        return None, "Exam not found"

    if image is None:
        return None, "No image uploaded"

    filename = secure_filename(image.filename)

    if filename == "":
        return None, "Invalid image"

    os.makedirs(UPLOAD_FOLDER, exist_ok=True)

    image_path = os.path.join(UPLOAD_FOLDER, filename)

    image.save(image_path)

    submission = OMRSubmission(
        exam_id=exam_id,
        student_name=student_name,
        usn=usn,
        image_path=image_path,
        status="Pending"
    )

    db.session.add(submission)
    db.session.commit()

    return submission, None