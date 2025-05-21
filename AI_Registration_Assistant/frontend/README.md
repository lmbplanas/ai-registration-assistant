# AI Registration Assistant - Frontend

This is the frontend for the AI Registration Assistant, built with React, Vite, and Tailwind CSS.

## Features

- Responsive registration form
- File upload support
- Form validation
- Loading states and error handling
- Clean, modern UI with Tailwind CSS

## Prerequisites

- Node.js 16+ and npm/yarn
- Backend API server (see backend README for setup)

## Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory:
   ```
   VITE_API_URL=http://localhost:8000  # Your backend API URL
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

   The app will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/          # Page components
├── assets/         # Static assets
├── config/         # App configuration
├── hooks/          # Custom React hooks
├── utils/          # Utility functions
├── App.jsx         # Main app component
└── main.jsx        # App entry point
```

## Styling

This project uses [Tailwind CSS](https://tailwindcss.com/) for styling. The main configuration is in `tailwind.config.js`.

## API Integration

The frontend makes requests to the backend API. The base URL can be configured in the `.env` file.

## Deployment

### Building for Production

```bash
npm run build
```

This will create a `dist` directory with the production build.

### Deploying to Vercel

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

## License

MIT
