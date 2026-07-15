import cv2
import os
import sys

# Ensure parent directory is in sys.path for proper imports inside scanner package
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

from scanner.sheet_detector import detect_sheet_corners
from scanner.perspective import correct_perspective
from scanner.template_loader import load_template


def process_omr(image_path, exam_type):
    print("INSIDE process_omr()")

    """
    Runs the complete OMR pre-processing CV pipeline:
    1. Loads and validates exam-specific configuration layout templates.
    2. Loads the target scan/photograph image.
    3. Runs adaptive edge segmentation to locate OMR sheet corners.
    4. Applies perspective transformation warping the sheet to standard 850x1200.
    5. Corrects any rotation skew (90°, 180°, 270°) using layout density metrics.

    Args:
        image_path (str): File system route to the sheet BGR capture.
        exam_type (str): Key of the targeted template (KCET, NEET, JEE).

    Returns:
        dict: Containing:
            "warped_image" (numpy.ndarray): Standardized (850x1200x3) upright BGR sheet output.
            "orientation" (int): Clockwise angle adjustment (0, 90, 180, 270).
            "confidence" (float): Geometric alignment confidence (0 to 100).
            "template" (dict): Fully validated layout template dictionary.
    """
    # Step 1: Load template (fail early if template doesn't exist/validate)
    template = load_template(exam_type)

    # Step 2: Validate image file route and load BGR image matrix
    if not os.path.exists(image_path):
        raise FileNotFoundError(f"Input image file was not found: '{image_path}'")

    image = cv2.imread(image_path)
    if image is None:
        raise ValueError(
            f"Unable to read or decode image matrix from file: '{image_path}'"
        )

    # Step 3: Run OMR Sheet Detection to find corners
    corners = detect_sheet_corners(image)

    if corners is None:
        raise ValueError(
            "OMR sheet detection failed: no valid page contours found."
        )

    print("\nDetected Corners:")
    for i, point in enumerate(corners):
        print(f"Corner {i+1}: {point}")

    # Step 4: Perform perspective alignment and correct rotation skew
    warped_image, orientation, confidence = correct_perspective(image, corners)
    if warped_image is None:
        raise ValueError(
            "Perspective correction failed: unable to transform and align coordinate plane."
        )

    return {
        "warped_image": warped_image,
        "orientation": orientation,
        "confidence": confidence,
        "template": template
    }


# =====================================
# Standalone Execution (for Demo/Test)
# =====================================
if __name__ == "__main__":
    # Settings
    no_display = "--no-display" in sys.argv or "-nd" in sys.argv
    img_path = "images/sample_omr.jpeg"
    exam = "KCET"

    if len(sys.argv) > 1 and not sys.argv[1].startswith("-"):
        img_path = sys.argv[1]
    if len(sys.argv) > 2 and not sys.argv[2].startswith("-"):
        exam = sys.argv[2]

    print("\n=============================================")
    print("      ExamVision AI: CV Processing Pipeline  ")
    print("=============================================")
    print(f"Target Image: {img_path}")
    print(f"Exam Type:    {exam}\n")

    try:
        result = process_omr(img_path, exam)

        print("Pipeline Execution: SUCCESS!")
        print(f"  - Warped Dimensions:    {result['warped_image'].shape[1]}W x {result['warped_image'].shape[0]}H")
        print(f"  - Corrected Rotation:   {result['orientation']} degrees CW")
        print(f"  - Alignment Confidence: {result['confidence']:.2f}%")
        print(f"  - Config Questions:     {result['template']['total_questions']}")
        print(f"  - Template Target:      {result['template']['exam_type']}")

        # Save output image
        out_path = "images/warped_omr.jpg"
        cv2.imwrite(out_path, result["warped_image"])
        print(f"\nResulting aligned OMR saved to '{out_path}'")

        if not no_display:
            # Show warped result
            display_warped = cv2.resize(result["warped_image"], (600, 847))
            cv2.imshow("ExamVision CV Pipeline - Warped OMR Output", display_warped)
            cv2.waitKey(0)
            cv2.destroyAllWindows()

    except Exception as e:
        print(f"Pipeline Execution: FAILED!")
        print(f"Error Type: {type(e).__name__}")
        print(f"Error Msg:  {e}")
        sys.exit(1)
