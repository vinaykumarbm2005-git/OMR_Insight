import cv2
import numpy as np

# =====================================
# Load Image
# =====================================

image = cv2.imread("images/sample_omr.jpeg")

if image is None:
    print("Image not found!")
    exit()

original = image.copy()

# =====================================
# Convert to HSV
# =====================================

hsv = cv2.cvtColor(
    image,
    cv2.COLOR_BGR2HSV
)

# =====================================
# Detect White Paper
# =====================================

lower_white = np.array([0, 0, 120])
upper_white = np.array([180, 80, 255])

mask = cv2.inRange(
    hsv,
    lower_white,
    upper_white
)

# =====================================
# Remove Noise
# =====================================

kernel = np.ones((7, 7), np.uint8)

mask = cv2.morphologyEx(
    mask,
    cv2.MORPH_CLOSE,
    kernel,
    iterations=3
)

mask = cv2.morphologyEx(
    mask,
    cv2.MORPH_OPEN,
    kernel,
    iterations=2
)

# =====================================
# Find Largest White Region
# =====================================

contours, _ = cv2.findContours(
    mask,
    cv2.RETR_EXTERNAL,
    cv2.CHAIN_APPROX_SIMPLE
)

if len(contours) == 0:
    print("No paper detected")
    exit()

paper_contour = max(
    contours,
    key=cv2.contourArea
)

# =====================================
# Rotated Rectangle Around Paper
# =====================================

hull = cv2.convexHull(
    paper_contour
)

rect = cv2.minAreaRect(
    hull
)

box = cv2.boxPoints(
    rect
)

box = np.int32(box)

# =====================================
# Order Corner Points
# =====================================

points = box.astype("float32")

rect_points = np.zeros(
    (4, 2),
    dtype="float32"
)

s = points.sum(axis=1)

rect_points[0] = points[np.argmin(s)]   # Top Left
rect_points[2] = points[np.argmax(s)]   # Bottom Right

diff = np.diff(points, axis=1)

rect_points[1] = points[np.argmin(diff)]   # Top Right
rect_points[3] = points[np.argmax(diff)]   # Bottom Left

(tl, tr, br, bl) = rect_points

# =====================================
# Compute Output Dimensions
# =====================================

widthA = np.linalg.norm(br - bl)
widthB = np.linalg.norm(tr - tl)

maxWidth = max(
    int(widthA),
    int(widthB)
)

heightA = np.linalg.norm(tr - br)
heightB = np.linalg.norm(tl - bl)

maxHeight = max(
    int(heightA),
    int(heightB)
)

# =====================================
# Destination Points
# =====================================

destination = np.array([
    [0, 0],
    [maxWidth - 1, 0],
    [maxWidth - 1, maxHeight - 1],
    [0, maxHeight - 1]
], dtype="float32")

# =====================================
# Perspective Transform
# =====================================

matrix = cv2.getPerspectiveTransform(
    rect_points,
    destination
)

warped = cv2.warpPerspective(
    original,
    matrix,
    (maxWidth, maxHeight)
)

# Rotate if width > height
if warped.shape[1] > warped.shape[0]:
    warped = cv2.rotate(
        warped,
        cv2.ROTATE_90_CLOCKWISE
    )

# =====================================
# Save Result
# =====================================

cv2.imwrite(
    "images/warped_omr.jpg",
    warped
)

# =====================================
# Draw Detected Rectangle
# =====================================

debug = original.copy()

cv2.drawContours(
    debug,
    [box],
    0,
    (0, 255, 0),
    5
)

# =====================================
# Resize for Display
# =====================================

display_original = cv2.resize(
    original,
    (700, 900)
)

display_mask = cv2.resize(
    mask,
    (700, 900)
)

display_debug = cv2.resize(
    debug,
    (700, 900)
)

display_warped = cv2.resize(
    warped,
    (700, 900)
)

# =====================================
# Show Results
# =====================================

cv2.imshow(
    "Original Image",
    display_original
)

cv2.imshow(
    "White Mask",
    display_mask
)

cv2.imshow(
    "Detected Paper",
    display_debug
)

cv2.imshow(
    "Warped OMR",
    display_warped
)

cv2.waitKey(0)
cv2.destroyAllWindows()