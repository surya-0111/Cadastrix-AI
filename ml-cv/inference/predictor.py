from pathlib import Path

import numpy as np
import torch
import segmentation_models_pytorch as smp


class SegmentationPredictor:
    def __init__(self, checkpoint=None, device=None):
        self.device = torch.device(
            device or ("cuda" if torch.cuda.is_available() else "cpu")
        )

        self.model = smp.Unet(
            encoder_name="resnet18",
            encoder_weights=None,
            in_channels=3,
            classes=1,
        )

        if checkpoint is not None:
            checkpoint = Path(checkpoint)

            if not checkpoint.exists():
                raise FileNotFoundError(
                    f"Checkpoint not found: {checkpoint}"
                )

            state = torch.load(
                checkpoint,
                map_location=self.device,
                weights_only=True,
            )

            if "state_dict" in state:
                state = state["state_dict"]

            self.model.load_state_dict(state)

        self.model.to(self.device)
        self.model.eval()

        print("MODEL LOADED:", checkpoint)
        print("DEVICE:", self.device)

    @torch.inference_mode()
    def predict(self, image):
        image = np.asarray(image)

        if image.ndim != 3 or image.shape[2] != 3:
            raise ValueError(
                "Expected image with shape H x W x 3"
            )

        image = image.astype(np.float32)

        if image.max() > 1.0:
            image /= 255.0

        tensor = torch.from_numpy(
            image.transpose(2, 0, 1)
        ).unsqueeze(0).to(self.device)

        logits = self.model(tensor)

        probabilities = torch.sigmoid(
            logits
        )[0, 0].cpu().numpy()

        return probabilities