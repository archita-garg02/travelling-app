import enum
from datetime import datetime
from decimal import Decimal

from sqlalchemy import (
    Boolean,
    DateTime,
    Enum,
    ForeignKey,
    Numeric,
    String,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class ServiceType(str, enum.Enum):
    BIKE = "BIKE"
    AUTO = "AUTO"
    CAB = "CAB"


class ProviderService(Base):
    __tablename__ = "provider_services"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        autoincrement=True,
    )

    provider_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False,
    )

    service_type: Mapped[ServiceType] = mapped_column(
        Enum(ServiceType),
        nullable=False,
    )

    vehicle_name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    vehicle_number: Mapped[str] = mapped_column(
        String(30),
        unique=True,
        nullable=False,
    )

    seats: Mapped[int] = mapped_column(
        nullable=False,
    )

    base_fare: Mapped[Decimal] = mapped_column(
        Numeric(10, 2),
        nullable=False,
    )

    price_per_km: Mapped[Decimal] = mapped_column(
        Numeric(10, 2),
        nullable=False,
    )

    operating_city: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    is_available: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now(),
        nullable=False,
    )