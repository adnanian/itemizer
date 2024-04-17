from flask import request, g
from flask_restful import Resource
from config import db
from models.organization import Organization

class OrganizationResource(Resource):
    def get(self):
        orgs = [org.to_dict() for org in Organization.query.all()]
        return orgs, 200