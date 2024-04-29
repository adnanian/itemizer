from flask import request, g
from flask_restful import Resource
from config import db
from models.organization import Organization


class OrganizationResource(Resource):
    def get(self):
        orgs = [
            org.to_dict(only=(
              'id',
              'name',
              'description',
              'created',
              'memberships.user_id',
              'memberships.id',
              'memberships.role',
              'memberships.user.username'
            ))
            for org in Organization.query.all()
        ]
        return orgs, 200

    def post(self):
        try:
            new_org = Organization(
                name=request.get_json().get("name"),
                description=request.get_json().get("description"),
            )
            db.session.add(new_org)
            db.session.commit()
            return new_org.to_dict(), 201
        except ValueError as e:
            print(e)
            return {"message": "422 Unprocessable Entity"}, 422


class OrganizationById(Resource):
    def get(self, id):
        organization = g.record
        return organization.to_dict(), 200

    def patch(self, id):
        try:
            organization = g.record
            json = request.get_json()
            for attr in json:
                setattr(organization, attr, json.get(attr))
            db.session.add(organization)
            db.session.commit()
            return organization.to_dict(), 200
        except ValueError as e:
            return {"error": "Not Modified"}, 304

    def delete(self, id):
        organization = g.record
        db.session.delete(organization)
        db.session.commit()
        return {"message": "Organization successfully deleted."}, 204
