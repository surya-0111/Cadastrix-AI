import torch


def _validate_inputs(
    predictions: torch.Tensor,
    targets: torch.Tensor,
) -> None:
    if predictions is None or targets is None:
        raise ValueError("Predictions and targets cannot be None.")

    if predictions.numel() == 0 or targets.numel() == 0:
        raise ValueError("Predictions and targets cannot be empty.")

    if predictions.shape != targets.shape:
        raise ValueError(
            "Predictions and targets must have the same shape."
        )


def _binarize(
    predictions: torch.Tensor,
    targets: torch.Tensor,
    threshold: float = 0.5,
) -> tuple[torch.Tensor, torch.Tensor]:
    if not 0.0 <= threshold <= 1.0:
        raise ValueError("threshold must be between 0 and 1.")

    _validate_inputs(predictions, targets)

    predictions = predictions.float()
    targets = (targets > 0.5).float()

    predictions = (predictions >= threshold).float()

    return predictions, targets


def binary_iou(
    predictions: torch.Tensor,
    targets: torch.Tensor,
    threshold: float = 0.5,
    epsilon: float = 1e-7,
) -> float:
    """
    Calculate binary Intersection over Union.
    """

    predictions, targets = _binarize(
        predictions,
        targets,
        threshold,
    )

    intersection = (predictions * targets).sum()
    union = predictions.sum() + targets.sum() - intersection

    if union == 0:
        return 1.0

    return float(
        ((intersection + epsilon) / (union + epsilon)).item()
    )


def binary_dice(
    predictions: torch.Tensor,
    targets: torch.Tensor,
    threshold: float = 0.5,
    epsilon: float = 1e-7,
) -> float:
    """
    Calculate binary Dice coefficient.
    """

    predictions, targets = _binarize(
        predictions,
        targets,
        threshold,
    )

    intersection = (predictions * targets).sum()
    denominator = predictions.sum() + targets.sum()

    if denominator == 0:
        return 1.0

    return float(
        ((2.0 * intersection + epsilon)
         / (denominator + epsilon)).item()
    )


def binary_precision(
    predictions: torch.Tensor,
    targets: torch.Tensor,
    threshold: float = 0.5,
    epsilon: float = 1e-7,
) -> float:
    """
    Calculate binary precision.
    """

    predictions, targets = _binarize(
        predictions,
        targets,
        threshold,
    )

    true_positive = (predictions * targets).sum()
    false_positive = (predictions * (1.0 - targets)).sum()

    denominator = true_positive + false_positive

    if denominator == 0:
        return 1.0

    return float(
        ((true_positive + epsilon)
         / (denominator + epsilon)).item()
    )


def binary_recall(
    predictions: torch.Tensor,
    targets: torch.Tensor,
    threshold: float = 0.5,
    epsilon: float = 1e-7,
) -> float:
    """
    Calculate binary recall.
    """

    predictions, targets = _binarize(
        predictions,
        targets,
        threshold,
    )

    true_positive = (predictions * targets).sum()
    false_negative = ((1.0 - predictions) * targets).sum()

    denominator = true_positive + false_negative

    if denominator == 0:
        return 1.0

    return float(
        ((true_positive + epsilon)
         / (denominator + epsilon)).item()
    )


def binary_f1(
    predictions: torch.Tensor,
    targets: torch.Tensor,
    threshold: float = 0.5,
    epsilon: float = 1e-7,
) -> float:
    """
    Calculate binary F1 score from precision and recall.
    """

    precision = binary_precision(
        predictions,
        targets,
        threshold=threshold,
        epsilon=epsilon,
    )

    recall = binary_recall(
        predictions,
        targets,
        threshold=threshold,
        epsilon=epsilon,
    )

    denominator = precision + recall

    if denominator == 0:
        return 0.0

    return (
        2.0 * precision * recall / denominator
    )