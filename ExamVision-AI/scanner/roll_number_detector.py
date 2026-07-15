import cv2
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
# Crop Roll Number Region
# =====================================
roll_region = image[y:y+h, x:x+w]

# =====================================
# Convert to Grayscale
# =====================================
gray = cv2.cvtColor(
    roll_region,
    cv2.COLOR_BGR2GRAY
)

# =====================================
# Calculate Grid Cell Size
# =====================================
column_width = w // digits
row_height = h // rows

# =====================================
# Draw Grid
# =====================================
display = roll_region.copy()

# Vertical Lines
for i in range(digits + 1):
    x_pos = i * column_width

    cv2.line(
        display,
        (x_pos, 0),
        (x_pos, h),
        (0, 255, 0),
        2
    )

# Horizontal Lines
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
    cv2.resize(display, (400, 700))
)

cv2.waitKey(0)
cv2.destroyAllWindows()