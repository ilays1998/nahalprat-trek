"""simplify_to_single_package

Revision ID: 825b8e791d45
Revises: d1c7b2f11422
Create Date: 2025-10-04 18:07:26.745794

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '825b8e791d45'
down_revision = 'd1c7b2f11422'
branch_labels = None
depends_on = None


def upgrade():
    # This migration was originally empty but should have handled the package simplification
    # The actual changes are now in migration a1b2c3d4e5f6_fix_available_spots_column.py
    pass


def downgrade():
    pass
