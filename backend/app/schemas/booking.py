from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field

from app.models.booking import BookingStatus


class BookingCreate(BaseModel):
    service_id: int = Field(gt=0)
    pickup_address: str = Field(min_length=2, max_length=255)
    destination_address: str = Field(
        min_length=2,
        max_length=255,
    )


class BookingResponse(BaseModel):
    id: int
    customer_id: int
    service_id: int
    pickup_address: str
    destination_address: str
    estimated_fare: Decimal | None
    status: BookingStatus
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)