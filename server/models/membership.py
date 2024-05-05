from sqlalchemy_serializer import SerializerMixin
from config import db
from sqlalchemy.orm import validates
from helpers import *

ROLES = ['OWNER', 'ADMIN', 'REGULAR']
"""
    REGULAR = Can add items to organization and adjust quantities.
    ADMIN = Have regular permissions, and can also remove items, as well as manage users and requests.
    OWNER = Have admin permssions, and can also edit and delete an organization.
"""

class Membership(db.Model, SerializerMixin):
    """Binds users and organizations together.
    A user can belong to many organizations.
    An organization can have many users.
    A membership belongs to one user and one organization.
    """
    
    serialize_rules = (
        '-user.memberships',
        '-user.organizations',
        '-user.requests',
        '-organization.memberships',
        '-organization.users',
        '-organization.assignments',
        '-organization.requests'
    )
    
    __tablename__ = 'memberships'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    organization_id = db.Column(db.Integer, db.ForeignKey('organizations.id'))
    role = db.Column(db.String, nullable=False)
    joined = db.Column(db.DateTime, server_default=db.func.now(), nullable=False)
    
    user = db.relationship('User', back_populates='memberships')
    organization = db.relationship('Organization', back_populates='memberships')
    
    __table_args__ = (
        db.CheckConstraint('(role == "OWNER") or (role == "ADMIN") or (role == "REGULAR")', name='check_role_constraint'),
    )
    
    def __repr__(self):
        return f"<Membership {self.id}, {self.user_id}, {self.organization_id}, {self.role}, {self.joined}"
    
    @validates('role')
    def validate_role(self, key, role):
        """Validates that a valid role name was entered.

        Args:
            key (str): the attribute name.
            role (str): the role attribute value.

        Raises:
            ValueError: if there is already a membership with the given user_id and orgnization_id under membership.
            ValueError: if the value of role is not a non-empty string.
            ValueError: if an invalid role name from the list of roles was entered.
            ValueError: if a user attempts to assign ownership to an organization when there already is one.
            ValueError: if a user is already a member of an organization.

        Returns:
            str: the value of role.
        """
        if Membership.query.filter(Membership.user_id == self.user_id, Membership.organization_id == self.organization_id).first():
            #print(stack_trace())
            print(get_model_invoker())
            if (get_model_invoker() != 'patch'):
                raise ValueError(f"User {self.user_id} already belongs to organization {self.organization_id}.")
        if not is_non_empty_string(role):
             raise ValueError(f"{key.title()} must be a non-empty string.")
        role = role.upper()
        #print(role, self.organization_id)
        if role not in ROLES:
            raise ValueError(f"{key.title()} must be one of the following values: {ROLES}")
        if role == ROLES[0] and Membership.query.filter(Membership.organization_id==self.organization_id, Membership.role==ROLES[0]).first():
            raise ValueError(f"Only one member of an organization can be the owner.")
        if (not Membership.query.filter(Membership.organization_id==self.organization_id).first()) and (role != ROLES[0]):
            raise ValueError(f"{key.title()} must be owner for the first member.")
        return role