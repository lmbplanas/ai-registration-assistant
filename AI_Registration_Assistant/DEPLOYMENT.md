# Deployment Guide

This guide provides step-by-step instructions for deploying the AI Registration Assistant application to production.

## Table of Contents
- [Backend Deployment (Render)](#backend-deployment-render)
- [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
- [Environment Variables](#environment-variables)
- [Database Management](#database-management)
- [Custom Domain Setup](#custom-domain-setup)
- [Troubleshooting](#troubleshooting)

## Backend Deployment (Render)

### Prerequisites
- A Render.com account
- A PostgreSQL database (can be provisioned through Render)

### Deployment Steps

1. **Push your code to a Git repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repository-url>
   git push -u origin main
   ```

2. **Deploy to Render**
   - Log in to your [Render Dashboard](https://dashboard.render.com/)
   - Click "New" and select "Blueprint"
   - Connect your repository
   - Click "Apply" to deploy

3. **Configure Environment Variables**
   Go to your service in Render Dashboard:
   - Navigate to "Environment" tab
   - Add the following environment variables:
     ```
     DATABASE_URL=postgresql://user:password@host:port/dbname
     SECRET_KEY=your-secure-secret-key
     ACCESS_TOKEN_EXPIRE_MINUTES=30
     ENVIRONMENT=production
     ```

4. **Deploy**
   - Click "Deploy" to start the deployment
   - Monitor the logs for any issues

## Frontend Deployment (Vercel)

### Prerequisites
- A Vercel account
- Node.js and npm installed locally

### Deployment Steps

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Configure Environment Variables**
   Create a `.env` file in the frontend directory:
   ```
   VITE_API_URL=https://your-render-backend-url.onrender.com
   ```

3. **Deploy to Vercel**
   ```bash
   cd frontend
   vercel
   ```
   - Follow the prompts to log in and configure your project
   - Choose your Vercel account and project settings

4. **Configure Production Environment**
   - Go to your Vercel project settings
   - Navigate to "Environment Variables"
   - Add the same environment variables from your local `.env` file

## Environment Variables

### Backend

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Yes | - |
| `SECRET_KEY` | Secret key for JWT token signing | Yes | - |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | JWT token expiration time | No | 30 |
| `ENVIRONMENT` | Application environment | No | development |
| `SMTP_*` | SMTP configuration for emails | No | - |

### Frontend

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `VITE_API_URL` | Backend API URL | Yes | - |

## Database Management

### Migrations
To run database migrations in production:

```bash
# After connecting to your production server
alembic upgrade head
```

### Backups
Set up automated backups for your PostgreSQL database through your hosting provider.

## Custom Domain Setup

### Backend (Render)
1. Go to your service in Render Dashboard
2. Click "Settings" > "Custom Domains"
3. Add your domain (e.g., `api.yourdomain.com`)
4. Update DNS settings with your domain registrar

### Frontend (Vercel)
1. Go to your Vercel project
2. Click "Settings" > "Domains"
3. Add your domain (e.g., `app.yourdomain.com`)
4. Update DNS settings as instructed

## Troubleshooting

### Backend Issues
- **Connection Refused**: Check if the database is running and accessible
- **Migrations Failed**: Ensure the database user has proper permissions
- **Environment Variables**: Verify all required variables are set

### Frontend Issues
- **API Connection**: Check if `VITE_API_URL` is correct and CORS is configured
- **Build Failures**: Check the build logs in Vercel
- **Environment Variables**: Ensure all required variables are set in Vercel

### Performance
- Enable caching for static assets
- Use a CDN for global distribution
- Monitor performance using Vercel Analytics

## Monitoring and Maintenance

### Backend
- Set up logging and monitoring in Render
- Configure alerts for errors and performance issues
- Regularly update dependencies

### Frontend
- Use Vercel Analytics for performance monitoring
- Set up error tracking (e.g., Sentry)
- Regularly update dependencies

## Security Considerations

- Keep all secrets in environment variables, never in version control
- Use HTTPS for all connections
- Regularly update dependencies to patch security vulnerabilities
- Implement rate limiting on the backend
- Use secure headers (already configured in the application)
