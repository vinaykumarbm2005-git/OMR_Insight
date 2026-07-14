import cv2

# =====================================
# STEP 1 : Load Image
# =====================================
image = cv2.imread("images/sample_omr.jpeg")

if image is None:
    print("Image not found!")
    exit()

# Keep original copy
original = image.copy()

# =====================================
# STEP 2 : Convert to Grayscale
# =====================================
gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

# =====================================
# STEP 3 : Gaussian Blur
# =====================================
blurred = cv2.GaussianBlur(gray, (5, 5), 0)

# =====================================
# STEP 4 : Edge Detection
# =====================================
edges = cv2.Canny(blurred, 75, 200)

# =====================================
# STEP 5 : Find Contours
# =====================================
contours, hierarchy = cv2.findContours(
    edges,
    cv2.RETR_EXTERNAL,
    cv2.CHAIN_APPROX_SIMPLE
)

print(f"\nTotal contours detected: {len(contours)}")

# =====================================
# STEP 6 : Draw Contours
# =====================================
cv2.drawContours(
    original,
    contours,
    -1,
    (0, 255, 0),
    3
)

# =====================================
# STEP 7 : Resize for Display
# =====================================
display_original = cv2.resize(original, (700, 900))
display_edges = cv2.resize(edges, (700, 900))

# =====================================
# STEP 8 : Display Results
# =====================================
cv2.imshow("Detected Contours", display_original)
cv2.imshow("Edges", display_edges)

cv2.waitKey(0)
cv2.destroyAllWindows()