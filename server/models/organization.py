from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from config import db
from sqlalchemy.orm import validates
from helpers import *
from models.membership import Membership
from models.assignment import Assignment

class Organization(db.Model, SerializerMixin):
    pass

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
    
    def __repr__(self):
        return f"<Organization {self.id}, {self.name}, {self.description}, {self.created}>"
    
    @validates('name')
    def validate_name(self, key, name):
        if not(is_non_empty_string(name) and Organization.query.filter_by(name=name).first() is None):
            raise ValueError(f"{key.title()} must be a unique, non-empty string.")
        return name