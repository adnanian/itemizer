"""Rename member to membership

Revision ID: cb06c17a301f
Revises: 27d4dfdeecf2
Create Date: 2024-04-18 20:44:48.140228

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'cb06c17a301f'
down_revision = '27d4dfdeecf2'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.rename_table('members', 'memberships')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.rename_table('memberships', 'members')
    # ### end Alembic commands ###