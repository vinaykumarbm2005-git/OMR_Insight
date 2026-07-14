import cv2

# =====================================
# Load Image
# =====================================
image = cv2.imread("images/sample_omr.jpeg")

if image is None:
    print("Image not found!")
    exit()

# =====================================
# Image Information
# =====================================
height, width, channels = image.shape

print("\n===== IMAGE INFORMATION =====")
print("Width    :", width)
print("Height   :", height)
print("Channels :", channels)

# =====================================
# Convert to Grayscale
# =====================================
gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

# =====================================
# Resize Images for Display
# =====================================
display_width = 600
display_height = 800

original_display = cv2.resize(
    image,
    (display_width, display_height)
)

gray_display = cv2.resize(
    gray,
    (display_width, display_height)
)

# =====================================
# Create Windows
# =====================================
cv2.namedWindow("Original OMR", cv2.WINDOW_NORMAL)
cv2.namedWindow("Grayscale OMR", cv2.WINDOW_NORMAL)

# Set window size
cv2.resizeWindow("Original OMR", display_width, display_height)
cv2.resizeWindow("Grayscale OMR", display_width, display_height)

# Move windows to left and right
cv2.moveWindow("Original OMR", 50, 50)
cv2.moveWindow("Grayscale OMR", 700, 50)

# =====================================
# Show Images
# =====================================
cv2.imshow("Original OMR", original_display)
cv2.imshow("Grayscale OMR", gray_display)

# =====================================
# Wait for key press
# =====================================
cv2.waitKey(0)

# =====================================
# Close all windows
# =====================================
cv2.destroyAllWindows()