from sqlalchemy import func

from models.exam import Exam
from models.student import Student
from models.result import Result


def get_dashboard_analytics():

    total_exams = Exam.query.count()

    total_students = Student.query.count()

    total_results = Result.query.count()

    average_score = db_average(Result.score)

    highest_score = db_max(Result.score)

    lowest_score = db_min(Result.score)

    return {
        "total_exams": total_exams,
        "total_students": total_students,
        "total_results": total_results,
        "average_score": average_score,
        "highest_score": highest_score,
        "lowest_score": lowest_score
    }


def get_exam_analytics(exam_id):

    exam = Exam.query.get(exam_id)

    if not exam:
        return None

    results = Result.query.filter_by(
        exam_id=exam_id
    ).all()

    students_appeared = len(results)

    if students_appeared == 0:

        average_score = 0
        highest_score = 0
        lowest_score = 0
        pass_percentage = 0

    else:

        scores = [r.score for r in results]

        average_score = round(
            sum(scores) / len(scores),
            2
        )

        highest_score = max(scores)

        lowest_score = min(scores)

        passed = len([
            s for s in scores
            if s >= (exam.total_marks * 0.35)
        ])

        pass_percentage = round(
            (passed / students_appeared) * 100,
            2
        )

    return {
        "exam_title": exam.title,
        "students_appeared": students_appeared,
        "average_score": average_score,
        "highest_score": highest_score,
        "lowest_score": lowest_score,
        "pass_percentage": pass_percentage
    }


def get_student_analytics(student_id):

    student = Student.query.get(student_id)

    if not student:
        return None

    result = Result.query.filter_by(
        student_id=student_id
    ).first()

    if not result:
        return None

    exam = Exam.query.get(result.exam_id)

    accuracy = round(
        (
            result.correct_answers /
            exam.total_questions
        ) * 100,
        2
    )

    return {
        "student_name": student.name,
        "roll_number": student.roll_number,
        "exam": exam.title,
        "score": result.score,
        "correct_answers": result.correct_answers,
        "incorrect_answers": result.incorrect_answers,
        "unattempted_questions": result.unattempted_questions,
        "accuracy": accuracy
    }


def db_average(column):

    value = Result.query.with_entities(
        func.avg(column)
    ).scalar()

    return round(value, 2) if value else 0


def db_max(column):

    value = Result.query.with_entities(
        func.max(column)
    ).scalar()

    return value if value else 0


def db_min(column):

    value = Result.query.with_entities(
        func.min(column)
    ).scalar()

    return value if value else 0