import cv2
import numpy as np


def order_points(points):
    rect = np.zeros((4, 2), dtype="float32")

    s = points.sum(axis=1)

    rect[0] = points[np.argmin(s)]
    rect[2] = points[np.argmax(s)]

    diff = np.diff(points, axis=1)

    rect[1] = points[np.argmin(diff)]
    rect[3] = points[np.argmax(diff)]

    return rect


def detect_sheet_corners(image):

    if image is None:
        return None

    original_height, original_width = image.shape[:2]

    # --------------------------------
    # Resize for faster processing
    # --------------------------------

    target_width = 1000

    scale = target_width / original_width

    resized_height = int(original_height * scale)

    resized = cv2.resize(
        image,
        (target_width, resized_height)
    )

    image_height, image_width = resized.shape[:2]

    image_area = image_height * image_width

    # --------------------------------
    # Convert to Gray
    # --------------------------------

    gray = cv2.cvtColor(
        resized,
        cv2.COLOR_BGR2GRAY
    )

    # --------------------------------
    # Blur
    # --------------------------------

    blurred = cv2.GaussianBlur(
        gray,
        (5, 5),
        0
    )

    # --------------------------------
    # Edge Detection
    # --------------------------------

    edges = cv2.Canny(
        blurred,
        75,
        200
    )

    # --------------------------------
    # Morphological Close
    # --------------------------------

    kernel = np.ones((5, 5), np.uint8)

    edges = cv2.dilate(
        edges,
        kernel,
        iterations=2
    )

    edges = cv2.erode(
        edges,
        kernel,
        iterations=1
    )

    # --------------------------------
    # Find Contours
    # --------------------------------

    contours, _ = cv2.findContours(
        edges,
        cv2.RETR_LIST,
        cv2.CHAIN_APPROX_SIMPLE
    )

    contours = sorted(
        contours,
        key=cv2.contourArea,
        reverse=True
    )

    sheet = None

    for contour in contours:

        area = cv2.contourArea(contour)

        area_ratio = area / image_area

        if area_ratio < 0.10:
            continue

        if area_ratio > 0.90:
            continue

        perimeter = cv2.arcLength(
            contour,
            True
        )

        approx = cv2.approxPolyDP(
            contour,
            0.02 * perimeter,
            True
        )

        if len(approx) != 4:
            continue

        points = approx.reshape(4, 2)

        touches_border = False

        for x, y in points:

            if (
                x < 20 or
                y < 20 or
                x > image_width - 20 or
                y > image_height - 20
            ):
                touches_border = True

        if touches_border:
            continue

        sheet = points
        break

    if sheet is None:
        return None

    sheet = sheet.astype("float32")

    sheet[:, 0] /= scale
    sheet[:, 1] /= scale

    return order_points(sheet)


if __name__ == "__main__":

    image = cv2.imread(
        "images/sample_omr.jpeg"
    )

    corners = detect_sheet_corners(image)

    if corners is None:
        print("OMR sheet not detected")
        exit()

    debug = image.copy()

    for i, point in enumerate(corners):

        x, y = point.astype(int)

        cv2.circle(
            debug,
            (x, y),
            15,
            (0, 0, 255),
            -1
        )

        cv2.putText(
            debug,
            str(i + 1),
            (x + 20, y),
            cv2.FONT_HERSHEY_SIMPLEX,
            1,
            (0, 255, 0),
            3
        )

    cv2.polylines(
        debug,
        [corners.astype(int)],
        True,
        (255, 0, 0),
        5
    )

    cv2.imshow(
        "Detected Sheet",
        cv2.resize(debug, (700, 900))
    )

    cv2.waitKey(0)
    cv2.destroyAllWindows()