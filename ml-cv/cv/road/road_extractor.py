import cv2
import numpy as np


def extract_roads(
    image: np.ndarray,
    canny_low: int = 50,
    canny_high: int = 150,
    kernel_size: int = 5,
    min_area: int = 100,
) -> np.ndarray:
    """
    Extract a baseline road mask from an RGB image.

    This is a classical computer-vision baseline, not a trained
    road-segmentation model.

    Args:
        image: RGB image as an H x W x 3 NumPy array.
        canny_low: Lower threshold for Canny edge detection.
        canny_high: Upper threshold for Canny edge detection.
        kernel_size: Morphological kernel size.
        min_area: Minimum connected-component area to retain.

    Returns:
        Binary road mask as uint8, where road candidates are 255.

    Raises:
        ValueError: If the image or parameters are invalid.
    """
    if image is None:
        raise ValueError("Image cannot be None.")

    if not isinstance(image, np.ndarray):
        raise ValueError("Image must be a NumPy array.")

    if image.ndim != 3 or image.shape[2] != 3:
        raise ValueError("Image must have shape (height, width, 3).")

    if image.size == 0:
        raise ValueError("Image is empty.")

    if canny_low < 0 or canny_high <= canny_low:
        raise ValueError("Canny thresholds must satisfy 0 <= low < high.")

    if kernel_size <= 0 or kernel_size % 2 == 0:
        raise ValueError("kernel_size must be a positive odd number.")

    if min_area < 0:
        raise ValueError("min_area must be non-negative.")

    # Convert RGB image to grayscale.
    gray = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)

    # Reduce small-scale noise.
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)

    # Detect strong linear boundaries.
    edges = cv2.Canny(
        blurred,
        threshold1=canny_low,
        threshold2=canny_high,
    )

    # Connect nearby road-edge fragments.
    kernel = cv2.getStructuringElement(
        cv2.MORPH_RECT,
        (kernel_size, kernel_size),
    )

    closed = cv2.morphologyEx(
        edges,
        cv2.MORPH_CLOSE,
        kernel,
        iterations=2,
    )

    # Fill enclosed regions between detected road edges.
    contours, _ = cv2.findContours(
        closed,
        cv2.RETR_EXTERNAL,
        cv2.CHAIN_APPROX_SIMPLE,
    )

    mask = np.zeros_like(gray, dtype=np.uint8)

    for contour in contours:
        area = cv2.contourArea(contour)

        if area >= min_area:
            cv2.drawContours(
                mask,
                [contour],
                contourIdx=-1,
                color=255,
                thickness=cv2.FILLED,
            )

    return mask