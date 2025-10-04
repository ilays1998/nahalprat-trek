"""drop orphaned visitor_session table

Revision ID: f1a2b3c4d5e6
Revises: e8f3a9d21b45
Create Date: 2025-10-04 16:30:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'f1a2b3c4d5e6'
down_revision = 'e8f3a9d21b45'
branch_labels = None
depends_on = None


def upgrade():
    # Drop the orphaned visitor_session table (not used by models)
    op.execute('DROP TABLE IF EXISTS visitor_session')


def downgrade():
    # Can't recreate as we don't know the original structure
    pass
