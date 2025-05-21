#!/bin/bash

# Navigate to frontend directory
cd frontend

# Initialize a new Vite project with React and TypeScript
echo "Creating a new Vite project with React and TypeScript..."
npm create vite@latest . -- --template react-ts

# Install dependencies
echo "Installing dependencies..."
npm install

# Install Tailwind CSS and its peer dependencies
echo "Installing Tailwind CSS and its dependencies..."
npm install -D tailwindcss postcss autoprefixer

# Initialize Tailwind CSS
npx tailwindcss init -p

# Configure Tailwind CSS
echo "Configuring Tailwind CSS..."
cat > tailwind.config.js << EOL
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
EOL

# Update the CSS file
echo "Updating CSS file..."
cat > src/index.css << EOL
@tailwind base;
@tailwind components;
@tailwind utilities;
EOL

# Install additional dependencies
echo "Installing additional dependencies..."
npm install axios react-router-dom @heroicons/react react-hook-form @hookform/resolvers yup @tanstack/react-query

# Create basic folder structure
echo "Creating folder structure..."
mkdir -p src/{components,context,hooks,pages,services,utils,assets,types,layouts,api}

echo "Frontend setup complete! Run 'npm run dev' to start the development server."
