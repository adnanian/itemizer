from sqlalchemy_serializer import SerializerMixin
from config import db
from sqlalchemy.orm import validates
from helpers import *

class Item(db.Model, SerializerMixin):
    pass

    __tablename__ = 'items'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.String)
    db.part_number = db.Column(db.String)

    @validates('name')
    def validate_name(self, key, name):
        if not is_non_empty_string(name):
            raise ValueError(f"{key.title()} must be a non-empty string.")
        return name
    
    def __repr__(self):
        return f"<Item {self.id}, {self.name}, {self.description}, {self.part_number}>"