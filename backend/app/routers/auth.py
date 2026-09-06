from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.dependencies import get_current_user
from app.core.security import (
    create_access_token,
    hash_password,
    verify_password,
)
from app.database import get_database
from app.models.user import User, UserRole
from app.schemas.auth import (
    LoginResponse,
    UserLogin,
    UserRegister,
    UserResponse,
)


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=201,
)
def register_user(
    user_data: UserRegister,
    database: Session = Depends(get_database),
):
    existing_user = database.query(User).filter(
        User.email == user_data.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email is already registered",
        )

    new_user = User(
        full_name=user_data.full_name,
        email=user_data.email,
        phone=user_data.phone,
        password_hash=hash_password(user_data.password),
        role=UserRole(user_data.role.value),
    )

    database.add(new_user)
    database.commit()
    database.refresh(new_user)

    return new_user


@router.post(
    "/login",
    response_model=LoginResponse,
)
def login_user(
    login_data: UserLogin,
    database: Session = Depends(get_database),
):
    user = database.query(User).filter(
        User.email == login_data.email
    ).first()

    password_is_correct = (
        user is not None
        and verify_password(
            login_data.password,
            user.password_hash,
        )
    )

    if not password_is_correct:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password",
        )

    access_token = create_access_token(user.id)

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user,
    }

    @router.get(
    "/me",
    response_model=UserResponse,
    )
    def get_my_profile(
        current_user: User = Depends(get_current_user),
    ):
        return current_user