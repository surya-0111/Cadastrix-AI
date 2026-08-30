from pathlib import Path

import numpy as np


class SegmentationModel:
    """
    Base interface for cadastral boundary segmentation models.

    A real ML model can later implement predict() without
    changing the rest of the ML-CV pipeline.
    """

    def __init__(self, model_path: str | None = None):
        self.model_path = model_path

        if model_path is not None and not Path(model_path).is_file():
            raise FileNotFoundError(
                f"Model file not found: {model_path}"
            )

    def predict(self, image: np.ndarray) -> np.ndarray:
        """
        Predict a binary boundary mask from an RGB image.

        Args:
            image: RGB image with shape (H, W, 3).

        Returns:
            Binary mask with shape (H, W).
        """

        if image is None:
            raise ValueError("Image cannot be None.")

        if image.size == 0:
            raise ValueError("Image is empty.")

        if image.ndim != 3 or image.shape[2] != 3:
            raise ValueError(
                "Expected RGB image with shape (H, W, 3)."
            )

        raise NotImplementedError(
            "No trained segmentation model is loaded yet."
        )