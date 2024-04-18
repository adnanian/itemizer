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
    
    user = db.relationship('User', back_populates='members')
    organization = db.relationship('Organization', back_populates='members')
    
    __table_args__ = (
        db.CheckConstraint('(role == "OWNER") or (role == "ADMIN") or (role == "REGULAR")', name='check_role_constraint'),
    )
    
    def __repr__(self):
        return f"<Member {self.id}, {self.user_id}, {self.organization_id}, {self.role}, {self.joined}"
    
    @validates('role')
    def validate_role(self, key, role):
        if Member.query.filter(Member.user_id == self.user_id, Member.organization_id == self.organization_id).first():
            raise ValueError(f"User {self.user_id} already belongs to organization {self.organization_id}.")
        if not is_non_empty_string(role):
             raise ValueError(f"{key.title()} must be a non-empty string.")
        role = role.upper()
        print(role, self.organization_id)
        if role not in ROLES:
            raise ValueError(f"{key.title()} must be one of the following values: {ROLES}")
        if role == ROLES[0] and Member.query.filter(Member.organization_id==self.organization_id, Member.role==ROLES[0]).first():
            raise ValueError(f"Only one member of an organization can be the owner.")
        if (not Member.query.filter(Member.organization_id==self.organization_id).first()) and (role != ROLES[0]):
            raise ValueError(f"{key.title()} must be owner for the first member.")
        return role