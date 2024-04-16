from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
from config import db, bcrypt
from helpers import *

class Item(db.Model, SerializerMixin):
    pass

    __tablename__ = 'items'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.String)
    db.part_number = db.Column(db.String)
    
    def __repr__(self):
        return f"<Item {self.id}, {self.name}, {self.description}, {self.part_number}>"