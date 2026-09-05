from pathlib import Path

import numpy as np
import torch
from PIL import Image

from ml.datasets.loader import create_building_dataloader
from ml.models.unet import UNet
from ml.training.trainer import fit, validate


def _create_dataset(root: Path) -> tuple[Path, Path]:
    image_dir = root / "images"
    mask_dir = root / "masks"

    image_dir.mkdir()
    mask_dir.mkdir()

    for index in range(2):
        image = np.zeros((32, 32, 3), dtype=np.uint8)
        image[8:24, 8:24] = [100, 150, 200]

        mask = np.zeros((32, 32), dtype=np.uint8)
        mask[10:20, 10:20] = 255

        Image.fromarray(image).save(
            image_dir / f"sample_{index:03d}.png"
        )

        Image.fromarray(mask).save(
            mask_dir / f"sample_{index:03d}.png"
        )

    return image_dir, mask_dir


def test_validate_returns_required_metrics(tmp_path):
    image_dir, mask_dir = _create_dataset(tmp_path)

    loader = create_building_dataloader(
        image_dir=str(image_dir),
        mask_dir=str(mask_dir),
        batch_size=1,
        shuffle=False,
    )

    model = UNet(
        in_channels=3,
        out_channels=1,
        base_channels=4,
    )

    device = torch.device("cpu")

    metrics = validate(
        model=model,
        loader=loader,
        loss_function=torch.nn.BCEWithLogitsLoss(),
        device=device,
    )

    assert "loss" in metrics
    assert "iou" in metrics
    assert "dice" in metrics
    assert "precision" in metrics
    assert "recall" in metrics
    assert "f1" in metrics
    assert "inference_time_seconds" in metrics

    assert metrics["loss"] >= 0.0
    assert metrics["inference_time_seconds"] >= 0.0


def test_fit_creates_best_checkpoint(tmp_path):
    image_dir, mask_dir = _create_dataset(tmp_path)

    loader = create_building_dataloader(
        image_dir=str(image_dir),
        mask_dir=str(mask_dir),
        batch_size=1,
        shuffle=False,
    )

    model = UNet(
        in_channels=3,
        out_channels=1,
        base_channels=4,
    )

    optimizer = torch.optim.Adam(
        model.parameters(),
        lr=1e-3,
    )

    checkpoint_path = tmp_path / "models" / "building" / "best.pt"

    history = fit(
        model=model,
        train_loader=loader,
        validation_loader=loader,
        optimizer=optimizer,
        device=torch.device("cpu"),
        epochs=1,
        checkpoint_path=checkpoint_path,
    )

    assert len(history) == 1
    assert checkpoint_path.is_file()

    checkpoint = torch.load(
        checkpoint_path,
        map_location="cpu",
    )

    assert "model_state_dict" in checkpoint
    assert "optimizer_state_dict" in checkpoint
    assert "validation_metrics" in checkpoint