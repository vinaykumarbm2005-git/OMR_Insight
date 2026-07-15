import json
import os
import sys

# Custom Exception Hierarchy
class MissingTemplateError(Exception):
    """Raised when the template configuration file is missing or mapped to unsupported exams."""
    pass

class InvalidTemplateError(Exception):
    """Raised when the template content is invalid (type error, negative values, size mismatch)."""
    pass

class MissingFieldError(Exception):
    """Raised when required fields are missing from the configuration JSON."""
    pass


def validate_exam_template(template, exam_type):
    """
    Validates required fields, types, and values for an exam configuration.
    """
    required_fields = [
        "exam_type",
        "total_questions",
        "options_per_question",
        "roll_number_digits"
    ]
    
    # 1. Validate required fields exist
    for field in required_fields:
        if field not in template:
            raise MissingFieldError(
                f"Required field '{field}' is missing from template."
            )

    # 2. Validate types and values
    if not isinstance(template["exam_type"], str):
         raise InvalidTemplateError("Field 'exam_type' must be a string.")
         
    if template["exam_type"].upper() != exam_type:
        raise InvalidTemplateError(
            f"Field 'exam_type' must match expected '{exam_type}', got '{template['exam_type']}'"
        )

    for field in ["total_questions", "options_per_question", "roll_number_digits"]:
        val = template[field]
        # Ensure it is an integer and not a boolean (subclass of int in Python)
        if not isinstance(val, int) or isinstance(val, bool):
            raise InvalidTemplateError(f"Field '{field}' must be an integer.")
        if val <= 0:
            raise InvalidTemplateError(f"Field '{field}' must be a positive integer.")

    # 3. Validate layout question counts
    expected_counts = {
        "KCET": 240,
        "NEET": 200,
        "JEE": 75
    }
    
    expected = expected_counts.get(exam_type)
    actual = template["total_questions"]
    if actual != expected:
        raise InvalidTemplateError(
            f"Invalid question count for '{exam_type}': expected {expected}, found {actual}."
        )


def validate_region_template(region):
    """
    Validates roll number region bounding box coordinates and shapes.
    """
    required_fields = ["x", "y", "width", "height", "digits", "rows"]
    
    # 1. Validate required fields exist
    for field in required_fields:
        if field not in region:
            raise MissingFieldError(
                f"Required region field '{field}' is missing from roll number region template."
            )

    # 2. Validate types and positive boundaries
    for field in required_fields:
        val = region[field]
        if not isinstance(val, int) or isinstance(val, bool):
            raise InvalidTemplateError(f"Region field '{field}' must be an integer.")
        if val <= 0:
            raise InvalidTemplateError(f"Region field '{field}' must be a positive integer.")

    # 3. Validate coordinates fit within standard warped dimension (850 x 1200)
    x = region["x"]
    y = region["y"]
    w = region["width"]
    h = region["height"]
    
    if x + w > 850 or y + h > 1200:
        raise InvalidTemplateError(
            f"Region bounds exceed standard 850x1200 dimensions: "
            f"x+width={x+w} (max 850), y+height={y+h} (max 1200)."
        )


def load_template(exam_type):
    """
    Load template JSON based on selected exam type, applying strict schema validations.
    """
    exam_type = exam_type.upper()

    # Supported exams check
    if exam_type == "KCET":
        file_path = "templates/kcet.json"
    elif exam_type == "NEET":
        file_path = "templates/neet.json"
    elif exam_type == "JEE":
        file_path = "templates/jee.json"
    else:
        raise MissingTemplateError(
            f"Unsupported exam type: {exam_type}. "
            f"Supported exams: KCET (240 q), NEET (200 q), JEE (75 q)."
        )

    # File existence check
    if not os.path.exists(file_path):
        raise MissingTemplateError(
            f"Required template file was not found: '{file_path}'"
        )

    # Load template contents
    try:
        with open(file_path, "r") as file:
            template = json.load(file)
    except json.JSONDecodeError as e:
        raise InvalidTemplateError(
            f"Template JSON is malformed in '{file_path}': {e}"
        )
    except Exception as e:
        raise InvalidTemplateError(
            f"Unable to read template file '{file_path}': {e}"
        )

    # Validate exam details
    validate_exam_template(template, exam_type)

    # Load and validate coordinate layouts (roll number region)
    region_path = "templates/roll_number_region.json"
    if not os.path.exists(region_path):
        raise MissingTemplateError(
            f"Required coordinate template file was not found: '{region_path}'"
        )

    try:
        with open(region_path, "r") as file:
            region_template = json.load(file)
    except json.JSONDecodeError as e:
        raise InvalidTemplateError(
            f"Region template JSON is malformed in '{region_path}': {e}"
        )
    except Exception as e:
        raise InvalidTemplateError(
            f"Unable to read region template file '{region_path}': {e}"
        )

    # Validate regions and boundaries
    validate_region_template(region_template)

    # Include region structure in the returned template dict
    template["roll_number_region"] = region_template

    return template


# =====================================
# Test Loader (Standalone Execution)
# =====================================
if __name__ == "__main__":
    exam_type = "KCET"
    if len(sys.argv) > 1:
        exam_type = sys.argv[1]

    try:
        template = load_template(exam_type)
        print("\n===== TEMPLATE LOADED =====")
        for key, value in template.items():
            print(f"{key}: {value}")
    except Exception as e:
        print(f"\nValidationError: {type(e).__name__} - {e}")
        sys.exit(1)