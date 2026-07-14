from models.answer_key import AnswerKey
from models.exam import Exam
from extensions import db


def create_answer_key(exam_id, answers):
    exam = Exam.query.get(exam_id)

    if not exam:
        return None, "Exam not found"

    existing = AnswerKey.query.filter_by(exam_id=exam_id).first()

    if existing:
        return None, "Answer key already exists"

    answer_key = AnswerKey(
        exam_id=exam_id,
        answers=answers
    )

    db.session.add(answer_key)
    db.session.commit()

    return answer_key, None


def get_answer_key(exam_id):
    return AnswerKey.query.filter_by(exam_id=exam_id).first()


def update_answer_key(exam_id, answers):
    answer_key = AnswerKey.query.filter_by(exam_id=exam_id).first()

    if not answer_key:
        return None

    answer_key.answers = answers

    db.session.commit()

    return answer_key