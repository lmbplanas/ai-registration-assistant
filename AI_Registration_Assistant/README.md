# AI Registration Assistant

A full-stack web application for AI-powered event registration and management.

## 🚀 Deployment

This project is configured for easy deployment to Render (backend) and Vercel (frontend).

### Prerequisites

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) (v16 or later)
- [Python](https://www.python.org/) (3.9 or later)
- [Vercel CLI](https://vercel.com/cli) (for frontend deployment)
- [Render CLI](https://render.com/docs/cli) (for backend deployment)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ai-registration-assistant.git
   cd ai-registration-assistant
   ```

2. **Deploy the backend to Render**
   ```bash
   # Install Render CLI if not already installed
   curl -s https://render.com/downloads/render-cli/install-render.sh | bash
   
   # Deploy backend
   cd backend
   render blueprints save --file ../render.yaml --name ai-registration-backend
   render blueprints deploy --name ai-registration-backend
   cd ..
   ```

3. **Deploy the frontend to Vercel**
   ```bash
   # Install Vercel CLI if not already installed
   npm install -g vercel
   
   # Deploy frontend
   cd frontend
   vercel
   cd ..
   ```

4. **Configure environment variables**
   - In the Render dashboard, set up the following environment variables for the backend:
     - `DATABASE_URL`: Your PostgreSQL connection string
     - `SECRET_KEY`: A secure secret key for JWT
     - `CORS_ORIGINS`: Your frontend URL (e.g., https://your-frontend.vercel.app)
   
   - In the Vercel dashboard, set up the following environment variable for the frontend:
     - `VITE_API_URL`: Your backend API URL (e.g., https://ai-registration-backend.onrender.com/api)

### Using the Deployment Script

For a more automated deployment, you can use the provided deployment script:

```bash
# Make the script executable
chmod +x deploy.sh

# Run the deployment script
./deploy.sh
```

### Manual Deployment

If you prefer to deploy manually, follow the detailed instructions in [DEPLOYMENT.md](DEPLOYMENT.md).

## ✨ Features

- **AI-Powered Registration**: Intelligent form filling with AI assistance
- **User Authentication**: Secure registration and login system
- **Document Upload**: Easy file upload and management
- **Responsive Design**: Works on desktop and mobile devices
- **Admin Dashboard**: Manage registrations and users
- **RESTful API**: Built with FastAPI for the backend
- **Modern Frontend**: Built with React, TypeScript, and Tailwind CSS
- **Easy Deployment**: Pre-configured for Render and Vercel

## Prerequisites

- Docker and Docker Compose
- Node.js (for local development)
- Python 3.9+ (for local backend development)

## Getting Started

### Development with Docker (Recommended)

1. Clone the repository
2. Navigate to the project directory
3. Run the following command to start all services:
   ```bash
   docker-compose up --build
   ```
4. Access the application at:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs
   - pgAdmin: http://localhost:5050 (email: admin@example.com, password: admin)

### Local Development

#### Backend
1. Navigate to the backend directory
2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the development server:
   ```bash
   uvicorn main:app --reload
   ```

#### Frontend
1. Navigate to the frontend directory
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

### Backend
Create a `.env` file in the `backend` directory with the following variables:
```
DATABASE_URL=postgresql://postgres:postgres@db:5432/ai_registration
SECRET_KEY=your-secret-key
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Frontend
Create a `.env` file in the `frontend` directory with the following variables:
```
VITE_API_URL=http://localhost:8000
```

## Project Structure

```
ai-registration-assistant/
│
├── backend/                 # FastAPI backend
│   ├── app/                 # Application code
│   │   ├── api/             # API routes
│   │   ├── core/            # Core functionality
│   │   ├── db/              # Database configuration
│   │   ├── models/          # Database models
│   │   ├── schemas/         # Pydantic models
│   │   └── services/        # Business logic
│   ├── tests/               # Test files
│   ├── .env                 # Environment variables
│   ├── Dockerfile           # Backend Dockerfile
│   └── requirements.txt     # Python dependencies
│
├── frontend/               # React frontend
│   ├── public/              # Static files
│   ├── src/                 # Source code
│   ├── .env                # Frontend environment variables
│   └── Dockerfile           # Frontend Dockerfile
│
├── database/               # Database initialization scripts
├── docker-compose.yml       # Docker Compose configuration
└── README.md               # Project documentation
```

## API Documentation

Once the backend is running, you can access the interactive API documentation at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
