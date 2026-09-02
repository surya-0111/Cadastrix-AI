from pathlib import Path

import torch
from torch.utils.data import DataLoader, Subset

from ml.datasets.augmentation import BuildingSegmentationAugmentation
from ml.datasets.building_dataset import BuildingSegmentationDataset
from ml.models.unet import UNet
from ml.training.trainer import fit


PROJECT_ROOT = Path(__file__).resolve().parents[2]

IMAGE_DIR = PROJECT_ROOT / "data" / "building" / "images"
MASK_DIR = PROJECT_ROOT / "data" / "building" / "masks"

CHECKPOINT_PATH = (
    PROJECT_ROOT
    / "models"
    / "building"
    / "best.pt"
)


class AugmentedSubset(torch.utils.data.Dataset):
    """
    Dataset wrapper that applies a transform to a subset without
    modifying the underlying base dataset.
    """

    def __init__(self, dataset, indices, transform=None):
        self.dataset = dataset
        self.indices = list(indices)
        self.transform = transform

    def __len__(self):
        return len(self.indices)

    def __getitem__(self, index):
        image, mask = self.dataset[self.indices[index]]

        if self.transform is not None:
            image, mask = self.transform(image, mask)

        image = image.float()
        mask = mask.float()

        return image, mask


def create_train_validation_loaders(
    validation_fraction: float = 0.2,
    batch_size: int = 2,
) -> tuple[DataLoader, DataLoader]:
    """
    Create reproducible training and validation DataLoaders.
    """

    if not 0.0 < validation_fraction < 1.0:
        raise ValueError(
            "validation_fraction must be between 0 and 1."
        )

    if batch_size <= 0:
        raise ValueError(
            "batch_size must be greater than 0."
        )

    base_dataset = BuildingSegmentationDataset(
        image_dir=IMAGE_DIR,
        mask_dir=MASK_DIR,
    )

    dataset_size = len(base_dataset)

    if dataset_size < 2:
        raise ValueError(
            "At least 2 image/mask pairs are required "
            "for a train/validation split."
        )

    validation_size = max(
        1,
        int(round(dataset_size * validation_fraction)),
    )

    train_size = dataset_size - validation_size

    if train_size < 1:
        raise ValueError(
            "Training split must contain at least 1 sample."
        )

    generator = torch.Generator().manual_seed(42)

    all_indices = torch.randperm(
        dataset_size,
        generator=generator,
    ).tolist()

    train_indices = all_indices[:train_size]
    validation_indices = all_indices[train_size:]

    train_dataset = AugmentedSubset(
        dataset=base_dataset,
        indices=train_indices,
        transform=BuildingSegmentationAugmentation(),
    )

    validation_dataset = AugmentedSubset(
        dataset=base_dataset,
        indices=validation_indices,
        transform=None,
    )

    train_loader = DataLoader(
        train_dataset,
        batch_size=batch_size,
        shuffle=True,
        num_workers=0,
        pin_memory=False,
    )

    validation_loader = DataLoader(
        validation_dataset,
        batch_size=batch_size,
        shuffle=False,
        num_workers=0,
        pin_memory=False,
    )

    return train_loader, validation_loader


def train_building_model(
    epochs: int = 10,
    learning_rate: float = 1e-3,
    batch_size: int = 2,
) -> list[dict[str, float]]:
    """
    Train the U-Net building segmentation model.
    """

    if epochs <= 0:
        raise ValueError(
            "epochs must be greater than 0."
        )

    if learning_rate <= 0:
        raise ValueError(
            "learning_rate must be greater than 0."
        )

    train_loader, validation_loader = (
        create_train_validation_loaders(
            batch_size=batch_size,
        )
    )

    device = torch.device(
        "cuda" if torch.cuda.is_available() else "cpu"
    )

    print(f"Device: {device}")
    print(
        f"Training samples: "
        f"{len(train_loader.dataset)}"
    )
    print(
        f"Validation samples: "
        f"{len(validation_loader.dataset)}"
    )
    print(f"Checkpoint: {CHECKPOINT_PATH}")

    model = UNet(
        in_channels=3,
        out_channels=1,
        base_channels=32,
    )

    optimizer = torch.optim.Adam(
        model.parameters(),
        lr=learning_rate,
    )

    history = fit(
        model=model,
        train_loader=train_loader,
        validation_loader=validation_loader,
        optimizer=optimizer,
        device=device,
        epochs=epochs,
        checkpoint_path=CHECKPOINT_PATH,
    )

    for record in history:
        print(
            f"Epoch {int(record['epoch'])}: "
            f"train_loss={record['train_loss']:.4f}, "
            f"val_loss={record['loss']:.4f}, "
            f"IoU={record['iou']:.4f}, "
            f"Dice={record['dice']:.4f}, "
            f"Precision={record['precision']:.4f}, "
            f"Recall={record['recall']:.4f}, "
            f"F1={record['f1']:.4f}, "
            f"inference_time="
            f"{record['inference_time_seconds']:.4f}s"
        )

    print(
        f"Best checkpoint saved to: "
        f"{CHECKPOINT_PATH}"
    )

    return history


if __name__ == "__main__":
    train_building_model()