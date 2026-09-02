import numpy as np
from PIL import Image

from ml.datasets.augmentation import BuildingSegmentationAugmentation
from ml.datasets.building_dataset import BuildingSegmentationDataset
from ml.datasets.loader import create_building_dataloader


def test_building_dataset_loads_png_pairs(tmp_path):
    image_dir = tmp_path / "images"
    mask_dir = tmp_path / "masks"

    image_dir.mkdir()
    mask_dir.mkdir()

    image = np.zeros((64, 64, 3), dtype=np.uint8)
    image[16:48, 16:48] = [100, 150, 200]

    mask = np.zeros((64, 64), dtype=np.uint8)
    mask[20:40, 20:40] = 255

    Image.fromarray(image).save(image_dir / "sample_001.png")
    Image.fromarray(mask).save(mask_dir / "sample_001.png")

    dataset = BuildingSegmentationDataset(
        image_dir=image_dir,
        mask_dir=mask_dir,
    )

    image_tensor, mask_tensor = dataset[0]

    assert len(dataset) == 1
    assert image_tensor.shape == (3, 64, 64)
    assert mask_tensor.shape == (1, 64, 64)

    assert image_tensor.dtype.is_floating_point
    assert mask_tensor.dtype.is_floating_point

    assert float(mask_tensor.max()) == 1.0


def test_building_dataset_rejects_missing_mask(tmp_path):
    image_dir = tmp_path / "images"
    mask_dir = tmp_path / "masks"

    image_dir.mkdir()
    mask_dir.mkdir()

    image = np.zeros((32, 32, 3), dtype=np.uint8)

    Image.fromarray(image).save(
        image_dir / "sample_001.png"
    )

    try:
        BuildingSegmentationDataset(
            image_dir=image_dir,
            mask_dir=mask_dir,
        )
    except FileNotFoundError:
        return

    raise AssertionError("Expected FileNotFoundError")


def test_segmentation_augmentation_keeps_image_and_mask_aligned():
    image = np.zeros((8, 8, 3), dtype=np.uint8)
    mask = np.zeros((8, 8), dtype=np.float32)

    image[2:6, 3:5] = [255, 100, 50]
    mask[2:6, 3:5] = 1.0

    augmentation = BuildingSegmentationAugmentation(
        horizontal_flip_prob=0.0,
        vertical_flip_prob=0.0,
        rotate_90_prob=1.0,
    )

    augmented_image, augmented_mask = augmentation(
        image,
        mask,
    )

    assert augmented_image.shape == (8, 8, 3)
    assert augmented_mask.shape == (8, 8)

    # The same pixels must remain labeled after augmentation.
    assert augmented_mask.sum() == mask.sum()

    assert np.count_nonzero(
        augmented_image[:, :, 0]
    ) == np.count_nonzero(
        image[:, :, 0]
    )


def test_building_dataloader_returns_batch(tmp_path):
    image_dir = tmp_path / "images"
    mask_dir = tmp_path / "masks"

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

    loader = create_building_dataloader(
        image_dir=str(image_dir),
        mask_dir=str(mask_dir),
        batch_size=2,
        shuffle=False,
    )

    images, masks = next(iter(loader))

    assert images.shape == (2, 3, 32, 32)
    assert masks.shape == (2, 1, 32, 32)

    assert images.dtype.is_floating_point
    assert masks.dtype.is_floating_point
def test_building_dataloader_accepts_augmentation(tmp_path):
    image_dir = tmp_path / "images"
    mask_dir = tmp_path / "masks"

    image_dir.mkdir()
    mask_dir.mkdir()

    image = np.zeros((32, 32, 3), dtype=np.uint8)
    image[8:24, 8:24] = [100, 150, 200]

    mask = np.zeros((32, 32), dtype=np.uint8)
    mask[10:20, 10:20] = 255

    Image.fromarray(image).save(
        image_dir / "sample_001.png"
    )

    Image.fromarray(mask).save(
        mask_dir / "sample_001.png"
    )

    loader = create_building_dataloader(
        image_dir=str(image_dir),
        mask_dir=str(mask_dir),
        batch_size=1,
        shuffle=False,
        augment=True,
    )

    images, masks = next(iter(loader))

    assert images.shape == (1, 3, 32, 32)
    assert masks.shape == (1, 1, 32, 32)
