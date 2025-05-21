import os
import uuid
from pathlib import Path
from typing import Optional
from fastapi import UploadFile, HTTPException, status

class FileHandler:
    def __init__(self, upload_dir: str = "uploads"):
        self.upload_dir = Path(upload_dir)
        self._ensure_upload_dir_exists()
    
    def _ensure_upload_dir_exists(self) -> None:
        """Create upload directory if it doesn't exist"""
        self.upload_dir.mkdir(parents=True, exist_ok=True)
    
    async def save_upload_file(self, upload_file: UploadFile, company_id: str) -> dict:
        """Save an uploaded file to the filesystem"""
        try:
            # Generate a unique filename to prevent collisions
            file_ext = Path(upload_file.filename).suffix
            filename = f"{uuid.uuid4()}{file_ext}"
            file_path = self.upload_dir / filename
            
            # Save the file
            with open(file_path, "wb") as buffer:
                content = await upload_file.read()
                buffer.write(content)
            
            # Return file info
            return {
                "file_name": upload_file.filename,
                "file_url": str(file_path.absolute())
            }
            
        except Exception as e:
            # Clean up if there was an error
            if 'file_path' in locals() and file_path.exists():
                file_path.unlink()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error saving file: {str(e)}"
            )
    
    def delete_file(self, file_url: str) -> bool:
        """Delete a file from the filesystem"""
        try:
            file_path = Path(file_url)
            if file_path.exists():
                file_path.unlink()
                return True
            return False
        except Exception:
            return False

# Initialize file handler
file_handler = FileHandler()
