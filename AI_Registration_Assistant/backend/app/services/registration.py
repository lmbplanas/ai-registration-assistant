from uuid import UUID
from typing import List, Optional
from fastapi import HTTPException, status, UploadFile
from sqlalchemy.orm import Session

from app.models.registration import Company, Applicant, UploadedFile
from app.schemas.registration import RegistrationCreate, RegistrationResponse, FileCreate
from app.utils.file_handler import file_handler

class RegistrationService:
    def __init__(self, db: Session):
        self.db = db
    
    async def register_company(
        self, 
        registration_data: RegistrationCreate,
        files: Optional[List[UploadFile]] = None
    ) -> RegistrationResponse:
        """
        Register a new company with applicant and optional file uploads
        """
        # Start a transaction
        try:
            # Check if company already exists
            existing_company = self.db.query(Company).filter(
                Company.company_name == registration_data.company_name
            ).first()
            
            if existing_company:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Company with this name already exists"
                )
            
            # Create company
            company = Company(
                company_name=registration_data.company_name,
                area_of_service=registration_data.area_of_service
            )
            self.db.add(company)
            self.db.flush()  # Flush to get the company ID
            
            # Create applicant
            applicant_data = registration_data.applicant
            applicant = Applicant(
                company_id=company.id,
                full_name=applicant_data.full_name,
                email=applicant_data.email,
                phone=applicant_data.phone
            )
            self.db.add(applicant)
            
            # Handle file uploads if any
            if files:
                for file in files:
                    file_info = await file_handler.save_upload_file(file, str(company.id))
                    
                    uploaded_file = UploadedFile(
                        company_id=company.id,
                        file_name=file_info["file_name"],
                        file_url=file_info["file_url"]
                    )
                    self.db.add(uploaded_file)
            
            # Commit the transaction
            self.db.commit()
            
            return RegistrationResponse(
                success=True,
                company_id=company.id,
                message="Registration successful"
            )
            
        except HTTPException:
            self.db.rollback()
            raise
            
        except Exception as e:
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error during registration: {str(e)}"
            )
    
    def get_company_by_id(self, company_id: UUID):
        """Get company by ID with related data"""
        company = self.db.query(Company).filter(Company.id == company_id).first()
        if not company:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Company not found"
            )
        return company
