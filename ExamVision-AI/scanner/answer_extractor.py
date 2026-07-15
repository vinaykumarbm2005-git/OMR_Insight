import cv2

# =====================================
# Load Warped OMR Image
# =====================================

image = cv2.imread("images/warped_omr.jpg")

if image is None:
    print("Image not found")
    exit()

# =====================================
# Crop Answer Area
# =====================================

answer_region = image[340:1180, 20:804]

# =====================================
# Convert to Grayscale
# =====================================

gray = cv2.cvtColor(
    answer_region,
    cv2.COLOR_BGR2GRAY
)

# =====================================
# Threshold
# =====================================

binary = cv2.adaptiveThreshold(
    gray,
    255,
    cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
    cv2.THRESH_BINARY_INV,
    21,
    10
)

# =====================================
# Find Contours
# =====================================

contours, _ = cv2.findContours(
    binary,
    cv2.RETR_EXTERNAL,
    cv2.CHAIN_APPROX_SIMPLE
)

display = answer_region.copy()

question_blocks = []

# =====================================
# Detect Question Blocks
# =====================================

for contour in contours:

    x, y, w, h = cv2.boundingRect(contour)

    area = w * h

    # Ignore tiny contours
    if area < 9000:
        continue

    # Ignore huge regions
    if area > 30000:
        continue

    ratio = w / float(h)

    # Remove vertical labels
    if ratio < 0.5:
        continue

    # Remove very wide regions
    if ratio > 2.0:
        continue

    question_blocks.append(
        (x, y, w, h)
    )

# =====================================
# Sort Blocks
# =====================================

question_blocks = sorted(
    question_blocks,
    key=lambda block: (block[1], block[0])
)

# =====================================
# Draw Blocks
# =====================================

for x, y, w, h in question_blocks:

    cv2.rectangle(
        display,
        (x, y),
        (x + w, y + h),
        (0, 255, 0),
        2
    )

# =====================================
# Print Result
# =====================================

print("\nDetected Question Blocks:\n")

for i, block in enumerate(question_blocks):
    print(f"{i+1}: {block}")

print(
    f"\nQuestion Blocks Found: {len(question_blocks)}"
)

# =====================================
# Display Result
# =====================================

cv2.imshow(
    "Question Blocks",
    cv2.resize(display, (800, 1000))
)

cv2.imshow(
    "Binary",
    cv2.resize(binary, (800, 1000))
)

cv2.waitKey(0)
cv2.destroyAllWindows()