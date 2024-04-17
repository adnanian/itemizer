from sqlalchemy_serializer import SerializerMixin
from config import db
from sqlalchemy.orm import validates
from helpers import *

class Organization(db.Model, SerializerMixin):
    pass

    __tablename__ = 'organizations'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False)
    description = db.Column(db.String)
    creator = db.Column(db.String, nullable=False)
    created = db.Column(db.DateTime)
    
    @validates('name')
    def validate_name(self, key, name):
        if not(is_non_empty_string(name) and Organization.query.filter_by(name=name).first() is None):
            raise ValueError(f"{key.title()} must be a unique, non-empty string.")
        return name