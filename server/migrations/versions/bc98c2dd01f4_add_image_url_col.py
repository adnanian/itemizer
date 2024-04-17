"""Add image_url col

Revision ID: bc98c2dd01f4
Revises: 21be73e7f51e
Create Date: 2024-04-16 21:27:37.206365

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'bc98c2dd01f4'
down_revision = '21be73e7f51e'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('items', schema=None) as batch_op:
        batch_op.add_column(sa.Column('image_url', sa.String(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('items', schema=None) as batch_op:
        batch_op.drop_column('image_url')

    # ### end Alembic commands ###