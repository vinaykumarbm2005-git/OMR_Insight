from extensions import db
from models.exam import Exam
from models.student import Student
from models.answer_key import AnswerKey
from models.result import Result


def evaluate_student(exam_id, student_id, responses):

    exam = Exam.query.get(exam_id)

    if not exam:
        return None, "Exam not found"

    student = Student.query.get(student_id)

    if not student:
        return None, "Student not found"

    answer_keys = (
        AnswerKey.query
        .filter_by(exam_id=exam_id)
        .order_by(AnswerKey.question_number)
        .all()
    )

    if not answer_keys:
        return None, "Answer Key not uploaded"

    correct = 0
    incorrect = 0
    unattempted = 0

    for answer in answer_keys:

        student_answer = responses.get(
            str(answer.question_number),
            ""
        ).strip().upper()

        if student_answer == "":
            unattempted += 1

        elif student_answer == answer.correct_answer:
            correct += 1

        else:
            incorrect += 1

    score = correct - (incorrect * exam.negative_marking)

    # Check if result already exists
    result = Result.query.filter_by(
        exam_id=exam_id,
        student_id=student_id
    ).first()

    if result:
        result.score = score
        result.correct_answers = correct
        result.incorrect_answers = incorrect
        result.unattempted_questions = unattempted
    else:
        result = Result(
            exam_id=exam_id,
            student_id=student_id,
            score=score,
            correct_answers=correct,
            incorrect_answers=incorrect,
            unattempted_questions=unattempted
        )
        db.session.add(result)

    db.session.commit()

    return result, None