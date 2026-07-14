import cv2

# Open default camera (0 = laptop webcam)
camera = cv2.VideoCapture(0)

if not camera.isOpened():
    print("Could not open camera")
    exit()

print("Camera started...")
print("Press 'c' to capture image")
print("Press 'q' to quit")

while True:
    # Read frame from camera
    ret, frame = camera.read()

    # If frame not captured
    if not ret:
        print("Failed to capture frame")
        break

    # Show camera feed
    cv2.imshow("ExamVision AI Camera", frame)

    # Wait for key press
    key = cv2.waitKey(1)

    # Capture image
    if key == ord('c'):
        cv2.imwrite("captured_omr.jpg", frame)
        print("Image saved as captured_omr.jpg")

    # Quit application
    elif key == ord('q'):
        break

# Release resources
camera.release()
cv2.destroyAllWindows()