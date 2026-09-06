import enum

from sqlalchemy import (
    Column,
    DateTime,
    Enum,
    ForeignKey,
    Integer,
    Numeric,
    String,
)
from sqlalchemy.sql import func

from app.database import Base


class BookingStatus(str, enum.Enum):
    PENDING = "PENDING"
    CANCELLED = "CANCELLED"
    COMPLETED = "COMPLETED"


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    customer_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
    )

    service_id = Column(
        Integer,
        ForeignKey("provider_services.id"),
        nullable=False,
    )

    pickup_address = Column(
        String(255),
        nullable=False,
    )

    destination_address = Column(
        String(255),
        nullable=False,
    )

    estimated_fare = Column(
        Numeric(10, 2),
        nullable=True,
    )

    status = Column(
        Enum(BookingStatus),
        nullable=False,
        default=BookingStatus.PENDING,
    )

    created_at = Column(
        DateTime,
        nullable=False,
        server_default=func.now(),
    )