-- Initialize the AI Registration Assistant database

-- Create database
CREATE DATABASE ai_registration;
\c ai_registration;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create test database for development
CREATE DATABASE test_ai_registration;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE ai_registration TO postgres;
GRANT ALL PRIVILEGES ON DATABASE test_ai_registration TO postgres;
