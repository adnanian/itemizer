"""remove user_id from org

Revision ID: 7742b06ce1ec
Revises: bf2dd86b8e32
Create Date: 2024-04-17 21:24:16.506173

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '7742b06ce1ec'
down_revision = 'bf2dd86b8e32'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('organizations', schema=None) as batch_op:
        batch_op.drop_constraint('fk_organizations_user_id_users', type_='foreignkey')
        batch_op.drop_column('user_id')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('organizations', schema=None) as batch_op:
        batch_op.add_column(sa.Column('user_id', sa.INTEGER(), nullable=False))
        batch_op.create_foreign_key('fk_organizations_user_id_users', 'users', ['user_id'], ['id'])

    # ### end Alembic commands ###
