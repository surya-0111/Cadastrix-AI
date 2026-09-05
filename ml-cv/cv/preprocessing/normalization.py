import numpy as np


def normalize_image(image: np.ndarray) -> np.ndarray:
    """
    Normalize an image from uint8 [0, 255] to float32 [0, 1].
    """
    if image is None:
        raise ValueError("Image cannot be None.")

    if image.size == 0:
        raise ValueError("Image is empty.")

    image = image.astype(np.float32)

    min_value = image.min()
    max_value = image.max()

    if max_value == min_value:
        return np.zeros_like(image, dtype=np.float32)

    normalized = (image - min_value) / (max_value - min_value)

    return normalized
