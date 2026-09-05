from pathlib import Path


SUPPORTED_IMAGE_EXTENSIONS = {
    ".tif",
    ".tiff",
    ".png",
    ".jpg",
    ".jpeg",
}


def validate_building_dataset(
    image_dir: str | Path,
    mask_dir: str | Path,
) -> dict[str, int]:
    """
    Validate paired building images and masks.

    Image and mask filenames must share the same stem.

    Example:
        images/tile_0001.tif
        masks/tile_0001.png
    """

    image_dir = Path(image_dir)
    mask_dir = Path(mask_dir)

    if not image_dir.is_dir():
        raise FileNotFoundError(
            f"Image directory not found: {image_dir}"
        )

    if not mask_dir.is_dir():
        raise FileNotFoundError(
            f"Mask directory not found: {mask_dir}"
        )

    image_files = sorted(
        path
        for path in image_dir.iterdir()
        if path.is_file()
        and path.suffix.lower() in SUPPORTED_IMAGE_EXTENSIONS
    )

    mask_files = sorted(
        path
        for path in mask_dir.iterdir()
        if path.is_file()
        and path.suffix.lower() in SUPPORTED_IMAGE_EXTENSIONS
    )

    image_stems = {path.stem for path in image_files}
    mask_stems = {path.stem for path in mask_files}

    missing_masks = sorted(image_stems - mask_stems)
    orphan_masks = sorted(mask_stems - image_stems)

    if missing_masks:
        raise ValueError(
            "Images without corresponding masks: "
            + ", ".join(missing_masks)
        )

    if orphan_masks:
        raise ValueError(
            "Masks without corresponding images: "
            + ", ".join(orphan_masks)
        )

    if not image_files:
        raise ValueError(
            f"No training images found in {image_dir}"
        )

    return {
        "images": len(image_files),
        "masks": len(mask_files),
        "paired_samples": len(image_files),
    }


if __name__ == "__main__":
    project_root = Path(__file__).resolve().parents[2]

    image_dir = (
        project_root
        / "data"
        / "building"
        / "images"
    )

    mask_dir = (
        project_root
        / "data"
        / "building"
        / "masks"
    )

    result = validate_building_dataset(
        image_dir=image_dir,
        mask_dir=mask_dir,
    )

    print(
        f"Images: {result['images']}"
    )
    print(
        f"Masks: {result['masks']}"
    )
    print(
        f"Paired samples: {result['paired_samples']}"
    )