import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Database settings
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@db:5432/ai_registration")
TEST_DATABASE_URL = os.getenv("TEST_DATABASE_URL", "postgresql://postgres:postgres@db:5432/test_ai_registration")

# JWT settings
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-for-development-only")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# API settings
API_V1_STR = "/api/v1"

# CORS settings
CORS_ORIGINS = [
    "http://localhost:3000",  # Frontend in development
    "http://localhost:5173",  # Vite default port
    "http://frontend:5173",   # Docker service name
]
