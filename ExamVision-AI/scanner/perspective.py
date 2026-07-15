import cv2
import numpy as np
import os
import sys

# Ensure parent directory is in path for standalone runs
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

from scanner.sheet_detector import detect_sheet_corners


def order_points(pts):
    """
    Orders 4 points into: Top-Left, Top-Right, Bottom-Right, Bottom-Left.
    """
    pts = pts.reshape(4, 2)
    # Sort points based on x-coordinate
    x_sorted = pts[np.argsort(pts[:, 0]), :]
    left_most = x_sorted[:2, :]
    right_most = x_sorted[2:, :]

    # Sort left-most coordinates by y-coordinate to get top-left and bottom-left
    left_most = left_most[np.argsort(left_most[:, 1]), :]
    tl, bl = left_most

    # Sort right-most coordinates by y-coordinate to get top-right and bottom-right
    right_most = right_most[np.argsort(right_most[:, 1]), :]
    tr, br = right_most

    return np.array([tl, tr, br, bl], dtype="float32")


def correct_perspective(image, corners):
    """
    Performs perspective correction, normalizes aspect ratio to standard A4 (850x1200),
    and automatically corrects all rotations (90, 180, 270 degrees).

    Args:
        image (numpy.ndarray): Input BGR image.
        corners (numpy.ndarray): Detected corner coordinates (4, 2) from sheet_detector.

    Returns:
        warped_image (numpy.ndarray): Aligned, upright BGR OMR sheet of size (850x1200).
        orientation (int): Total clockwise rotation applied to correct orientation (0, 90, 180, 270).
        confidence (float): Alignment confidence score (0 to 100).
    """
    if image is None or corners is None:
        return None, 0, 0.0

    # Step 1: Order points clockwise starting from top-left
    ordered = order_points(corners)
    (tl, tr, br, bl) = ordered

    # Step 2: Compute estimated dimensions to determine landscape vs portrait capture
    widthA = np.linalg.norm(br - bl)
    widthB = np.linalg.norm(tr - tl)
    maxWidth = max(int(widthA), int(widthB))

    heightA = np.linalg.norm(tr - br)
    heightB = np.linalg.norm(tl - bl)
    maxHeight = max(int(heightA), int(heightB))

    is_landscape = maxWidth > maxHeight
    rotation_applied = 0

    if is_landscape:
        dest_w, dest_h = 1200, 850
    else:
        dest_w, dest_h = 850, 1200

    # Destination coordinates
    destination = np.array([
        [0, 0],
        [dest_w - 1, 0],
        [dest_w - 1, dest_h - 1],
        [0, dest_h - 1]
    ], dtype="float32")

    # Step 3: Perform Initial Perspective Transform
    matrix = cv2.getPerspectiveTransform(ordered, destination)
    warped = cv2.warpPerspective(image, matrix, (dest_w, dest_h))

    # Step 4: Normalize initial aspect ratio to portrait
    if is_landscape:
        warped = cv2.rotate(warped, cv2.ROTATE_90_CLOCKWISE)
        rotation_applied = 90

    # Step 5: Automatically check and correct 180-degree (upside down) rotation.
    # In standard upright A4 templates, the answer Grid bubbles are located in the bottom half.
    # Therefore, the bottom half has significantly higher black ink/structural density
    # than the top half (which contains instructions and white header margins).
    gray = cv2.cvtColor(warped, cv2.COLOR_BGR2GRAY)
    
    # Adaptive threshold to isolate ink components under illumination variations
    th = cv2.adaptiveThreshold(
        gray, 255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY_INV,
        21, 5
    )

    h_w, w_w = warped.shape[:2]
    top_half = th[0:int(h_w / 2), :]
    bot_half = th[int(h_w / 2):, :]

    top_density = cv2.countNonZero(top_half)
    bot_density = cv2.countNonZero(bot_half)

    # If the top half has higher ink density than the bottom half, the document is upside down.
    if top_density > bot_density:
        warped = cv2.rotate(warped, cv2.ROTATE_180)
        rotation_applied = (rotation_applied + 180) % 360

    # Step 6: Standardize final output size to exactly 850 x 1200
    if warped.shape[1] != 850 or warped.shape[0] != 1200:
        warped = cv2.resize(warped, (850, 1200))

    # Step 7: Compute geometric alignment confidence
    # Score closeness of aspect ratio (height / width) to standard layout ratio (1.4117)
    edge1 = np.linalg.norm(tl - tr)
    edge2 = np.linalg.norm(tr - br)
    edge3 = np.linalg.norm(br - bl)
    edge4 = np.linalg.norm(bl - tl)

    w_avg = (edge1 + edge3) / 2.0
    h_avg = (edge2 + edge4) / 2.0
    actual_ratio = h_avg / max(1.0, w_avg)

    aspect_score = max(0.0, 1.0 - abs(actual_ratio - 1.4117) / 1.4117)

    # Score quadrilateral area filling compared to standard bounding box area
    area_quad = 0.5 * abs(
        (tl[0]*tr[1] - tr[0]*tl[1]) +
        (tr[0]*br[1] - br[0]*tr[1]) +
        (br[0]*bl[1] - bl[0]*br[1]) +
        (bl[0]*tl[1] - tl[0]*bl[1])
    )
    min_x, min_y = np.min(ordered, axis=0)
    max_x, max_y = np.max(ordered, axis=0)
    bbox_area = max(1.0, (max_x - min_x) * (max_y - min_y))
    area_score = min(1.0, area_quad / float(bbox_area))

    confidence = (aspect_score * 0.5 + area_score * 0.5) * 100.0

    return warped, rotation_applied, confidence


# =====================================
# Standalone Execution (for Demo/Test)
# =====================================
if __name__ == "__main__":
    # Check if headless arg is present
    no_display = "--no-display" in sys.argv or "-nd" in sys.argv

    # Load default test image
    image_path = "images/sample_omr.jpeg"
    image = cv2.imread(image_path)

    if image is None:
        print(f"Error: Standard image not found at '{image_path}'!")
        sys.exit(1)

    print("Detecting sheet corners...")
    corners = detect_sheet_corners(image)

    if corners is None:
        print("Error: Could not detect OMR sheet corners.")
        sys.exit(1)

    print("Correcting perspective and orientation...")
    warped, rotation, conf = correct_perspective(image, corners)

    if warped is not None:
        print("\nSuccess: OMR Aligned and Corrected!")
        print(f"  Standardized Dimensions: {warped.shape[1]}W x {warped.shape[0]}H")
        print(f"  Rotation Corrected: {rotation} degrees Clockwise")
        print(f"  Alignment Confidence: {conf:.2f}%")

        # Save standard output image
        output_path = "images/warped_omr.jpg"
        cv2.imwrite(output_path, warped)
        print(f"Aligned output saved to '{output_path}'")

        # Display result if GUI is active
        if not no_display:
            # Downscale display image slightly to fit on laptop screens
            display_warped = cv2.resize(warped, (600, 847))
            cv2.imshow("Warped OMR Sheet (Standardized)", display_warped)
            cv2.waitKey(0)
            cv2.destroyAllWindows()
    else:
        print("Error: Perspective warp processing failed.")
        sys.exit(1)