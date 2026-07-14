import cv2

from utils.image_utils import (
    load_image,
    convert_to_grayscale,
    apply_threshold,
)


def find_bubbles(thresh):

    contours, _ = cv2.findContours(
        thresh,
        cv2.RETR_EXTERNAL,
        cv2.CHAIN_APPROX_SIMPLE
    )

    print(f"Total Contours Found : {len(contours)}")

    bubble_contours = []

    for contour in contours:

        area = cv2.contourArea(contour)

        # Ignore tiny noise
        if area < 30:
            continue

        # Ignore very large objects
        if area > 2000:
            continue

        x, y, w, h = cv2.boundingRect(contour)

        aspect_ratio = w / float(h)

        # Accept slightly distorted circles
        if 0.6 <= aspect_ratio <= 1.4:
            bubble_contours.append(contour)

    print(f"Bubble Contours : {len(bubble_contours)}")

    return bubble_contours


def detect_bubbles(image_path):

    image = load_image(image_path)

    gray = convert_to_grayscale(image)

    thresh = apply_threshold(gray)

    bubbles = find_bubbles(thresh)

    print(f"Detected Bubbles : {len(bubbles)}")

    output = image.copy()

    cv2.drawContours(output, bubbles, -1, (0, 255, 0), 2)

    cv2.imshow("Detected Bubbles", output)
    cv2.waitKey(0)
    cv2.destroyAllWindows()


if __name__ == "__main__":

    detect_bubbles("images/sample_omr.jpeg")