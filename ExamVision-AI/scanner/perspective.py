import cv2
import numpy as np

# =====================================
# Load Image
# =====================================
image = cv2.imread("images/sample_omr.jpeg")

if image is None:
    print("Image not found!")
    exit()

height, width = image.shape[:2]

print(f"Width : {width}")
print(f"Height: {height}")

# =====================================
# Define Corners
# =====================================
pts1 = np.float32([
    [0, 0],
    [width, 0],
    [0, height],
    [width, height]
])

# Output size
output_width = 1000
output_height = 1400

pts2 = np.float32([
    [0, 0],
    [output_width, 0],
    [0, output_height],
    [output_width, output_height]
])

# =====================================
# Perspective Transform
# =====================================
matrix = cv2.getPerspectiveTransform(
    pts1,
    pts2
)

warped = cv2.warpPerspective(
    image,
    matrix,
    (output_width, output_height)
)

# Save result
cv2.imwrite(
    "images/warped_omr.jpg",
    warped
)

# Resize for display
display_original = cv2.resize(
    image,
    (600, 800)
)

display_warped = cv2.resize(
    warped,
    (600, 800)
)

# Show windows
cv2.imshow(
    "Original OMR",
    display_original
)

cv2.imshow(
    "Warped OMR",
    display_warped
)

cv2.waitKey(0)
cv2.destroyAllWindows()