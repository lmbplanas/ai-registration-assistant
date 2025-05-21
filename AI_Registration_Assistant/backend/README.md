# AI Registration Assistant - Backend

This is the backend service for the AI Registration Assistant, built with FastAPI and PostgreSQL.

## Features

- Company registration with applicant details
- File upload support
- RESTful API endpoints
- Database migrations with Alembic
- File storage with local filesystem (can be extended to S3)

## Prerequisites

- Python 3.8+
- PostgreSQL
- pip (Python package manager)

## Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Create a virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   Create a `.env` file in the root directory with the following variables:
   ```
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ai_registration
   SECRET_KEY=your-secret-key
   ```

5. **Set up the database**
   ```bash
   # Create the database
   createdb ai_registration
   
   # Run migrations
   alembic upgrade head
   ```

6. **Create uploads directory**
   ```bash
   mkdir -p uploads
   ```

## Running the Application

### Development
```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`

### Production
```bash
gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app
```

## API Documentation

- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## Endpoints

### Register a Company
```
POST /api/v1/register
```

**Form Data**:
- `company_name`: (string, required)
- `area_of_service`: (string, optional)
- `applicant[full_name]`: (string, required)
- `applicant[email]`: (string, required)
- `applicant[phone]`: (string, optional)
- `files`: (file, optional) - Up to 10 files, 10MB each

### Get Company by ID
```
GET /api/v1/companies/{company_id}
```

## Testing

1. **Run tests**
   ```bash
   # Install test dependencies
   pip install -r requirements-test.txt
   
   # Run tests
   pytest
   ```

## Deployment

### Docker

1. **Build the image**
   ```bash
   docker build -t ai-registration-backend .
   ```

2. **Run with Docker Compose**
   ```bash
   docker-compose up -d
   ```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection URL | `postgresql://postgres:postgres@db:5432/ai_registration` |
| `SECRET_KEY` | Secret key for JWT tokens | `your-secret-key` |
| `ENVIRONMENT` | Application environment | `development` |

## License

MIT
