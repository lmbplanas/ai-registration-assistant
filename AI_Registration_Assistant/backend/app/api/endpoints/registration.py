from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID

from app.schemas.registration import RegistrationCreate, RegistrationResponse
from app.services.registration import RegistrationService
from app.database.database import get_db

router = APIRouter()

@router.post(
    "/register",
    response_model=RegistrationResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new company with applicant and optional file uploads",
    description="""
    Register a new company with the following details:
    - Company information (name and area of service)
    - Applicant details (name, email, phone)
    - Optional file uploads
    """
)
async def register_company(
    company_data: RegistrationCreate = Depends(RegistrationCreate.as_form),
    files: Optional[List[UploadFile]] = File(None, description="Optional file uploads"),
    db: Session = Depends(get_db)
):
    """
    Register a new company with applicant and optional file uploads.
    
    - **company_name**: Name of the company (required)
    - **area_of_service**: Area or industry the company serves (optional)
    - **applicant**: Object containing applicant details (required)
    - **files**: Optional list of files to upload (max 10 files, 10MB each)
    """
    # Validate file uploads if any
    if files:
        # Limit number of files
        if len(files) > 10:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Maximum 10 files allowed per registration"
            )
        
        # Validate file size (10MB max per file)
        max_size = 10 * 1024 * 1024  # 10MB
        for file in files:
            if file.size > max_size:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"File {file.filename} exceeds maximum size of 10MB"
                )
    
    # Process the registration
    registration_service = RegistrationService(db)
    return await registration_service.register_company(company_data, files)

@router.get(
    "/companies/{company_id}",
    summary="Get company details by ID",
    description="Retrieve company details including applicants and uploaded files"
)
async def get_company(
    company_id: UUID,
    db: Session = Depends(get_db)
):
    """
    Get company details by ID including related applicants and files
    """
    registration_service = RegistrationService(db)
    return registration_service.get_company_by_id(company_id)
