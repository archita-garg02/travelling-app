from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_database
from app.dependencies import get_current_user
from app.models.booking import Booking
from app.models.service import ProviderService
from app.models.user import User, UserRole
from app.schemas.booking import (
    BookingCreate,
    BookingResponse,
)


router = APIRouter(
    prefix="/bookings",
    tags=["Bookings"],
)


@router.post(
    "",
    response_model=BookingResponse,
    status_code=201,
)
def create_booking(
    booking_data: BookingCreate,
    database: Session = Depends(get_database),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != UserRole.CUSTOMER:
        raise HTTPException(
            status_code=403,
            detail="Only customers can create bookings",
        )

    service = database.query(ProviderService).filter(
        ProviderService.id == booking_data.service_id
    ).first()

    if not service:
        raise HTTPException(
            status_code=404,
            detail="Vehicle service not found",
        )

    if not service.is_available:
        raise HTTPException(
            status_code=400,
            detail="This vehicle is currently unavailable",
        )

    if service.provider_id == current_user.id:
        raise HTTPException(
            status_code=400,
            detail="You cannot book your own vehicle",
        )

    booking = Booking(
        customer_id=current_user.id,
        service_id=service.id,
        pickup_address=booking_data.pickup_address.strip(),
        destination_address=(
            booking_data.destination_address.strip()
        ),
    )

    database.add(booking)
    database.commit()
    database.refresh(booking)

    return booking

    @router.get(
    "/my-bookings",
    response_model=list[BookingResponse],
)
    def get_my_bookings(
        database: Session = Depends(get_database),
        current_user: User = Depends(get_current_user),
    ):
        if current_user.role != UserRole.CUSTOMER:
            raise HTTPException(
                status_code=403,
                detail="Only customers can view customer bookings",
            )

        bookings = database.query(Booking).filter(
            Booking.customer_id == current_user.id
        ).order_by(
            Booking.created_at.desc()
        ).all()

        return bookings