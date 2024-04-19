from sqlalchemy_serializer import SerializerMixin
from config import db
from sqlalchemy.orm import validates
from helpers import *

class Assignment(db.Model, SerializerMixin):
    
    __tablename__ = 'assignments'
    id = db.Column(db.Integer, primary_key=True)
    item_id = db.Column(db.Integer, db.ForeignKey('items.id'))
    organization_id = db.Column(db.Integer, db.ForeignKey('organizations.id'))
    # The number of items of id {item_id} in the organization
    count = db.Column(db.Integer, db.CheckConstraint('count >= 0', name='check_count_constraint'), nullable=False)
    added_at = db.Column(db.DateTime, server_default=db.func.now(), nullable=False)
    last_updated = db.Column(db.DateTime, onupdate=db.func.now())
    
    item = db.relationship('Item', back_populates='assignments')
    organization = db.relationship('Organization', back_populates='assignments')
    
    def __repr__(self):
        return f"<Count {self.id}, {self.item_id}, {self.organization_id}, {self.count}"
    
    @validates('count')
    def validate_count(self, key, count):
        if count < 0:
            raise ValueError(f"{key} - Item count must be non-negative.")
        return count