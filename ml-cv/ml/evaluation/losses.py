import torch
import torch.nn as nn


class DiceLoss(nn.Module):
    """
    Binary Dice loss for segmentation logits.
    """

    def __init__(self, epsilon: float = 1e-7) -> None:
        super().__init__()

        if epsilon <= 0:
            raise ValueError("epsilon must be greater than 0.")

        self.epsilon = epsilon

    def forward(
        self,
        logits: torch.Tensor,
        targets: torch.Tensor,
    ) -> torch.Tensor:
        if logits.shape != targets.shape:
            raise ValueError(
                "Logits and targets must have the same shape."
            )

        if logits.ndim != 4:
            raise ValueError(
                "Expected tensors with shape (N, C, H, W)."
            )

        probabilities = torch.sigmoid(logits)

        targets = targets.float()

        intersection = (
            probabilities * targets
        ).sum(dim=(1, 2, 3))

        denominator = (
            probabilities.sum(dim=(1, 2, 3))
            + targets.sum(dim=(1, 2, 3))
        )

        dice = (
            2.0 * intersection + self.epsilon
        ) / (
            denominator + self.epsilon
        )

        return 1.0 - dice.mean()


class BinarySegmentationLoss(nn.Module):
    """
    Combined BCE-with-logits + Dice loss.
    """

    def __init__(
        self,
        bce_weight: float = 0.5,
        dice_weight: float = 0.5,
    ) -> None:
        super().__init__()

        if bce_weight < 0:
            raise ValueError("bce_weight cannot be negative.")

        if dice_weight < 0:
            raise ValueError("dice_weight cannot be negative.")

        if bce_weight + dice_weight == 0:
            raise ValueError(
                "At least one loss weight must be greater than 0."
            )

        self.bce_weight = bce_weight
        self.dice_weight = dice_weight

        self.bce = nn.BCEWithLogitsLoss()
        self.dice = DiceLoss()

    def forward(
        self,
        logits: torch.Tensor,
        targets: torch.Tensor,
    ) -> torch.Tensor:
        bce_loss = self.bce(logits, targets)
        dice_loss = self.dice(logits, targets)

        return (
            self.bce_weight * bce_loss
            + self.dice_weight * dice_loss
        )