from enum import Enum

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class RegistrationRole(str, Enum):
    CUSTOMER = "CUSTOMER"
    PROVIDER = "PROVIDER"


class UserRegister(BaseModel):
    full_name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    phone: str = Field(min_length=10, max_length=20)
    password: str = Field(min_length=8, max_length=128)
    role: RegistrationRole


class UserResponse(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    phone: str
    role: RegistrationRole
    is_active: bool

    model_config = ConfigDict(from_attributes=True)

class UserLogin(BaseModel):
    email: EmailStr
    password: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse