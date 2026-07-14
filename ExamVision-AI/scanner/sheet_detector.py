import cv2

# =====================================
# Load Image
# =====================================
image = cv2.imread("images/sample_omr.jpeg")

if image is None:
    print("Image not found!")
    exit()

# =====================================
# Convert to Grayscale
# =====================================
gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

# =====================================
# Apply Gaussian Blur
# =====================================
blurred = cv2.GaussianBlur(gray, (5, 5), 0)

# =====================================
# Detect Edges
# =====================================
edges = cv2.Canny(
    blurred,
    75,     # lower threshold
    200     # upper threshold
)

# =====================================
# Save Output Images
# =====================================
cv2.imwrite("images/grayscale_omr.jpg", gray)
cv2.imwrite("images/blurred_omr.jpg", blurred)
cv2.imwrite("images/edges_omr.jpg", edges)

print("Grayscale image saved.")
print("Blurred image saved.")
print("Edge image saved.")

# =====================================
# Resize Images for Display
# =====================================
display_width = 600
display_height = 800

original_display = cv2.resize(
    image,
    (display_width, display_height)
)

edge_display = cv2.resize(
    edges,
    (display_width, display_height)
)

# =====================================
# Create Windows
# =====================================
cv2.namedWindow("Original OMR")
cv2.namedWindow("Edges")

cv2.moveWindow("Original OMR", 50, 50)
cv2.moveWindow("Edges", 700, 50)

# =====================================
# Show Images
# =====================================
cv2.imshow("Original OMR", original_display)
cv2.imshow("Edges", edge_display)

# =====================================
# Wait for Key Press
# =====================================
cv2.waitKey(0)
cv2.destroyAllWindows()