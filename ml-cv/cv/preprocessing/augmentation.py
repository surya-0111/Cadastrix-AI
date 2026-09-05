import numpy as np


def horizontal_flip(image: np.ndarray) -> np.ndarray:
    """Flip an image horizontally."""
    if image is None:
        raise ValueError("Image cannot be None.")

    return np.fliplr(image).copy()


def vertical_flip(image: np.ndarray) -> np.ndarray:
    """Flip an image vertically."""
    if image is None:
        raise ValueError("Image cannot be None.")

    return np.flipud(image).copy()


def rotate_90(image: np.ndarray) -> np.ndarray:
    """Rotate an image by 90 degrees."""
    if image is None:
        raise ValueError("Image cannot be None.")

    return np.rot90(image).copy()
