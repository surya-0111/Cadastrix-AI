from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.dependencies.database import get_database
from app.schemas.validation import (
    ParcelReviewRequest,
    ParcelReviewResponse,
)
from app.services.parcel_review_service import (
    ParcelReviewError,
    get_parcel_review,
    review_parcel,
)


router = APIRouter(
    tags=["Parcel Review"],
)


@router.get(
    "/parcels/{parcel_id}/review",
    response_model=ParcelReviewResponse,
)
def get_parcel_review_endpoint(
    parcel_id: int,
    db: Session = Depends(get_database),
) -> ParcelReviewResponse:
    """Return the current review state for a parcel."""

    parcel = get_parcel_review(
        db,
        parcel_id,
    )

    if parcel is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Parcel {parcel_id} not found",
        )

    return ParcelReviewResponse(
        parcel_id=parcel.id,
        parcel_code=parcel.parcel_code,
        validity_status=parcel.validity_status,
        review_status=parcel.review_status,
        review_comment=parcel.review_comment,
    )


@router.patch(
    "/parcels/{parcel_id}/review",
    response_model=ParcelReviewResponse,
)
def review_parcel_endpoint(
    parcel_id: int,
    request: ParcelReviewRequest,
    db: Session = Depends(get_database),
) -> ParcelReviewResponse:
    """Submit a human review decision."""

    try:
        parcel = review_parcel(
            db=db,
            parcel_id=parcel_id,
            review_status=request.review_status,
            review_comment=request.review_comment,
        )

    except ParcelReviewError as exc:
        message = str(exc)

        if "not found" in message.lower():
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=message,
            ) from exc

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=message,
        ) from exc

    return ParcelReviewResponse(
        parcel_id=parcel.id,
        parcel_code=parcel.parcel_code,
        validity_status=parcel.validity_status,
        review_status=parcel.review_status,
        review_comment=parcel.review_comment,
    )