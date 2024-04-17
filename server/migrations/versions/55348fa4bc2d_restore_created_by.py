"""restore created_by

Revision ID: 55348fa4bc2d
Revises: 2fda9c1b81c1
Create Date: 2024-04-17 15:55:03.655870

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '55348fa4bc2d'
down_revision = '2fda9c1b81c1'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('organizations', schema=None) as batch_op:
        batch_op.drop_column('created_at')
        batch_op.add_column(sa.Column('created_by', sa.String(), nullable=False))
        batch_op.add_column(sa.Column('created_at', sa.DATETIME(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('organizations', schema=None) as batch_op:
        batch_op.add_column(sa.Column('created_at', sa.DATETIME(), nullable=True))

    # ### end Alembic commands ###
