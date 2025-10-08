"""replace user_login with visitor tracking

Revision ID: e8f3a9d21b45
Revises: 825b8e791d45
Create Date: 2025-10-04 16:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'e8f3a9d21b45'
down_revision = '825b8e791d45'
branch_labels = None
depends_on = None


def upgrade():
    # Drop the user_login table
    op.drop_table('user_login')
    
    # Create the visitor table
    op.create_table('visitor',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('visitor_id', sa.String(length=36), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('first_visit', sa.DateTime(), nullable=False),
    sa.Column('last_visit', sa.DateTime(), nullable=False),
    sa.Column('visit_count', sa.Integer(), nullable=False),
    sa.Column('ip_address', sa.String(length=45), nullable=True),
    sa.Column('region', sa.String(length=255), nullable=True),
    sa.Column('country', sa.String(length=2), nullable=True),
    sa.Column('city', sa.String(length=255), nullable=True),
    sa.Column('user_agent', sa.String(length=512), nullable=True),
    sa.Column('referrer', sa.String(length=512), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['app_user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_visitor_visitor_id'), 'visitor', ['visitor_id'], unique=True)


def downgrade():
    # Drop the visitor table
    op.drop_index(op.f('ix_visitor_visitor_id'), table_name='visitor')
    op.drop_table('visitor')
    
    # Recreate the user_login table
    op.create_table('user_login',
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('user_id', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.Column('login_time', postgresql.TIMESTAMP(), autoincrement=False, nullable=False),
    sa.Column('ip_address', sa.VARCHAR(length=45), autoincrement=False, nullable=False),
    sa.Column('region', sa.VARCHAR(length=255), autoincrement=False, nullable=True),
    sa.Column('country', sa.VARCHAR(length=2), autoincrement=False, nullable=True),
    sa.Column('city', sa.VARCHAR(length=255), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['app_user.id'], name='user_login_user_id_fkey'),
    sa.PrimaryKeyConstraint('id', name='user_login_pkey')
    )
