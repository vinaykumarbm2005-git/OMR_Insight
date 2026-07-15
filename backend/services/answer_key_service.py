import csv
from io import StringIO

from extensions import db
from models.exam import Exam
from models.answer_key import AnswerKey


def upload_answer_key(exam_id, csv_file):

    exam = Exam.query.get(exam_id)

    if not exam:
        return False, "Exam not found"

    if csv_file is None:
        return False, "CSV file is required"

    # Remove existing answer key for this exam
    AnswerKey.query.filter_by(exam_id=exam_id).delete()

    stream = StringIO(csv_file.stream.read().decode("utf-8"))
    reader = csv.DictReader(stream)

    required_columns = [
        "question_number",
        "correct_answer",
        "chapter",
        "concept"
    ]

    if reader.fieldnames is None:
        return False, "Invalid CSV file"

    for column in required_columns:
        if column not in reader.fieldnames:
            return False, f"Missing column: {column}"

    for row in reader:

        answer = AnswerKey(
            exam_id=exam_id,
            question_number=int(row["question_number"]),
            correct_answer=row["correct_answer"].strip().upper(),
            chapter=row["chapter"].strip(),
            concept=row["concept"].strip()
        )

        db.session.add(answer)

    db.session.commit()

    return True, "Answer Key Uploaded Successfully"