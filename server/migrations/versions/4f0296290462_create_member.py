"""Create member

Revision ID: 4f0296290462
Revises: 7742b06ce1ec
Create Date: 2024-04-17 22:16:56.040572

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '4f0296290462'
down_revision = '7742b06ce1ec'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('members',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('organization_id', sa.Integer(), nullable=True),
    sa.Column('role', sa.String(), nullable=False),
    sa.Column('joined', sa.DateTime(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=True),
    sa.CheckConstraint('(role == "OWNER") or (role == "ADMIN") or (role == "REGULAR")', name=op.f('ck_members_check_role_constraint')),
    sa.ForeignKeyConstraint(['organization_id'], ['organizations.id'], name=op.f('fk_members_organization_id_organizations')),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], name=op.f('fk_members_user_id_users')),
    sa.PrimaryKeyConstraint('id', name=op.f('pk_members'))
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('members')
    # ### end Alembic commands ###