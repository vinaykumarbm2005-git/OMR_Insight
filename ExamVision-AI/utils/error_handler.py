"""
Centralized error messages for the ExamVision AI
Computer Vision module.
"""


class ScannerErrors:
    NO_SHEET = "No OMR Sheet Detected"

    IMAGE_BLURRY = "Image Blurry"

    ROLL_NUMBER_NOT_DETECTED = "Roll Number Not Detected"

    MULTIPLE_BUBBLES = "Multiple Bubbles Detected"

    INVALID_TEMPLATE = "Invalid Template"

    CAMERA_NOT_AVAILABLE = "Camera Not Available"

    UNKNOWN_ERROR = "Unknown Error"
    
if __name__ == "__main__":
    print(ScannerErrors.NO_SHEET)
    print(ScannerErrors.IMAGE_BLURRY)
    print(ScannerErrors.INVALID_TEMPLATE)