import cv2
import json

# =====================================
# Load Image
# =====================================
image = cv2.imread("images/warped_omr.jpg")

if image is None:
    print("Image not found!")
    exit()

# =====================================
# Load Region Coordinates
# =====================================
with open("templates/roll_number_region.json", "r") as file:
    region = json.load(file)

x = region["x"]
y = region["y"]
w = region["width"]
h = region["height"]

digits = region["digits"]
rows = region["rows"]

# =====================================
# Extract Roll Number Area
# =====================================
roll_region = image[y:y+h, x:x+w]

# Convert to grayscale
gray = cv2.cvtColor(
    roll_region,
    cv2.COLOR_BGR2GRAY
)

# =====================================
# Calculate Cell Size
# =====================================
column_width = w // digits
row_height = h // rows

# =====================================
# Draw Grid
# =====================================
display = roll_region.copy()

# Vertical lines
for i in range(digits + 1):
    x_pos = i * column_width

    cv2.line(
        display,
        (x_pos, 0),
        (x_pos, h),
        (0, 255, 0),
        2
    )

# Horizontal lines
for i in range(rows + 1):
    y_pos = i * row_height

    cv2.line(
        display,
        (0, y_pos),
        (w, y_pos),
        (255, 0, 0),
        2
    )

# =====================================
# Display
# =====================================
cv2.imshow(
    "Roll Number Grid",
    cv2.resize(display, (400, 700))
)

cv2.waitKey(0)
cv2.destroyAllWindows()