from unittest.mock import MagicMock, patch

from fastapi.testclient import TestClient
from sqlalchemy.exc import SQLAlchemyError

from app.main import app


client = TestClient(app)


def test_health_endpoint() -> None:
    response = client.get("/api/health")

    assert response.status_code == 200

    data = response.json()

    assert data["status"] == "ok"
    assert data["service"] == "cadastral-ai-backend"
    assert data["version"] == "0.1.0"


def test_readiness_endpoint() -> None:
    response = client.get("/api/ready")

    assert response.status_code == 200

    assert response.json() == {
        "status": "ready",
    }


def test_readiness_returns_503_when_database_fails() -> None:
    mock_db = MagicMock()

    mock_db.execute.side_effect = SQLAlchemyError(
        "database unavailable"
    )

    with patch(
        "app.api.health.SessionLocal",
        return_value=mock_db,
    ):
        response = client.get("/api/ready")

    assert response.status_code == 503

    assert response.json() == {
        "detail": "Service is not ready.",
    }

    mock_db.close.assert_called_once()