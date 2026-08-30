from app.utils.file_utils import (
    generate_stored_filename,
    get_file_extension,
    validate_file_extension,
)


def test_get_file_extension() -> None:
    assert get_file_extension("survey.TIF") == ".tif"


def test_valid_extension() -> None:
    validate_file_extension("survey.tiff")


def test_invalid_extension() -> None:
    try:
        validate_file_extension("survey.jpg")
    except ValueError:
        return

    raise AssertionError("Expected ValueError")


def test_generated_filename_is_unique() -> None:
    first = generate_stored_filename("survey.tif")
    second = generate_stored_filename("survey.tif")

    assert first != second
    assert first.endswith(".tif")
    assert second.endswith(".tif")