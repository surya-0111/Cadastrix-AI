import torch

from ml.models.unet import UNet


def test_unet_output_shape():
    model = UNet(
        in_channels=3,
        out_channels=1,
        base_channels=16,
    )

    x = torch.randn(2, 3, 128, 128)

    with torch.no_grad():
        output = model(x)

    assert output.shape == (2, 1, 128, 128)


def test_unet_accepts_non_power_of_two_dimensions():
    model = UNet(
        in_channels=3,
        out_channels=1,
        base_channels=8,
    )

    x = torch.randn(1, 3, 100, 140)

    with torch.no_grad():
        output = model(x)

    assert output.shape == (1, 1, 100, 140)


def test_unet_rejects_non_rgb_input():
    model = UNet(
        in_channels=3,
        out_channels=1,
        base_channels=8,
    )

    x = torch.randn(1, 1, 64, 64)

    try:
        model(x)
    except ValueError:
        return

    raise AssertionError("Expected ValueError for non-RGB input")