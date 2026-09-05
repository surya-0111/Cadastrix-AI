import numpy as np


def normalize_image(image):
    """
    Normalize an RGB image to float32 range [0, 1].
    """

    image = np.asarray(image)

    if image.dtype == np.uint8:
        return image.astype(np.float32) / 255.0

    image = image.astype(np.float32)

    # Handle arbitrary raster ranges safely
    min_val = np.nanmin(image)
    max_val = np.nanmax(image)

    if max_val > min_val:
        image = (image - min_val) / (max_val - min_val)
    else:
        image = np.zeros_like(image, dtype=np.float32)

    return np.clip(image, 0.0, 1.0)