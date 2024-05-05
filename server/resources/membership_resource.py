from flask import request, g
from resources.rest_resource_template import RestResourceTemplate
from config import db
from models.membership import Membership

class MembershipResource(RestResourceTemplate):
    """Resource tied to the Membership model. Handles fetch requests for all Membership instances.

    Args:
        RestResourceTemplate (RestResourceTemplate): simplify RESTFul API building.
    """

    def __init__(self):
        super().__init__(Membership)

    def post(self):
        """Creates a new instance of Membership.

        Returns:
            dict: a JSONified dictionary of the created Membership and its attributes, if creation successful, otherwise an error message.
        """
        try:
            new_membership = Membership(
                user_id=request.get_json().get("user_id"),
                organization_id=request.get_json().get("organization_id"),
                role=request.get_json().get("role"),
            )
            db.session.add(new_membership)
            db.session.commit()
            return new_membership.to_dict(), 201
        except ValueError as e:
            print(e)
            return {"message": "422 Unprocessable Entity"}, 422


class MembershipById(RestResourceTemplate):
    """Resource tied to the Membership model. Handles fetch requests for single Membership instances.

    Args:
        RestResourceTemplate (RestResourceTemplate): simplify RESTFul API building.
    """

    def __init__(self):
        super().__init__(Membership)
