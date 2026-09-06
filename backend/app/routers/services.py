from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_database
from app.models.service import ProviderService, ServiceType
from app.schemas.service import ServiceResponse


@router.get(
    "/available",
    response_model=list[ServiceResponse],
)
def get_available_services(
    service_type: Optional[ServiceType] = Query(default=None),
    city: Optional[str] = Query(default=None),
    database: Session = Depends(get_database),
):
    query = database.query(ProviderService).filter(
        ProviderService.is_available.is_(True)
    )

    if service_type:
        query = query.filter(
            ProviderService.service_type == service_type
        )

    if city:
        query = query.filter(
            ProviderService.operating_city.ilike(
                f"%{city.strip()}%"
            )
        )

    return query.order_by(
        ProviderService.created_at.desc()
    ).all()


router = APIRouter(
    prefix="/services",
    tags=["Provider Services"],
)


@router.post(
    "",
    response_model=ServiceResponse,
    status_code=201,
)
def create_service(
    service_data: ServiceCreate,
    database: Session = Depends(get_database),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != UserRole.PROVIDER:
        raise HTTPException(
            status_code=403,
            detail="Only providers can add vehicle services",
        )

    vehicle_number = (
        service_data.vehicle_number.strip().upper()
    )

    existing_service = database.query(
        ProviderService
    ).filter(
        ProviderService.vehicle_number == vehicle_number
    ).first()

    if existing_service:
        raise HTTPException(
            status_code=400,
            detail="Vehicle number is already registered",
        )

    new_service = ProviderService(
        provider_id=current_user.id,
        service_type=service_data.service_type,
        vehicle_name=service_data.vehicle_name.strip(),
        vehicle_number=vehicle_number,
        seats=service_data.seats,
        base_fare=service_data.base_fare,
        price_per_km=service_data.price_per_km,
        operating_city=service_data.operating_city.strip(),
    )

    database.add(new_service)
    database.commit()
    database.refresh(new_service)

    return new_service

    @router.get(
    "/my-services",
    response_model=list[ServiceResponse],
)

    def get_my_services(
        database: Session = Depends(get_database),
        current_user: User = Depends(get_current_user),
    ):
        if current_user.role != UserRole.PROVIDER:
            raise HTTPException(
                status_code=403,
                detail="Only providers can view their services",
            )

        services = database.query(
            ProviderService
        ).filter(
            ProviderService.provider_id == current_user.id
        ).all()

        return services