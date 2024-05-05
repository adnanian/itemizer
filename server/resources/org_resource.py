from flask import request, g
from resources.rest_resource_template import RestResourceTemplate
from flask_restful import Resource
from config import db
from models.organization import Organization

class OrganizationResource(Resource):
    """Resource tied to the Organization model. Handles fetch requests for all Organization instances.

    Args:
        RestResourceTemplate (RestResourceTemplate): simplify RESTFul API building.
    """
    def get(self):
        """Returns all organization instances.
        Serialized contents are: id, name, description, created, and
        the user_id, id, role, and username of memberships.

        Returns:
            list: a list of serialized organization objects.
        """
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
        """Creates a new instance of Organization.

        Returns:
            dict: a JSONified dictionary of the created Organization and its attributes, if creation successful, otherwise an error message.
        """
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


class OrganizationById(RestResourceTemplate):
    """Resource tied to the Organization model. Handles fetch requests for single Organization instances.

    Args:
        RestResourceTemplate (RestResourceTemplate): simplify RESTFul API building.
    """
    
    def __init__(self):
        super().__init__(Organization)
        
    def get(self, id):
        return super().get(id)
