import cv2
import numpy as np

# =====================================
# Numerical blocks in JEE sheet
# =====================================

numerical_blocks = [
    5, 6, 7, 8, 9,
    14, 15, 16, 17, 18,
    23, 24, 25, 26, 27
]

# =====================================
# Process all blocks
# =====================================

for block_no in range(1, 28):

    block = cv2.imread(
        f"images/block_{block_no}.jpg"
    )

    if block is None:
        continue

    print(
        f"\n========== BLOCK {block_no} =========="
    )

    # =====================================
    # Convert to grayscale
    # =====================================

    gray = cv2.cvtColor(
        block,
        cv2.COLOR_BGR2GRAY
    )

    binary = cv2.adaptiveThreshold(
        gray,
        255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY_INV,
        21,
        10
    )

    # =====================================
    # Crop regions
    # =====================================

    if block_no not in numerical_blocks:
        # Remove question numbers
        binary = binary[:, 25:]

    else:
        # Remove top heading and left blank area
        binary = binary[26:-5, 25:-5]

    # =====================================
    # NUMERICAL BLOCKS
    # =====================================

    if block_no in numerical_blocks:

        rows = 10
        cols = 7

        symbols = [
            "0", "1", "2", "3", "4",
            "5", "6", "7", "8", "9", "."
        ]

        height, width = binary.shape

        # -----------------------------
        # Alignment settings
        # -----------------------------

        left_margin = 0
        right_margin = 1

        top_margin = 5
        bottom_margin = 3

        usable_width = (
            width
            - left_margin
            - right_margin
        )

        usable_height = (
            height
            - top_margin
            - bottom_margin
        )

        cell_width = usable_width // cols
        cell_height = usable_height // rows

        display = cv2.cvtColor(
            binary,
            cv2.COLOR_GRAY2BGR
        )

        number = ""

        for col in range(cols):

            max_pixels = 0
            selected_symbol = ""

            for row in range(rows):

                x1 = (
                    left_margin
                    + col * cell_width
                )

                x2 = (
                    left_margin
                    + (col + 1) * cell_width
                )

                y1 = (
                    top_margin
                    + row * cell_height
                )

                y2 = (
                    top_margin
                    + (row + 1) * cell_height
                )

                # Last row/column correction
                if col == cols - 1:
                    x2 = width - right_margin

                if row == rows - 1:
                    y2 = height - bottom_margin

                cell = binary[
                    y1:y2,
                    x1:x2
                ]

                pixels = cv2.countNonZero(
                    cell
                )

                if pixels > max_pixels:
                    max_pixels = pixels
                    selected_symbol = symbols[row]

                cv2.rectangle(
                    display,
                    (x1, y1),
                    (x2, y2),
                    (0, 255, 0),
                    1
                )

            number += selected_symbol

        print(
            "Detected Numerical Answer:",
            number
        )

    # =====================================
    # MCQ BLOCKS
    # =====================================

    else:

        rows = 5
        cols = 4

        options = [
            "A",
            "B",
            "C",
            "D"
        ]

        height, width = binary.shape

        cell_height = height // rows
        cell_width = width // cols

        answers = []

        display = cv2.cvtColor(
            binary,
            cv2.COLOR_GRAY2BGR
        )

        for row in range(rows):

            max_pixels = 0
            selected_option = "-"

            for col in range(cols):

                x1 = col * cell_width
                x2 = (col + 1) * cell_width

                y1 = row * cell_height
                y2 = (row + 1) * cell_height

                cell = binary[
                    y1:y2,
                    x1:x2
                ]

                pixels = cv2.countNonZero(
                    cell
                )

                if pixels > max_pixels:
                    max_pixels = pixels
                    selected_option = options[col]

                cv2.rectangle(
                    display,
                    (x1, y1),
                    (x2, y2),
                    (0, 255, 0),
                    1
                )

            answers.append(
                selected_option
            )

        print(
            "\nDetected Answers:\n"
        )

        for i, ans in enumerate(
            answers
        ):
            print(
                f"Q{i+1}: {ans}"
            )

    # =====================================
    # Show result
    # =====================================

    cv2.imshow(
        f"Block {block_no}",
        cv2.resize(
            display,
            (500, 500)
        )
    )

    cv2.waitKey(0)

cv2.destroyAllWindows()