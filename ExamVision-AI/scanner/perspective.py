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
# Preprocessing
# =====================================

gray = cv2.cvtColor(
    image,
    cv2.COLOR_BGR2GRAY
)

blurred = cv2.GaussianBlur(
    gray,
    (5, 5),
    0
)

edges = cv2.Canny(
    blurred,
    50,
    150
)

# =====================================
# Find Contours
# =====================================

contours, _ = cv2.findContours(
    edges,
    cv2.RETR_EXTERNAL,
    cv2.CHAIN_APPROX_SIMPLE
)

if len(contours) == 0:
    print("No contours found!")
    exit()

# Sort largest first
contours = sorted(
    contours,
    key=cv2.contourArea,
    reverse=True
)

sheet_contour = None

# =====================================
# Manual contour selection
# =====================================

for i, contour in enumerate(contours[:20]):

    area = cv2.contourArea(contour)

    perimeter = cv2.arcLength(
        contour,
        True
    )

    approx = cv2.approxPolyDP(
        contour,
        0.02 * perimeter,
        True
    )

    print(
        f"Contour {i+1}: "
        f"Area={int(area)} "
        f"Corners={len(approx)}"
    )

    debug = original.copy()

    cv2.drawContours(
        debug,
        [contour],
        -1,
        (0, 255, 0),
        5
    )

    cv2.imshow(
        f"Contour {i+1}",
        cv2.resize(debug, (700, 900))
    )

    print("Press S to select this contour.")
    print("Press any other key for next contour.")

    key = cv2.waitKey(0)

    cv2.destroyAllWindows()

    if key == ord('s'):
        sheet_contour = contour
        print("Selected contour:", i + 1)
        break

if sheet_contour is None:
    print("No contour selected.")
    exit()

# =====================================
# Minimum Area Rectangle
# =====================================

rect = cv2.minAreaRect(
    sheet_contour
)

box = cv2.boxPoints(
    rect
)

box = np.array(
    box,
    dtype="float32"
)

# =====================================
# Order Points
# =====================================

ordered = np.zeros((4, 2), dtype="float32")

s = box.sum(axis=1)
ordered[0] = box[np.argmin(s)]  # top-left
ordered[2] = box[np.argmax(s)]  # bottom-right

diff = np.diff(box, axis=1)
ordered[1] = box[np.argmin(diff)]  # top-right
ordered[3] = box[np.argmax(diff)]  # bottom-left

(tl, tr, br, bl) = ordered

# =====================================
# Calculate Output Size
# =====================================

widthA = np.linalg.norm(br - bl)
widthB = np.linalg.norm(tr - tl)

heightA = np.linalg.norm(tr - br)
heightB = np.linalg.norm(tl - bl)

maxWidth = int(max(widthA, widthB))
maxHeight = int(max(heightA, heightB))

if maxWidth == 0 or maxHeight == 0:
    print("Invalid paper dimensions.")
    exit()

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
    ordered,
    destination
)

warped = cv2.warpPerspective(
    original,
    matrix,
    (maxWidth, maxHeight)
)

# Rotate if upside down
if warped.shape[0] > warped.shape[1]:
    pass
else:
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
# Draw Rectangle
# =====================================

rectangle_image = original.copy()

cv2.drawContours(
    rectangle_image,
    [np.int32(ordered)],
    0,
    (0, 255, 0),
    5
)

# =====================================
# Resize for Display
# =====================================

display_original = cv2.resize(
    original,
    (600, 800)
)

display_rectangle = cv2.resize(
    rectangle_image,
    (600, 800)
)

display_warped = cv2.resize(
    warped,
    (600, 800)
)

# =====================================
# Show Results
# =====================================

cv2.imshow(
    "Original OMR",
    display_original
)

cv2.imshow(
    "Detected Rectangle",
    display_rectangle
)

cv2.imshow(
    "Warped OMR",
    display_warped
)

cv2.waitKey(0)
cv2.destroyAllWindows()