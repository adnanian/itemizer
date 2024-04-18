from sqlalchemy_serializer import SerializerMixin
from config import db
from sqlalchemy.orm import validates
from helpers import *

ROLES = ['OWNER', 'ADMIN', 'REGULAR']

class Member(db.Model, SerializerMixin):
    
    __tablename__ = 'members'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    organization_id = db.Column(db.Integer, db.ForeignKey('organizations.id'))
    role = db.Column(db.String, nullable=False)
    joined = db.Column(db.DateTime, server_default=db.func.now(), nullable=False)
    
    __table_args__ = (
        db.CheckConstraint('(role == "OWNER") or (role == "ADMIN") or (role == "REGULAR")', name='check_role_constraint'),
    )
    
    @validates('role')
    def validate_role(self, key, role):
        if not is_non_empty_string(role):
             raise ValueError(f"{key.title()} must be a non-empty string.")
        role = role.upper()
        if role not in ROLES:
            raise ValueError(f"{key.title()} must be one of the following values: {ROLES}")
        if role == ROLES[0] and Member.query.filter_by(role=ROLES[0]).first():
            raise ValueError(f"Only one member of an organization can be the owner.")
        return role