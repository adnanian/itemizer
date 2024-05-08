from sqlalchemy_serializer import SerializerMixin
from config import db
from sqlalchemy.orm import validates
from helpers import *

class Assignment(db.Model, SerializerMixin):
    """
    Connects an organization and item together.
    An organization can have many items.
    An item can be used in many organizations.
    An assignment belongs to one organization and one item.
    Purpose of this model is to ensure that an item type locally used in an organization would
    have an accurately different quantity than that of another organization.
    """
    
    serialize_rules = (
        '-organization.assignments',
        '-organization.items',
        '-organization.memberships',
        '-organization.users'
    )
    
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
        """Validates that the count attribute is a non-negative integer.

        Args:
            key (_type_): the attribute name. (Must be key)
            count (int): the count attribute value.

        Raises:
            ValueError: if count is a NOT a non-negative integer.

        Returns:
            int: the value of count.
        """
        if type(count) is not int or count < 0:
            raise ValueError(f"{key} - Item count must be a non-negative integer.")
        return count