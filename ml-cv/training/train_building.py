import random
from pathlib import Path

import numpy as np
from PIL import Image

import torch
from torch.utils.data import Dataset, DataLoader
import segmentation_models_pytorch as smp


DATA_ROOT = Path(r"C:\Users\evara\Downloads\massachusetts-buildings\png")
MODEL_DIR = Path("ml-cv/models/building")
MODEL_DIR.mkdir(parents=True, exist_ok=True)

CROP_SIZE = 512
BATCH_SIZE = 2
EPOCHS = 5
LR = 1e-4


class BuildingDataset(Dataset):
    def __init__(self, split):
        self.images = sorted((DATA_ROOT / split).glob("*.png"))
        self.masks = {
            p.name: p
            for p in (DATA_ROOT / f"{split}_labels").glob("*.png")
        }

        self.images = [
            p for p in self.images
            if p.name in self.masks
        ]

    def __len__(self):
        return len(self.images)

    def __getitem__(self, idx):
        image_path = self.images[idx]
        mask_path = self.masks[image_path.name]

        image = np.array(
            Image.open(image_path).convert("RGB")
        )

        mask = np.array(
            Image.open(mask_path).convert("L")
        )

        h, w = image.shape[:2]

        top = random.randint(0, h - CROP_SIZE)
        left = random.randint(0, w - CROP_SIZE)

        image = image[
            top:top + CROP_SIZE,
            left:left + CROP_SIZE
        ]

        mask = mask[
            top:top + CROP_SIZE,
            left:left + CROP_SIZE
        ]

        image = torch.from_numpy(
            image.astype(np.float32) / 255.0
        ).permute(2, 0, 1)

        mask = torch.from_numpy(
            (mask > 127).astype(np.float32)
        ).unsqueeze(0)

        return image, mask


def dice_loss(logits, target):
    pred = torch.sigmoid(logits)

    smooth = 1.0

    intersection = (pred * target).sum()

    dice = (
        2.0 * intersection + smooth
    ) / (
        pred.sum() + target.sum() + smooth
    )

    return 1.0 - dice


def main():
    device = torch.device(
        "cuda" if torch.cuda.is_available() else "cpu"
    )

    print("DEVICE:", device)

    train_ds = BuildingDataset("train")
    val_ds = BuildingDataset("val")

    print("TRAIN IMAGES:", len(train_ds))
    print("VAL IMAGES:", len(val_ds))

    if len(train_ds) == 0:
        raise RuntimeError("No training images found.")

    if len(val_ds) == 0:
        raise RuntimeError("No validation images found.")

    train_loader = DataLoader(
        train_ds,
        batch_size=BATCH_SIZE,
        shuffle=True,
        num_workers=0,
    )

    val_loader = DataLoader(
        val_ds,
        batch_size=1,
        shuffle=False,
        num_workers=0,
    )

    model = smp.Unet(
        encoder_name="resnet18",
        encoder_weights="imagenet",
        in_channels=3,
        classes=1,
    ).to(device)

    optimizer = torch.optim.Adam(
        model.parameters(),
        lr=LR,
    )

    bce = torch.nn.BCEWithLogitsLoss()

    best_val = float("inf")

    for epoch in range(EPOCHS):

        model.train()

        train_loss = 0.0

        for images, masks in train_loader:

            images = images.to(device)
            masks = masks.to(device)

            optimizer.zero_grad()

            logits = model(images)

            loss = (
                bce(logits, masks)
                + dice_loss(logits, masks)
            )

            loss.backward()
            optimizer.step()

            train_loss += loss.item()

        train_loss /= len(train_loader)

        model.eval()

        val_loss = 0.0

        with torch.no_grad():

            for images, masks in val_loader:

                images = images.to(device)
                masks = masks.to(device)

                logits = model(images)

                loss = (
                    bce(logits, masks)
                    + dice_loss(logits, masks)
                )

                val_loss += loss.item()

        val_loss /= len(val_loader)

        print(
            f"Epoch {epoch + 1}/{EPOCHS} "
            f"train={train_loss:.4f} "
            f"val={val_loss:.4f}"
        )

        if val_loss < best_val:

            best_val = val_loss

            checkpoint = MODEL_DIR / "building_unet.pth"

            torch.save(
                model.state_dict(),
                checkpoint,
            )

            print("CHECKPOINT SAVED:", checkpoint)

    print("TRAINING COMPLETE")
    print(
        "MODEL:",
        MODEL_DIR / "building_unet.pth"
    )


if __name__ == "__main__":
    main()