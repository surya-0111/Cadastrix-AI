import cv2
import numpy as np


def clean_road_mask(
    mask: np.ndarray,
    kernel_size: int = 5,
    min_component_area: int = 100,
) -> np.ndarray:
    """
    Clean a binary road mask using morphological operations and
    connected-component filtering.

    Args:
        mask: 2D binary mask. Non-zero pixels are treated as roads.
        kernel_size: Size of the morphological kernel.
        min_component_area: Minimum connected component area to retain.

    Returns:
        Cleaned binary mask with values 0 or 255.
    """
    if mask is None:
        raise ValueError("Mask cannot be None.")

    if not isinstance(mask, np.ndarray):
        raise ValueError("Mask must be a NumPy array.")

    if mask.ndim != 2:
        raise ValueError("Mask must be a 2D array.")

    if mask.size == 0:
        raise ValueError("Mask is empty.")

    if kernel_size <= 0 or kernel_size % 2 == 0:
        raise ValueError("kernel_size must be a positive odd number.")

    if min_component_area < 0:
        raise ValueError("min_component_area must be non-negative.")

    # Convert any non-zero values to a standard binary mask.
    binary = np.where(mask > 0, 255, 0).astype(np.uint8)

    kernel = cv2.getStructuringElement(
        cv2.MORPH_ELLIPSE,
        (kernel_size, kernel_size),
    )

    # Remove small gaps and connect nearby road segments.
    cleaned = cv2.morphologyEx(
        binary,
        cv2.MORPH_CLOSE,
        kernel,
        iterations=2,
    )

    # Remove isolated noise.
    cleaned = cv2.morphologyEx(
        cleaned,
        cv2.MORPH_OPEN,
        kernel,
        iterations=1,
    )

    # Remove small connected components.
    num_labels, labels, stats, _ = cv2.connectedComponentsWithStats(
        cleaned,
        connectivity=8,
    )

    filtered = np.zeros_like(cleaned)

    for label in range(1, num_labels):
        area = stats[label, cv2.CC_STAT_AREA]

        if area >= min_component_area:
            filtered[labels == label] = 255

    return filtered