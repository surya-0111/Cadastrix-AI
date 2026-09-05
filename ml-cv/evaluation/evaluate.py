from pathlib import Path

import cv2
import numpy as np
import torch

from inference.predictor import SegmentationPredictor


DATA_ROOT = Path(r"C:\Users\evara\Downloads\massachusetts-buildings\png")
CHECKPOINT = Path(r"ml-cv\models\building\building_unet.pth")

IMAGE_DIR = DATA_ROOT / "test"
LABEL_DIR = DATA_ROOT / "test_labels"

THRESHOLD = 0.5


def dice_score(pred, target):
    pred = pred.astype(bool)
    target = target.astype(bool)

    intersection = np.logical_and(pred, target).sum()
    return (2.0 * intersection) / (pred.sum() + target.sum() + 1e-8)


def iou_score(pred, target):
    pred = pred.astype(bool)
    target = target.astype(bool)

    intersection = np.logical_and(pred, target).sum()
    union = np.logical_or(pred, target).sum()
    return intersection / (union + 1e-8)


def main():
    print("=" * 60)
    print("CADASTRIX-AI BUILDING MODEL EVALUATION")
    print("=" * 60)

    predictor = SegmentationPredictor(checkpoint=CHECKPOINT)

    image_files = sorted(IMAGE_DIR.glob("*.png"))

    if not image_files:
        raise FileNotFoundError(f"No test images found: {IMAGE_DIR}")

    dice_scores = []
    iou_scores = []

    print("TEST IMAGES:", len(image_files))

    for image_path in image_files:
        label_path = LABEL_DIR / image_path.name

        if not label_path.exists():
            print("SKIP - LABEL NOT FOUND:", image_path.name)
            continue

        image = cv2.imread(str(image_path), cv2.IMREAD_COLOR)
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

        label = cv2.imread(str(label_path), cv2.IMREAD_GRAYSCALE)

        if image is None or label is None:
            print("SKIP - READ ERROR:", image_path.name)
            continue

        # Use a 512x512 crop for fast evaluation.
        h, w = image.shape[:2]
        size = 512

        image = image[:size, :size]
        label = label[:size, :size]

        probability = predictor.predict(image)
        prediction = probability >= THRESHOLD
        target = label > 127

        dice = dice_score(prediction, target)
        iou = iou_score(prediction, target)

        dice_scores.append(dice)
        iou_scores.append(iou)

        print(
            f"{image_path.name}: "
            f"Dice={dice:.4f} IoU={iou:.4f}"
        )

    if not dice_scores:
        raise RuntimeError("No test images were successfully evaluated.")

    print("\n" + "=" * 60)
    print("EVALUATION COMPLETE")
    print("=" * 60)
    print(f"MEAN DICE: {np.mean(dice_scores):.4f}")
    print(f"MEAN IoU : {np.mean(iou_scores):.4f}")
    print("=" * 60)


if __name__ == "__main__":
    main()