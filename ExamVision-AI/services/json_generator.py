"""
Generate standardized JSON output
for the ExamVision AI scanner.
"""


def generate_result(exam_type, roll_number, answers):
    """
    Generate scanner output JSON.

    Args:
        exam_type (str)
        roll_number (str)
        answers (list)

    Returns:
        dict
    """

    return {
        "exam_type": exam_type,
        "roll_number": roll_number,
        "answers": answers
    }


if __name__ == "__main__":

    sample_answers = [
        "A",
        "B",
        "C",
        "D",
        "-",
        "A"
    ]

    result = generate_result(
        "KCET",
        "220145",
        sample_answers
    )

    print(result)