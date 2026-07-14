import cv2
import numpy as np


def load_image(image_path):
    """
    Load an image from the given file path.

    Args:
        image_path (str): Path to the image.

    Returns:
        image (numpy.ndarray): Loaded image.

    Raises:
        FileNotFoundError: If image cannot be loaded.
    """
    image = cv2.imread(image_path)

    if image is None:
        raise FileNotFoundError(f"Unable to load image: {image_path}")

    return image


def save_image(image, output_path):
    """
    Save an image.

    Args:
        image: OpenCV image.
        output_path (str): Destination path.
    """
    cv2.imwrite(output_path, image)


def resize_image(image, width=800):
    """
    Resize image while maintaining aspect ratio.

    Args:
        image: OpenCV image.
        width (int): Desired width.

    Returns:
        Resized image.
    """
    h, w = image.shape[:2]

    ratio = width / float(w)
    height = int(h * ratio)

    return cv2.resize(image, (width, height))


def convert_to_grayscale(image):
    """
    Convert image to grayscale.

    Args:
        image: OpenCV image.

    Returns:
        Grayscale image.
    """
    return cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)


def apply_gaussian_blur(image, kernel_size=(5, 5)):
    """
    Apply Gaussian Blur.

    Args:
        image: Input image.
        kernel_size (tuple): Blur kernel.

    Returns:
        Blurred image.
    """
    return cv2.GaussianBlur(image, kernel_size, 0)


def apply_threshold(image):
    """
    Apply OTSU Binary Threshold.

    Args:
        image: Grayscale image.

    Returns:
        Binary threshold image.
    """
    _, thresh = cv2.threshold(
        image,
        0,
        255,
        cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU
    )

    return thresh


def detect_edges(image, low_threshold=75, high_threshold=200):
    """
    Perform Canny edge detection.

    Args:
        image: Input image.

    Returns:
        Edge image.
    """
    return cv2.Canny(image, low_threshold, high_threshold)


def crop_region(image, x, y, width, height):
    """
    Crop a rectangular region.

    Args:
        image: Input image.
        x (int): X coordinate.
        y (int): Y coordinate.
        width (int): Width.
        height (int): Height.

    Returns:
        Cropped image.
    """
    return image[y:y + height, x:x + width]


def draw_rectangle(image, x, y, width, height,
                   color=(0, 255, 0), thickness=2):
    """
    Draw rectangle for debugging.

    Returns:
        Image with rectangle.
    """
    output = image.copy()

    cv2.rectangle(
        output,
        (x, y),
        (x + width, y + height),
        color,
        thickness
    )

    return output


def draw_circle(image, center, radius,
                color=(255, 0, 0), thickness=2):
    """
    Draw circle for debugging.

    Returns:
        Image with circle.
    """
    output = image.copy()

    cv2.circle(
        output,
        center,
        radius,
        color,
        thickness
    )

    return output


def show_image(window_name, image):
    """
    Display image.

    Press any key to continue.
    """
    cv2.imshow(window_name, image)
    cv2.waitKey(0)
    cv2.destroyAllWindows()


def get_image_dimensions(image):
    """
    Return image width and height.

    Returns:
        (width, height)
    """
    height, width = image.shape[:2]
    return width, height