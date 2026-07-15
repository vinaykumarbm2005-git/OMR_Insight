import cv2
import numpy as np

from utils.image_utils import (
    load_image,
    convert_to_grayscale,
    apply_threshold,
)


# =====================================
# Find Bubble Contours
# =====================================
def find_bubbles(thresh):

    contours, _ = cv2.findContours(
        thresh,
        cv2.RETR_EXTERNAL,
        cv2.CHAIN_APPROX_SIMPLE
    )

    print(f"Total Contours Found: {len(contours)}")

    bubble_contours = []

    for contour in contours:

        area = cv2.contourArea(contour)

        # Ignore tiny noise
        if area < 180:
            continue

        # Ignore large regions
        if area > 800:
            continue

        x, y, w, h = cv2.boundingRect(contour)

        aspect_ratio = w / float(h)

        # Bubble should be nearly circular
        if aspect_ratio < 0.7 or aspect_ratio > 1.3:
            continue

        perimeter = cv2.arcLength(contour, True)

        if perimeter == 0:
            continue

        circularity = (
            4 * 3.14159 * area /
            (perimeter * perimeter)
        )

        # Accept circular objects only
        if circularity < 0.85:
            continue

        bubble_contours.append(contour)

    print(f"Bubble Contours Found: {len(bubble_contours)}")

    return bubble_contours


# =====================================
# Main Detection Function
# =====================================
def detect_bubbles(image_path):

    image = load_image(image_path)
    # Crop only answer section
    image = image[340:1180, 80:780]


    gray = convert_to_grayscale(image)

    thresh = apply_threshold(gray)

    kernel = np.ones((5,5), np.uint8)

    thresh = cv2.morphologyEx(
        thresh,
        cv2.MORPH_OPEN,
        kernel
    )

    bubbles = find_bubbles(thresh)

    print(f"Detected Bubbles: {len(bubbles)}")

    output = image.copy()

    for contour in bubbles:

        x, y, w, h = cv2.boundingRect(contour)

        center_x = x + w // 2
        center_y = y + h // 2

        cv2.circle(
            output,
            (center_x, center_y),
            10,
            (0, 255, 0),
            2
        )

    cv2.imshow(
        "Detected Bubbles",
        cv2.resize(output, (800, 1000))
    )

    cv2.imshow(
        "Binary Image",
        cv2.resize(thresh, (800, 1000))
    )

    cv2.waitKey(0)
    cv2.destroyAllWindows()


# =====================================
# Run
# =====================================
if __name__ == "__main__":

    detect_bubbles(
        "images/warped_omr.jpg"
    )