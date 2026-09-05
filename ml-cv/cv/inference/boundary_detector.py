import cv2
import numpy as np


def detect_boundaries(image: np.ndarray) -> np.ndarray:
    """
    Detect potential cadastral boundaries using a classical
    computer-vision edge detection baseline.

    Args:
        image: RGB image as a NumPy array.

    Returns:
        Binary boundary mask.
    """

    if image is None:
        raise ValueError("Image cannot be None.")

    if image.size == 0:
        raise ValueError("Image is empty.")

    if image.ndim != 3:
        raise ValueError("Expected an RGB image with shape (H, W, C).")

    if image.shape[2] != 3:
        raise ValueError("Expected exactly 3 image channels.")

    gray = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)

    blurred = cv2.GaussianBlur(gray, (5, 5), 0)

    edges = cv2.Canny(
        blurred,
        threshold1=50,
        threshold2=150,
    )

    return edges