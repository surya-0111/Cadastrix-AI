from pathlib import Path
from time import perf_counter

import torch
from torch.utils.data import DataLoader

from ml.evaluation.losses import BinarySegmentationLoss
from ml.evaluation.metrics import (
    binary_dice,
    binary_f1,
    binary_iou,
    binary_precision,
    binary_recall,
)


def _move_batch_to_device(
    images: torch.Tensor,
    masks: torch.Tensor,
    device: torch.device,
) -> tuple[torch.Tensor, torch.Tensor]:
    images = images.to(device, non_blocking=True)
    masks = masks.to(device, non_blocking=True)

    return images, masks


def train_one_epoch(
    model: torch.nn.Module,
    loader: DataLoader,
    optimizer: torch.optim.Optimizer,
    loss_function: torch.nn.Module,
    device: torch.device,
) -> float:
    """
    Train the model for one epoch and return mean training loss.
    """

    model.train()

    total_loss = 0.0
    total_samples = 0

    for images, masks in loader:
        images, masks = _move_batch_to_device(
            images,
            masks,
            device,
        )

        optimizer.zero_grad(set_to_none=True)

        logits = model(images)
        loss = loss_function(logits, masks)

        loss.backward()
        optimizer.step()

        batch_size = images.shape[0]

        total_loss += loss.item() * batch_size
        total_samples += batch_size

    if total_samples == 0:
        raise ValueError("Training loader is empty.")

    return total_loss / total_samples


@torch.no_grad()
def validate(
    model: torch.nn.Module,
    loader: DataLoader,
    loss_function: torch.nn.Module,
    device: torch.device,
) -> dict[str, float]:
    """
    Validate a segmentation model.

    Returns:
        Mean loss and segmentation metrics.
    """

    model.eval()

    total_loss = 0.0
    total_samples = 0

    metric_values = {
        "iou": [],
        "dice": [],
        "precision": [],
        "recall": [],
        "f1": [],
    }

    start_time = perf_counter()

    for images, masks in loader:
        images, masks = _move_batch_to_device(
            images,
            masks,
            device,
        )

        logits = model(images)
        loss = loss_function(logits, masks)

        probabilities = torch.sigmoid(logits)

        batch_size = images.shape[0]

        total_loss += loss.item() * batch_size
        total_samples += batch_size

        for index in range(batch_size):
            prediction = probabilities[index]
            target = masks[index]

            metric_values["iou"].append(
                binary_iou(prediction, target)
            )

            metric_values["dice"].append(
                binary_dice(prediction, target)
            )

            metric_values["precision"].append(
                binary_precision(prediction, target)
            )

            metric_values["recall"].append(
                binary_recall(prediction, target)
            )

            metric_values["f1"].append(
                binary_f1(prediction, target)
            )

    elapsed_seconds = perf_counter() - start_time

    if total_samples == 0:
        raise ValueError("Validation loader is empty.")

    return {
        "loss": total_loss / total_samples,
        "iou": sum(metric_values["iou"]) / len(metric_values["iou"]),
        "dice": sum(metric_values["dice"]) / len(metric_values["dice"]),
        "precision": (
            sum(metric_values["precision"])
            / len(metric_values["precision"])
        ),
        "recall": (
            sum(metric_values["recall"])
            / len(metric_values["recall"])
        ),
        "f1": sum(metric_values["f1"]) / len(metric_values["f1"]),
        "inference_time_seconds": elapsed_seconds,
    }


def save_checkpoint(
    model: torch.nn.Module,
    optimizer: torch.optim.Optimizer,
    epoch: int,
    validation_metrics: dict[str, float],
    output_path: str | Path,
) -> None:
    """
    Save a training checkpoint.
    """

    output_path = Path(output_path)
    output_path.parent.mkdir(
        parents=True,
        exist_ok=True,
    )

    checkpoint = {
        "epoch": epoch,
        "model_state_dict": model.state_dict(),
        "optimizer_state_dict": optimizer.state_dict(),
        "validation_metrics": validation_metrics,
    }

    torch.save(
        checkpoint,
        output_path,
    )


def fit(
    model: torch.nn.Module,
    train_loader: DataLoader,
    validation_loader: DataLoader,
    optimizer: torch.optim.Optimizer,
    device: torch.device,
    epochs: int,
    checkpoint_path: str | Path,
    loss_function: torch.nn.Module | None = None,
) -> list[dict[str, float]]:
    """
    Train and validate a segmentation model.

    The checkpoint with the lowest validation loss is saved.
    """

    if epochs <= 0:
        raise ValueError("epochs must be greater than 0.")

    if loss_function is None:
        loss_function = BinarySegmentationLoss()

    model.to(device)

    history = []
    best_validation_loss = float("inf")

    for epoch in range(1, epochs + 1):
        training_loss = train_one_epoch(
            model=model,
            loader=train_loader,
            optimizer=optimizer,
            loss_function=loss_function,
            device=device,
        )

        validation_metrics = validate(
            model=model,
            loader=validation_loader,
            loss_function=loss_function,
            device=device,
        )

        epoch_record = {
            "epoch": float(epoch),
            "train_loss": training_loss,
            **validation_metrics,
        }

        history.append(epoch_record)

        if validation_metrics["loss"] < best_validation_loss:
            best_validation_loss = validation_metrics["loss"]

            save_checkpoint(
                model=model,
                optimizer=optimizer,
                epoch=epoch,
                validation_metrics=validation_metrics,
                output_path=checkpoint_path,
            )

    return history