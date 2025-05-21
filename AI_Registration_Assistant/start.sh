#!/bin/bash

echo "Starting AI Registration Assistant with Docker Compose..."
docker-compose up --build -d

echo ""
echo "Services are starting up..."
echo ""
echo "Once ready, you can access:"
echo "- Frontend: http://localhost:5173"
echo "- Backend API: http://localhost:8000"
echo "- API Documentation: http://localhost:8000/docs"
echo "- pgAdmin: http://localhost:5050 (email: admin@example.com, password: admin)"
echo ""
echo "To view logs, run: docker-compose logs -f"
