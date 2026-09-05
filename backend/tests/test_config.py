from app.core.config import get_settings


def test_settings_load() -> None:
    settings = get_settings()

    assert settings.database_url
    assert settings.app_name
    assert settings.app_version
    assert settings.upload_dir
    assert settings.max_upload_size_mb > 0