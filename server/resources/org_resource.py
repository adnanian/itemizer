from flask import request, g
from flask_restful import Resource
from config import db
from models.organization import Organization