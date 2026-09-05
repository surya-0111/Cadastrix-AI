import random

import numpy as np


class BuildingSegmentationAugmentation:
    """
    Apply the same spatial augmentation to an RGB image and its mask.

    Supported augmentations:
    - horizontal flip
    - vertical flip
    - 90-degree rotation
    """

    def __init__(
        self,
        horizontal_flip_prob: float = 0.5,
        vertical_flip_prob: float = 0.5,
        rotate_90_prob: float = 0.5,
    ) -> None:
        for name, probability in {
            "horizontal_flip_prob": horizontal_flip_prob,
            "vertical_flip_prob": vertical_flip_prob,
            "rotate_90_prob": rotate_90_prob,
        }.items():
            if not 0.0 <= probability <= 1.0:
                raise ValueError(
                    f"{name} must be between 0 and 1."
                )

        self.horizontal_flip_prob = horizontal_flip_prob
        self.vertical_flip_prob = vertical_flip_prob
        self.rotate_90_prob = rotate_90_prob

    def __call__(
        self,
        image: np.ndarray,
        mask: np.ndarray,
    ) -> tuple[np.ndarray, np.ndarray]:
        if image is None or mask is None:
            raise ValueError("Image and mask cannot be None.")

        if image.size == 0 or mask.size == 0:
            raise ValueError("Image and mask cannot be empty.")

        if image.ndim != 3 or image.shape[2] != 3:
            raise ValueError(
                "Expected image with shape (H, W, 3)."
            )

        if mask.ndim != 2:
            raise ValueError(
                "Expected mask with shape (H, W)."
            )

        if image.shape[:2] != mask.shape:
            raise ValueError(
                "Image and mask must have matching height and width."
            )

        image = image.copy()
        mask = mask.copy()

        if random.random() < self.horizontal_flip_prob:
            image = np.fliplr(image).copy()
            mask = np.fliplr(mask).copy()

        if random.random() < self.vertical_flip_prob:
            image = np.flipud(image).copy()
            mask = np.flipud(mask).copy()

        if random.random() < self.rotate_90_prob:
            image = np.rot90(image).copy()
            mask = np.rot90(mask).copy()

        return image, mask