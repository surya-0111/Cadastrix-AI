from fastapi import FastAPI
from fastapi.testclient import TestClient


def test_application_is_created() -> None:
    from app.main import app

    assert isinstance(app, FastAPI)

def test_docs_endpoint_available() -> None:
    from app.main import app

    client = TestClient(app)

    response = client.get("/docs")

    assert response.status_code == 200