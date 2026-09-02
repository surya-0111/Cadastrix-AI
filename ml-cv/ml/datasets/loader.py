from torch.utils.data import DataLoader

from ml.datasets.augmentation import BuildingSegmentationAugmentation
from ml.datasets.building_dataset import BuildingSegmentationDataset


def create_building_dataloader(
    image_dir: str,
    mask_dir: str,
    batch_size: int = 4,
    shuffle: bool = True,
    num_workers: int = 0,
    transform=None,
    augment: bool = False,
) -> DataLoader:
    """
    Create a PyTorch DataLoader for building segmentation.

    Args:
        image_dir: Directory containing images.
        mask_dir: Directory containing corresponding masks.
        batch_size: Number of samples per batch.
        shuffle: Whether to shuffle the dataset.
        num_workers: Number of worker processes.
        transform: Optional custom synchronized transform.
        augment: Whether to use the default synchronized augmentation.

    Returns:
        Configured PyTorch DataLoader.
    """

    if batch_size <= 0:
        raise ValueError("batch_size must be greater than 0.")

    if num_workers < 0:
        raise ValueError("num_workers cannot be negative.")

    if transform is not None and augment:
        raise ValueError(
            "Pass either transform or augment=True, not both."
        )

    if augment:
        transform = BuildingSegmentationAugmentation()

    dataset = BuildingSegmentationDataset(
        image_dir=image_dir,
        mask_dir=mask_dir,
        transform=transform,
    )

    return DataLoader(
        dataset,
        batch_size=batch_size,
        shuffle=shuffle,
        num_workers=num_workers,
        pin_memory=False,
    )