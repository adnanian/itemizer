"""Create assignment

Revision ID: 98d690973329
Revises: cb06c17a301f
Create Date: 2024-04-18 21:55:52.913699

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '98d690973329'
down_revision = 'cb06c17a301f'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('assignments',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('item_id', sa.Integer(), nullable=True),
    sa.Column('organization_id', sa.Integer(), nullable=True),
    sa.Column('count', sa.Integer(), nullable=False),
    sa.Column('added_at', sa.DateTime(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
    sa.Column('last_updated', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['item_id'], ['items.id'], name=op.f('fk_assignments_item_id_items')),
    sa.ForeignKeyConstraint(['organization_id'], ['organizations.id'], name=op.f('fk_assignments_organization_id_organizations')),
    sa.PrimaryKeyConstraint('id', name=op.f('pk_assignments'))
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('assignments')
    # ### end Alembic commands ###