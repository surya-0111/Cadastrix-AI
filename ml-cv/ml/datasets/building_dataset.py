from pathlib import Path

import numpy as np
import rasterio
import torch
from PIL import Image
from torch.utils.data import Dataset


SUPPORTED_IMAGE_EXTENSIONS = {".tif", ".tiff", ".png", ".jpg", ".jpeg"}


class BuildingSegmentationDataset(Dataset):
    """
    Dataset for paired building images and binary building masks.

    Expected directory structure:

        images/
            sample_001.tif
            sample_002.tif

        masks/
            sample_001.png
            sample_002.png

    Image and mask files must have matching stems.
    """

    def __init__(
        self,
        image_dir: str | Path,
        mask_dir: str | Path,
        transform=None,
    ) -> None:
        self.image_dir = Path(image_dir)
        self.mask_dir = Path(mask_dir)
        self.transform = transform

        if not self.image_dir.is_dir():
            raise FileNotFoundError(
                f"Image directory not found: {self.image_dir}"
            )

        if not self.mask_dir.is_dir():
            raise FileNotFoundError(
                f"Mask directory not found: {self.mask_dir}"
            )

        image_paths = [
            path
            for path in self.image_dir.iterdir()
            if path.is_file()
            and path.suffix.lower() in SUPPORTED_IMAGE_EXTENSIONS
        ]

        self.samples = []

        for image_path in sorted(image_paths):
            mask_path = self.mask_dir / f"{image_path.stem}.png"

            if not mask_path.is_file():
                raise FileNotFoundError(
                    f"Mask not found for image '{image_path.name}': "
                    f"{mask_path}"
                )

            self.samples.append((image_path, mask_path))

        if not self.samples:
            raise ValueError(
                f"No supported images found in {self.image_dir}"
            )

    def __len__(self) -> int:
        return len(self.samples)

    @staticmethod
    def _load_image(path: Path) -> np.ndarray:
        if path.suffix.lower() in {".tif", ".tiff"}:
            with rasterio.open(path) as src:
                image = src.read()

            if image.shape[0] < 3:
                raise ValueError(
                    f"Expected at least 3 bands in image: {path}"
                )

            # Rasterio: (C, H, W) -> (H, W, C)
            image = np.transpose(image[:3], (1, 2, 0))

        else:
            image = np.array(Image.open(path).convert("RGB"))

        return image

    @staticmethod
    def _load_mask(path: Path) -> np.ndarray:
        mask = np.array(Image.open(path).convert("L"))

        if mask.ndim != 2:
            raise ValueError(f"Expected 2D mask: {path}")

        return (mask > 0).astype(np.float32)

    def __getitem__(self, index: int) -> tuple[torch.Tensor, torch.Tensor]:
        image_path, mask_path = self.samples[index]

        image = self._load_image(image_path)
        mask = self._load_mask(mask_path)

        if image.shape[:2] != mask.shape:
            raise ValueError(
                f"Image/mask size mismatch for '{image_path.name}': "
                f"image={image.shape[:2]}, mask={mask.shape}"
            )

        if self.transform is not None:
            image, mask = self.transform(image, mask)

        image = image.astype(np.float32)

        if image.max() > 1.0:
            image /= 255.0

        image_tensor = torch.from_numpy(
            np.transpose(image, (2, 0, 1))
        ).float()

        mask_tensor = torch.from_numpy(mask).unsqueeze(0).float()

        return image_tensor, mask_tensor