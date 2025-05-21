from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import models
from app.schemas import schemas
from app.services import user_service
from app.config import settings

# Initialize FastAPI app
app = FastAPI(
    title="AI Registration Assistant API",
    description="API for AI Registration Assistant application",
    version="0.1.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Welcome to the AI Registration Assistant API"}

# Health check endpoint
@app.get("/health")
def health_check():
    return {"status": "healthy"}

# Include routers
from app.routers import users, auth

app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])

# Create database tables on startup
@app.on_event("startup")
def startup_db_client():
    models.Base.metadata.create_all(bind=models.engine)
    print("Connected to the database!")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
