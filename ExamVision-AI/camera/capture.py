import cv2
import sys
import os

def capture_image(output_path="captured_omr.jpg", device_index=0, no_display=False):
    """
    Captures an image from the webcam.
    
    In headless mode (no_display=True), it initializes the camera device,
    reads multiple frames to allow automatic exposure calibration to kick in,
    saves the final frame to disk, and returns immediately.
    
    Args:
        output_path (str): Destination file path.
        device_index (int): Index of the video capture device.
        no_display (bool): If True, run without opening window display interface.
        
    Returns:
        bool: True if capture was successful, False otherwise.
    """
    camera = cv2.VideoCapture(device_index)
    if not camera.isOpened():
        print(f"Error: Could not open camera device {device_index}")
        return False

    if no_display:
        print("Running camera in headless mode. Calibrating exposure...")
        ret = False
        # Feed 5 frames through so camera auto-exposure corrects lighting level gradients
        for _ in range(5):
            ret, frame = camera.read()
        if ret:
            # Ensure folder directory exists before saving
            dir_name = os.path.dirname(output_path)
            if dir_name and not os.path.exists(dir_name):
                os.makedirs(dir_name)
            cv2.imwrite(output_path, frame)
            print(f"Headless frame saved as '{output_path}'")
            camera.release()
            return True
        else:
            print("Error: Failed to capture frame headlessly.")
            camera.release()
            return False

    print("Camera started...")
    print("Press 'c' to capture image")
    print("Press 'q' to quit")
    captured = False

    while True:
        ret, frame = camera.read()
        if not ret:
            print("Failed to capture frame")
            break

        cv2.imshow("ExamVision AI Camera", frame)
        key = cv2.waitKey(1) & 0xFF

        if key == ord('c'):
            # Ensure direct directory exists before saving
            dir_name = os.path.dirname(output_path)
            if dir_name and not os.path.exists(dir_name):
                os.makedirs(dir_name)
            cv2.imwrite(output_path, frame)
            print(f"Image saved as '{output_path}'")
            captured = True
            break
        elif key == ord('q'):
            break

    camera.release()
    cv2.destroyAllWindows()
    return captured


if __name__ == "__main__":
    no_display = "--no-display" in sys.argv or "-nd" in sys.argv
    
    # Retrieve device index from simple command args
    device = 0
    for arg in sys.argv:
        if arg.startswith("--device="):
            try:
                device = int(arg.split("=")[1])
            except ValueError:
                pass
                
    output = "captured_omr.jpg"
    for arg in sys.argv:
        if arg.startswith("--output="):
            output = arg.split("=")[1]

    success = capture_image(output_path=output, device_index=device, no_display=no_display)
    if not success:
        sys.exit(1)