import cv2

# =====================================
# Load Image
# =====================================
image = cv2.imread("images/sample_omr.jpeg")

if image is None:
    print("Image not found!")
    exit()

original = image.copy()

# =====================================
# Grayscale
# =====================================
gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

# =====================================
# Blur
# =====================================
blurred = cv2.GaussianBlur(gray, (5, 5), 0)

# =====================================
# Edge Detection
# =====================================
edges = cv2.Canny(blurred, 75, 200)

# =====================================
# Find Contours
# =====================================
contours, _ = cv2.findContours(
    edges,
    cv2.RETR_LIST,
    cv2.CHAIN_APPROX_SIMPLE
)

# Sort by contour area
contours = sorted(
    contours,
    key=cv2.contourArea,
    reverse=True
)

sheet_contour = None

# =====================================
# Check largest contours
# =====================================
for contour in contours[:20]:

    perimeter = cv2.arcLength(contour, True)

    approx = cv2.approxPolyDP(
        contour,
        0.02 * perimeter,
        True
    )

    area = cv2.contourArea(contour)

    print(
        f"Corners: {len(approx)}  Area: {int(area)}"
    )

    if len(approx) == 4 and area > 500000:
        sheet_contour = approx
        break

# =====================================
# Draw result
# =====================================
if sheet_contour is not None:

    cv2.drawContours(
        original,
        [sheet_contour],
        -1,
        (0, 255, 0),
        5
    )

    print("\nOMR Sheet Found")

else:
    print("\nOMR Sheet Not Found")

# =====================================
# Resize display
# =====================================
display_original = cv2.resize(
    original,
    (700, 900)
)

display_edges = cv2.resize(
    edges,
    (700, 900)
)

# =====================================
# Show images
# =====================================
cv2.imshow(
    "Detected OMR Sheet",
    display_original
)

cv2.imshow(
    "Edges",
    display_edges
)

cv2.waitKey(0)
cv2.destroyAllWindows()