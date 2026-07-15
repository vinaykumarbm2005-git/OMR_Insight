import cv2
import numpy as np
from scanner.template_loader import load_template

# =====================================
# Load Warped OMR Image
# =====================================

image = cv2.imread("images/warped_omr.jpg")

if image is None:
    print("Error: warped_omr.jpg not found!")
    exit()

# =====================================
# Load Template
# =====================================

template = load_template("KCET")
region = template["roll_number_region"]

x = region["x"]
y = region["y"]
w = region["width"]
h = region["height"]

digits = region["digits"]
rows = region["rows"]

print("Roll Number Region Loaded")
print(f"x={x}, y={y}, width={w}, height={h}")
print(f"Digits={digits}, Rows={rows}")

# =====================================
# Crop Roll Number Area
# =====================================

roll_region = image[y:y+h, x:x+w]

# =====================================
# Preprocess Image
# =====================================

gray = cv2.cvtColor(
    roll_region,
    cv2.COLOR_BGR2GRAY
)

gray = cv2.GaussianBlur(
    gray,
    (5,5),
    0
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
# Grid Information (Improved Alignment)
# =====================================

left_margin = 2
right_margin = 2

top_margin = 15
bottom_margin = 4

usable_width = w - left_margin - right_margin
usable_height = h - top_margin - bottom_margin

column_width = usable_width / digits
row_height = usable_height / rows

display = roll_region.copy()

roll_number = ""

# =====================================
# Process Each Column
# =====================================

for col in range(digits):

    max_pixels = 0
    selected_digit = -1

    for row in range(rows):

        x1 = int(
            left_margin +
            col * column_width
        )

        x2 = int(
            left_margin +
            (col + 1) * column_width
        )

        y1 = int(
            top_margin +
            row * row_height
        )

        y2 = int(
            top_margin +
            (row + 1) * row_height
        )

        cell = binary[y1:y2, x1:x2]

        filled_pixels = cv2.countNonZero(cell)

        if filled_pixels > max_pixels:
            max_pixels = filled_pixels
            selected_digit = row

        # Draw Debug Grid
        cv2.rectangle(
            display,
            (x1, y1),
            (x2, y2),
            (0,255,0),
            1
        )

    if selected_digit == -1:
        roll_number += "_"
    else:
        roll_number += str(selected_digit)

print("\nDetected Roll Number:")
print(roll_number)

# =====================================
# Save Debug Image
# =====================================

cv2.imwrite(
    "images/roll_grid_debug.jpg",
    display
)

# =====================================
# Display Result
# =====================================

cv2.imshow(
    "Roll Number Grid",
    cv2.resize(display, (400,700))
)

cv2.imshow(
    "Binary",
    cv2.resize(binary, (400,700))
)

cv2.waitKey(0)
cv2.destroyAllWindows()
