from sqlalchemy_serializer import SerializerMixin
from config import db
from sqlalchemy.orm import validates
from helpers import *

class Assignment(db.Model, SerializerMixin):
    pass