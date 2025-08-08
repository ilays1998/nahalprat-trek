"""Rename user table to app_user

Revision ID: d84acb1a8319
Revises: 474970ecffc5
Create Date: 2025-08-08 10:02:19.670068

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'd84acb1a8319'
down_revision = '474970ecffc5'
branch_labels = None
depends_on = None


def upgrade():
    # Rename the user table to app_user
    op.rename_table('user', 'app_user')


def downgrade():
    # Rename the app_user table back to user
    op.rename_table('app_user', 'user')
