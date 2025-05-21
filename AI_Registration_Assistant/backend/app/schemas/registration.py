from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from uuid import UUID

class ApplicantBase(BaseModel):
    full_name: str = Field(..., max_length=255)
    email: EmailStr
    phone: Optional[str] = Field(None, max_length=50)

class FileCreate(BaseModel):
    file_name: str
    file_url: str

class RegistrationCreate(BaseModel):
    company_name: str = Field(..., max_length=255)
    area_of_service: Optional[str] = Field(None, max_length=255)
    applicant: ApplicantBase

class RegistrationResponse(BaseModel):
    success: bool
    company_id: UUID
    message: str = "Registration successful"

    class Config:
        from_attributes = True

class CompanyResponse(BaseModel):
    id: UUID
    company_name: str
    created_at: datetime

    class Config:
        from_attributes = True

class ApplicantResponse(ApplicantBase):
    id: UUID
    submitted_at: datetime
    company_id: UUID

    class Config:
        from_attributes = True

class FileResponse(FileCreate):
    id: UUID
    company_id: UUID
    uploaded_at: datetime

    class Config:
        from_attributes = True
