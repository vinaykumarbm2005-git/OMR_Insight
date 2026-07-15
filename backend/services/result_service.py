from models.result import Result


def get_exam_results(exam_id):

    results = Result.query.filter_by(
        exam_id=exam_id
    ).all()

    return results 