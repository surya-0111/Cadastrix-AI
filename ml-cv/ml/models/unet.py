import torch
import torch.nn as nn


class DoubleConv(nn.Module):
    """
    Two consecutive 3x3 convolutions, each followed by
    batch normalization and ReLU activation.
    """

    def __init__(self, in_channels: int, out_channels: int) -> None:
        super().__init__()

        self.block = nn.Sequential(
            nn.Conv2d(
                in_channels,
                out_channels,
                kernel_size=3,
                padding=1,
                bias=False,
            ),
            nn.BatchNorm2d(out_channels),
            nn.ReLU(inplace=True),

            nn.Conv2d(
                out_channels,
                out_channels,
                kernel_size=3,
                padding=1,
                bias=False,
            ),
            nn.BatchNorm2d(out_channels),
            nn.ReLU(inplace=True),
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.block(x)


class UNet(nn.Module):
    """
    U-Net architecture for binary building segmentation.

    Input:
        RGB image tensor of shape (N, 3, H, W)

    Output:
        One-channel segmentation logits of shape (N, 1, H, W)
    """

    def __init__(
        self,
        in_channels: int = 3,
        out_channels: int = 1,
        base_channels: int = 32,
    ) -> None:
        super().__init__()

        if in_channels <= 0:
            raise ValueError("in_channels must be greater than 0.")

        if out_channels <= 0:
            raise ValueError("out_channels must be greater than 0.")

        if base_channels <= 0:
            raise ValueError("base_channels must be greater than 0.")

        self.encoder1 = DoubleConv(
            in_channels,
            base_channels,
        )

        self.encoder2 = DoubleConv(
            base_channels,
            base_channels * 2,
        )

        self.encoder3 = DoubleConv(
            base_channels * 2,
            base_channels * 4,
        )

        self.encoder4 = DoubleConv(
            base_channels * 4,
            base_channels * 8,
        )

        self.bottleneck = DoubleConv(
            base_channels * 8,
            base_channels * 16,
        )

        self.pool = nn.MaxPool2d(
            kernel_size=2,
            stride=2,
        )

        self.up4 = nn.ConvTranspose2d(
            base_channels * 16,
            base_channels * 8,
            kernel_size=2,
            stride=2,
        )

        self.decoder4 = DoubleConv(
            base_channels * 16,
            base_channels * 8,
        )

        self.up3 = nn.ConvTranspose2d(
            base_channels * 8,
            base_channels * 4,
            kernel_size=2,
            stride=2,
        )

        self.decoder3 = DoubleConv(
            base_channels * 8,
            base_channels * 4,
        )

        self.up2 = nn.ConvTranspose2d(
            base_channels * 4,
            base_channels * 2,
            kernel_size=2,
            stride=2,
        )

        self.decoder2 = DoubleConv(
            base_channels * 4,
            base_channels * 2,
        )

        self.up1 = nn.ConvTranspose2d(
            base_channels * 2,
            base_channels,
            kernel_size=2,
            stride=2,
        )

        self.decoder1 = DoubleConv(
            base_channels * 2,
            base_channels,
        )

        self.output = nn.Conv2d(
            base_channels,
            out_channels,
            kernel_size=1,
        )

    @staticmethod
    def _match_size(
        x: torch.Tensor,
        reference: torch.Tensor,
    ) -> torch.Tensor:
        """
        Resize decoder features when an input dimension is not
        perfectly divisible by the pooling factor.
        """

        if x.shape[-2:] == reference.shape[-2:]:
            return x

        return nn.functional.interpolate(
            x,
            size=reference.shape[-2:],
            mode="bilinear",
            align_corners=False,
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        if x.ndim != 4:
            raise ValueError(
                "Expected input tensor with shape (N, C, H, W)."
            )

        if x.shape[1] != 3:
            raise ValueError(
                "UNet expects 3-channel RGB input."
            )

        e1 = self.encoder1(x)
        e2 = self.encoder2(self.pool(e1))
        e3 = self.encoder3(self.pool(e2))
        e4 = self.encoder4(self.pool(e3))

        bottleneck = self.bottleneck(
            self.pool(e4)
        )

        d4 = self.up4(bottleneck)
        d4 = self._match_size(d4, e4)
        d4 = torch.cat([d4, e4], dim=1)
        d4 = self.decoder4(d4)

        d3 = self.up3(d4)
        d3 = self._match_size(d3, e3)
        d3 = torch.cat([d3, e3], dim=1)
        d3 = self.decoder3(d3)

        d2 = self.up2(d3)
        d2 = self._match_size(d2, e2)
        d2 = torch.cat([d2, e2], dim=1)
        d2 = self.decoder2(d2)

        d1 = self.up1(d2)
        d1 = self._match_size(d1, e1)
        d1 = torch.cat([d1, e1], dim=1)
        d1 = self.decoder1(d1)

        return self.output(d1)