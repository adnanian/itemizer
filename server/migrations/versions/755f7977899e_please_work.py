"""Please work

Revision ID: 755f7977899e
Revises: 
Create Date: 2024-05-05 06:09:42.087866

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '755f7977899e'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('items',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('description', sa.String(), nullable=True),
    sa.Column('part_number', sa.String(), nullable=True),
    sa.Column('image_url', sa.String(), nullable=True),
    sa.PrimaryKeyConstraint('id', name=op.f('pk_items')),
    sa.UniqueConstraint('name', name=op.f('uq_items_name')),
    sa.UniqueConstraint('part_number', name=op.f('uq_items_part_number'))
    )
    op.create_table('organizations',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('description', sa.String(), nullable=True),
    sa.Column('created', sa.DateTime(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
    sa.PrimaryKeyConstraint('id', name=op.f('pk_organizations')),
    sa.UniqueConstraint('name', name=op.f('uq_organizations_name'))
    )
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('first_name', sa.String(), nullable=False),
    sa.Column('last_name', sa.String(), nullable=False),
    sa.Column('username', sa.String(), nullable=False),
    sa.Column('email', sa.String(), nullable=False),
    sa.Column('_password_hash', sa.String(), nullable=True),
    sa.Column('created', sa.DateTime(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
    sa.Column('last_updated', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id', name=op.f('pk_users')),
    sa.UniqueConstraint('email', name=op.f('uq_users_email')),
    sa.UniqueConstraint('username', name=op.f('uq_users_username'))
    )
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
    op.create_table('memberships',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('organization_id', sa.Integer(), nullable=True),
    sa.Column('role', sa.String(), nullable=False),
    sa.Column('joined', sa.DateTime(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
    sa.CheckConstraint('(role == "OWNER") or (role == "ADMIN") or (role == "REGULAR")', name=op.f('ck_memberships_check_role_constraint')),
    sa.ForeignKeyConstraint(['organization_id'], ['organizations.id'], name=op.f('fk_memberships_organization_id_organizations')),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], name=op.f('fk_memberships_user_id_users')),
    sa.PrimaryKeyConstraint('id', name=op.f('pk_memberships'))
    )
    op.create_table('requests',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('organization_id', sa.Integer(), nullable=False),
    sa.Column('reason_to_join', sa.String(), nullable=False),
    sa.Column('submitted', sa.DateTime(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
    sa.ForeignKeyConstraint(['organization_id'], ['organizations.id'], name=op.f('fk_requests_organization_id_organizations')),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], name=op.f('fk_requests_user_id_users')),
    sa.PrimaryKeyConstraint('id', name=op.f('pk_requests'))
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('requests')
    op.drop_table('memberships')
    op.drop_table('assignments')
    op.drop_table('users')
    op.drop_table('organizations')
    op.drop_table('items')
    # ### end Alembic commands ###