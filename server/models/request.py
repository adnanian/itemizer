from sqlalchemy_serializer import SerializerMixin
from config import db
from sqlalchemy.orm import validates
from helpers import *
from models.membership import Membership

# Requests to join an organization.
class Request(db.Model, SerializerMixin):
    
    __tablename__ = 'requests'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    organization_id = db.Column(db.Integer, db.ForeignKey('organizations.id'), nullable=False)
    
    user = db.relationship('User', back_populates='requests')
    organization = db.relationship('Organization', back_populates='requests')
    
    def __repr__(self):
        return f"<Request {self.id}, {self.user_id}, {self.organization_id}>"
    
    @validates('organization_id')
    def validate_request(self, key, organization_id):
        if Request.query.filter(Request.user_id == self.user_id, Request.organization_id == organization_id).first():
            raise ValueError(f"User of ID {self.user_id} is already in the request queue for organization ID {organization_id}")
        if Membership.query.filter(Membership.user_id == self.user_id, Membership.organization_id == organization_id).first():
            raise ValueError(f"User ID {self.user_id} already belongs to organization ID {organization_id}")
        return organization_id