from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from config import db
from sqlalchemy.orm import validates
from helpers import *
from models.membership import Membership
from models.assignment import Assignment

class Organization(db.Model, SerializerMixin):
    """
    A group of related users managing a collection of items.
    An organization can have many requests to join.
    An organization has many memberships (users as members).
    An organization has many assignments (items asigned specifically for that org).
    A user can belong to many organizations.
    A membership, assignment, and request, can each belong to one user.
    """
    
    serialize_rules = (
        #'-memberships.user',
        '-memberships.organization',
        '-memberships.user.requests',
        '-users.memberships',
        '-users.organizations',
        '-assignments.organization',
        '-assignments.item_id',
        '-assignments.organization_id'
        '-items',
        '-requests.organization'
    )

    __tablename__ = 'organizations'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False)
    description = db.Column(db.String)
    created = db.Column(db.DateTime, server_default=db.func.now(), nullable=False)
    
    memberships = db.relationship('Membership', back_populates='organization', cascade='all, delete-orphan')
    # List of users in the organization.
    users = association_proxy('memberships', 'user', creator=lambda user_obj: Membership(user=user_obj))
    
    # Assignments
    assignments = db.relationship('Assignment', back_populates='organization', cascade='all, delete-orphan')
    
    # Items that an organization tracks.
    items = association_proxy('assignments', 'item', creator=lambda item_obj: Assignment(item=item_obj))
    
    requests = db.relationship('Request', back_populates='organization', cascade='all, delete-orphan')
    
    def __repr__(self):
        return f"<Organization {self.id}, {self.name}, {self.description}, {self.created}>"
    
    @validates('name')
    def validate_name(self, key, name):
        """Validates that the name is a non-empty, non-unique string.

        Args:
            key (str): the attribute name.
            name (str): the name attribute value.

        Raises:
            ValueError: if name is NOT a non-empty string.
            ValueError: if name is not unique.

        Returns:
            str: the value of name..
        """
        if not(is_non_empty_string(name) and Organization.query.filter_by(name=name).first() is None):
            raise ValueError(f"{key.title()} must be a unique, non-empty string.")
        return name