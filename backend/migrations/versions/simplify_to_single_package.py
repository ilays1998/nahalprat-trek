"""Simplify to single package system

Revision ID: simplify_single_package
Revises: d84acb1a8319
Create Date: 2024-10-04 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '9f3e2d8c1a5b'
down_revision = '825b8e791d45'
branch_labels = None
depends_on = None


def upgrade():
    # Check if available_spots column already exists, if not add it
    connection = op.get_bind()
    inspector = sa.inspect(connection)
    columns = [col['name'] for col in inspector.get_columns('trek_date')]
    
    if 'available_spots' not in columns:
        op.add_column('trek_date', sa.Column('available_spots', sa.Integer(), default=20))
    
    # Copy data from available_spots_pro to available_spots if the old columns exist
    if 'available_spots_pro' in columns:
        op.execute('UPDATE trek_date SET available_spots = COALESCE(available_spots_pro, 20)')
        
        # Remove old package-specific columns only if they exist
        if 'available_spots_basic' in columns:
            op.drop_column('trek_date', 'available_spots_basic')
        if 'available_spots_pro' in columns:
            op.drop_column('trek_date', 'available_spots_pro')
        if 'available_spots_premium' in columns:
            op.drop_column('trek_date', 'available_spots_premium')
    
    # Update existing bookings to use 'standard' package type
    op.execute("UPDATE booking SET package_type = 'standard' WHERE package_type IN ('basic', 'pro', 'premium')")
    
    # Update total_price for existing bookings to standard price (1000 NIS)
    op.execute("UPDATE booking SET total_price = 1000 * participants_count WHERE package_type = 'standard'")


def downgrade():
    # Add back the old package columns
    op.add_column('trek_date', sa.Column('available_spots_basic', sa.Integer(), default=12))
    op.add_column('trek_date', sa.Column('available_spots_pro', sa.Integer(), default=8))
    op.add_column('trek_date', sa.Column('available_spots_premium', sa.Integer(), default=4))
    
    # Copy available_spots back to pro column
    op.execute('UPDATE trek_date SET available_spots_pro = available_spots')
    
    # Remove the single column
    op.drop_column('trek_date', 'available_spots')
    
    # Revert bookings (this is approximate since we lose the original package type info)
    op.execute("UPDATE booking SET package_type = 'pro' WHERE package_type = 'standard'")