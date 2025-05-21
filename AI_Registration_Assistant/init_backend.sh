#!/bin/bash

# Navigate to backend directory
cd backend

# Create a virtual environment
echo "Creating a Python virtual environment..."
python3 -m venv venv

# Activate the virtual environment
echo "Activating the virtual environment..."
source venv/bin/activate  # On Windows: .\venv\Scripts\activate

# Install dependencies
echo "Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cat > .env << EOL
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ai_registration
SECRET_KEY=your-secret-key-for-development-only
ACCESS_TOKEN_EXPIRE_MINUTES=30
EOL
fi

echo "Backend setup complete! Run 'uvicorn main:app --reload' to start the development server."
