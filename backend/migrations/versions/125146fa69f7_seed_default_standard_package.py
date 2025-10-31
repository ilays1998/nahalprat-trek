"""seed default standard package

Revision ID: 125146fa69f7
Revises: a1b2c3d4e5f6
Create Date: 2025-10-31 12:43:31.241357
"""

from alembic import op
import sqlalchemy as sa
from datetime import datetime

# revision identifiers, used by Alembic.
revision = '125146fa69f7'
down_revision = 'a1b2c3d4e5f6'
branch_labels = None
depends_on = None


def upgrade():
    # === Create table (auto-generated) ===
    op.create_table(
        'package',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=64), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('price_per_person', sa.Integer(), nullable=False),
        sa.Column('currency', sa.String(length=8), nullable=True),
        sa.Column('active', sa.Boolean(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('name')
    )

    with op.batch_alter_table('visitor', schema=None) as batch_op:
        batch_op.drop_constraint(batch_op.f('visitor_visitor_id_key'), type_='unique')

    # === Seed default package ===
    conn = op.get_bind()
    existing = conn.execute(sa.text("SELECT id FROM package WHERE name = 'standard'")).fetchone()

    if not existing:
        conn.execute(sa.text("""
            INSERT INTO package (name, description, price_per_person, currency, active, created_at)
            VALUES (:name, :description, :price, :currency, :active, :created_at)
        """), {
            "name": "standard",
            "description": "Standard desert trek package",
            "price": 1000,
            "currency": "ILS",
            "active": True,
            "created_at": datetime.utcnow(),
        })
        print("✅ Default 'standard' package seeded.")
    else:
        print("ℹ️ 'standard' package already exists — skipping.")


def downgrade():
    # === Remove seeded data ===
    conn = op.get_bind()
    conn.execute(sa.text("DELETE FROM package WHERE name = 'standard'"))
    print("🗑️ Removed default 'standard' package.")

    with op.batch_alter_table('visitor', schema=None) as batch_op:
        batch_op.create_unique_constraint(batch_op.f('visitor_visitor_id_key'), ['visitor_id'])

    op.drop_table('package')
