from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field

from app.models.provider_service import ServiceType


class ServiceCreate(BaseModel):
    service_type: ServiceType
    vehicle_name: str = Field(min_length=2, max_length=100)
    vehicle_number: str = Field(min_length=4, max_length=30)
    seats: int = Field(ge=1, le=20)
    base_fare: Decimal = Field(ge=0)
    price_per_km: Decimal = Field(gt=0)
    operating_city: str = Field(min_length=2, max_length=100)


class ServiceResponse(BaseModel):
    id: int
    provider_id: int
    service_type: ServiceType
    vehicle_name: str
    vehicle_number: str
    seats: int
    base_fare: Decimal
    price_per_km: Decimal
    operating_city: str
    is_available: bool

    model_config = ConfigDict(from_attributes=True)