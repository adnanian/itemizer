from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.orm import validates
from config import db, bcrypt
from helpers import *
from models.membership import Membership

class User(db.Model, SerializerMixin):
    
    serialize_rules = (
        '-_password_hash',
        '-memberships.user',
        #'-memberships.organization',
        '-organizations.memberships',
        '-organizations.users',
        '-organizations.assignments',
        '-organizations.items'
    )
    
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String, nullable=False)
    last_name = db.Column(db.String, nullable=False)
    username = db.Column(db.String, nullable=False, unique=True)
    email = db.Column(db.String, nullable=False, unique=True)
    _password_hash = db.Column(db.String)
    created = db.Column(db.DateTime, server_default=db.func.now(), nullable=False)
    
    # Memberships
    memberships = db.relationship('Membership', back_populates='user', cascade='all, delete-orphan')
    
    # Organizations that a user is a part of
    organizations = association_proxy('memberships', 'organization', creator=lambda org_obj: Membership(organization=org_obj))
    
    @validates('first_name', 'last_name')
    def validate_name(self, key, name):
        if not is_non_empty_string(name):
            raise ValueError(f"{key.title()} must be a non-empty string.")
        return name
    
    @validates('username')
    def validate_username(self, key, username):
        if not(is_non_empty_string(username) and User.query.filter_by(username=username).first() is None):
            raise ValueError(f"{key.title()} must be a unique, non-empty string.")
        return username
        
    @validates('email')
    def validate_email(self, key, email):
        if ("@" not in email):
            raise ValueError(f"{key.title()} must be a valid email address.")
        elif User.query.filter_by(email=email).first():
            raise ValueError(f"An account with the {key}, {email}, already exists.")
        return email
    
    def __repr__(self):
        return f"<User {self.id}, {self.first_name}, {self.last_name}, {self.username}, {self.email}, {self.created}>"
    
    @hybrid_property
    def password_hash(self):
        raise AttributeError("Password hash cannot be viewed.")
    
    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(password.encode('utf-8'))
        self._password_hash = password_hash.decode('utf-8')
        
    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password.encode('utf-8'))