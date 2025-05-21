"""Initial schema

Revision ID: 001
Revises: 
Create Date: 2025-05-20 16:56:51.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '001'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    # Create extension for UUID
    op.execute('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    
    # Create company table
    op.create_table(
        'company',
        sa.Column('id', postgresql.UUID(as_uuid=True), server_default=sa.text('uuid_generate_v4()'), primary_key=True, index=True),
        sa.Column('company_name', sa.String(255), nullable=False, unique=True),
        sa.Column('area_of_service', sa.String(255), nullable=True),
        sa.Column('created_at', sa.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create index on company_name for faster lookups
    op.create_index(op.f('ix_company_company_name'), 'company', ['company_name'], unique=True)
    
    # Create applicant table
    op.create_table(
        'applicant',
        sa.Column('id', postgresql.UUID(as_uuid=True), server_default=sa.text('uuid_generate_v4()'), primary_key=True, index=True),
        sa.Column('company_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('full_name', sa.String(255), nullable=False),
        sa.Column('email', sa.String(255), nullable=False),
        sa.Column('phone', sa.String(50), nullable=True),
        sa.Column('submitted_at', sa.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['company_id'], ['company.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create uploaded_file table
    op.create_table(
        'uploaded_file',
        sa.Column('id', postgresql.UUID(as_uuid=True), server_default=sa.text('uuid_generate_v4()'), primary_key=True, index=True),
        sa.Column('company_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('file_name', sa.String(255), nullable=False),
        sa.Column('file_url', sa.String(512), nullable=False),
        sa.Column('uploaded_at', sa.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['company_id'], ['company.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create indexes for foreign keys and commonly queried fields
    op.create_index(op.f('ix_applicant_company_id'), 'applicant', ['company_id'], unique=False)
    op.create_index(op.f('ix_applicant_email'), 'applicant', ['email'], unique=True)
    op.create_index(op.f('ix_uploaded_file_company_id'), 'uploaded_file', ['company_id'], unique=False)

def downgrade():
    # Drop tables in reverse order of creation to avoid foreign key constraint violations
    op.drop_index(op.f('ix_uploaded_file_company_id'), table_name='uploaded_file')
    op.drop_index(op.f('ix_applicant_email'), table_name='applicant')
    op.drop_index(op.f('ix_applicant_company_id'), table_name='applicant')
    op.drop_table('uploaded_file')
    op.drop_table('applicant')
    op.drop_index(op.f('ix_company_company_name'), table_name='company')
    op.drop_table('company')
