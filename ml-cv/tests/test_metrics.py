import pytest
import torch

from ml.evaluation.losses import (
    BinarySegmentationLoss,
    DiceLoss,
)
from ml.evaluation.metrics import (
    binary_dice,
    binary_f1,
    binary_iou,
    binary_precision,
    binary_recall,
)


def test_perfect_prediction_metrics():
    targets = torch.tensor(
        [[
            [0.0, 1.0],
            [1.0, 0.0],
        ]]
    )

    predictions = targets.clone()

    assert binary_iou(predictions, targets) == pytest.approx(1.0)
    assert binary_dice(predictions, targets) == pytest.approx(1.0)
    assert binary_precision(predictions, targets) == pytest.approx(1.0)
    assert binary_recall(predictions, targets) == pytest.approx(1.0)
    assert binary_f1(predictions, targets) == pytest.approx(1.0)


def test_partial_prediction_metrics():
    targets = torch.tensor(
        [[
            [1.0, 1.0],
            [0.0, 0.0],
        ]]
    )

    predictions = torch.tensor(
        [[
            [1.0, 0.0],
            [1.0, 0.0],
        ]]
    )

    assert binary_iou(
        predictions,
        targets,
    ) == pytest.approx(1.0 / 3.0)

    assert binary_dice(
        predictions,
        targets,
    ) == pytest.approx(0.5)

    assert binary_precision(
        predictions,
        targets,
    ) == pytest.approx(0.5)

    assert binary_recall(
        predictions,
        targets,
    ) == pytest.approx(0.5)

    assert binary_f1(
        predictions,
        targets,
    ) == pytest.approx(0.5)


def test_dice_loss_is_zero_for_perfect_prediction():
    loss_function = DiceLoss()

    targets = torch.ones(
        (1, 1, 4, 4)
    )

    logits = torch.full(
        (1, 1, 4, 4),
        20.0,
    )

    loss = loss_function(
        logits,
        targets,
    )

    assert loss.item() < 1e-5


def test_combined_loss_returns_scalar():
    loss_function = BinarySegmentationLoss()

    logits = torch.randn(
        2, 1, 32, 32
    )

    targets = torch.randint(
        0,
        2,
        (2, 1, 32, 32),
    ).float()

    loss = loss_function(
        logits,
        targets,
    )

    assert loss.ndim == 0
    assert torch.isfinite(loss)