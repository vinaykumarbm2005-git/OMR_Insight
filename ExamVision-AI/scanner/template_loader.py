import json


def load_template(exam_type):
    """
    Load template JSON based on selected exam type.
    """

    exam_type = exam_type.upper()

    if exam_type == "KCET":
        file_path = "templates/kcet.json"

    elif exam_type == "NEET":
        file_path = "templates/neet.json"

    elif exam_type == "JEE":
        file_path = "templates/jee.json"

    else:
        raise ValueError(f"Unsupported exam type: {exam_type}")

    with open(file_path, "r") as file:
        template = json.load(file)

    return template


# =====================================
# Test Loader
# =====================================
if __name__ == "__main__":

    exam_type = "KCET"

    template = load_template(exam_type)

    print("\n===== TEMPLATE LOADED =====")

    for key, value in template.items():
        print(f"{key}: {value}")