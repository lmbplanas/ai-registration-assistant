-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create company table
CREATE TABLE company (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name VARCHAR(255) NOT NULL UNIQUE,
    area_of_service VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create index on company_name for faster lookups
CREATE INDEX idx_company_company_name ON company(company_name);

-- Create applicant table
CREATE TABLE applicant (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_company
        FOREIGN KEY (company_id)
        REFERENCES company(id)
        ON DELETE CASCADE
);

-- Create indexes for applicant table
CREATE INDEX idx_applicant_company_id ON applicant(company_id);
CREATE UNIQUE INDEX idx_applicant_email ON applicant(email);

-- Create uploaded_file table
CREATE TABLE uploaded_file (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(512) NOT NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_company_file
        FOREIGN KEY (company_id)
        REFERENCES company(id)
        ON DELETE CASCADE
);

-- Create index for uploaded_file table
CREATE INDEX idx_uploaded_file_company_id ON uploaded_file(company_id);

-- Add comments for documentation
COMMENT ON TABLE company IS 'Stores company information';
COMMENT ON COLUMN company.id IS 'Primary key, auto-generated UUID';
COMMENT ON COLUMN company.company_name IS 'Name of the company, must be unique';
COMMENT ON COLUMN company.area_of_service IS 'The area or industry the company serves';
COMMENT ON COLUMN company.created_at IS 'Timestamp when the company record was created';

COMMENT ON TABLE applicant IS 'Stores applicant information';
COMMENT ON COLUMN applicant.id IS 'Primary key, auto-generated UUID';
COMMENT ON COLUMN applicant.company_id IS 'Foreign key referencing company.id';
COMMENT ON COLUMN applicant.full_name IS 'Full name of the applicant';
COMMENT ON COLUMN applicant.email IS 'Email address of the applicant, must be unique';
COMMENT ON COLUMN applicant.phone IS 'Contact phone number';
COMMENT ON COLUMN applicant.submitted_at IS 'Timestamp when the application was submitted';

COMMENT ON TABLE uploaded_file IS 'Stores information about files uploaded by companies';
COMMENT ON COLUMN uploaded_file.id IS 'Primary key, auto-generated UUID';
COMMENT ON COLUMN uploaded_file.company_id IS 'Foreign key referencing company.id';
COMMENT ON COLUMN uploaded_file.file_name IS 'Original name of the uploaded file';
COMMENT ON COLUMN uploaded_file.file_url IS 'URL or path to the stored file';
COMMENT ON COLUMN uploaded_file.uploaded_at IS 'Timestamp when the file was uploaded';
