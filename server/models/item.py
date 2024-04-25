from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from config import db
from sqlalchemy.orm import validates
from helpers import *
from models.assignment import Assignment

class Item(db.Model, SerializerMixin):
    
    serialize_rules = ('-assignments', '-organizations')

    __tablename__ = 'items'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False)
    description = db.Column(db.String)
    part_number = db.Column(db.String, unique=True)
    image_url = db.Column(db.String)
    
    # We do not need to list the organizations that use this item, since this is sensitive information.
    
     # Assignments
    assignments = db.relationship('Assignment', back_populates='item', cascade='all, delete-orphan')
    
    # Items that an organization tracks.
    organizations = association_proxy('assignments', 'organization', creator=lambda org_obj: Assignment(organization=org_obj))

    @validates('name')
    def validate_name(self, key, name):
        if not is_non_empty_string(name):
            raise ValueError(f"{key.title()} must be a non-empty string.")
        if Item.query.filter_by(name=name).first():
            raise ValueError(f"An item with name, {name}, already exists.")
        return name
    
    def __repr__(self):
        return f"<Item {self.id}, {self.name}, {self.description}, {self.part_number}>"