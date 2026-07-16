import os
import json
from typing import Dict, Any, Optional


def save_result_json(
    exam_type: str,
    roll_number: str,
    mcq_answers: Dict[str, str],
    numerical_answers: Dict[str, str],
    output_dir: str = "results",
    filename: str = "result.json"
) -> Dict[str, Any]:
    """
    Combines exam definitions, identifiers, and answers into a standardized OMR Result JSON file.

    Args:
        exam_type: Exam template classification (e.g. JEE, NEET, KCET).
        roll_number: Scanned roll number identification.
        mcq_answers: Map representing question number index to multiple-choice options.
        numerical_answers: Map representing question number index to numerical string digits.
        output_dir: Target directory path where results are saved.
        filename: Target evaluation result filename.

    Returns:
        Dict representation of the generated JSON content.
    """
    # Sanitize and format data inputs
    payload: Dict[str, Any] = {
        "exam": str(exam_type).strip().upper(),
        "roll_number": str(roll_number).strip(),
        "answers": {str(k): str(v).strip().upper() for k, v in mcq_answers.items()},
        "numerical_answers": {str(k): str(v).strip() for k, v in numerical_answers.items()}
    }

    # Ensure output destination folder exists
    try:
        os.makedirs(output_dir, exist_ok=True)
    except OSError as e:
        raise OSError(f"Could not initialize target results directory '{output_dir}': {e}")

    output_path = os.path.join(output_dir, filename)

    # Perform file serializing
    try:
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(payload, f, indent=4, ensure_ascii=False)
    except IOError as e:
        raise IOError(f"Could not write target JSON results file to '{output_path}': {e}")

    return payload
