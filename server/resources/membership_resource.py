from flask import request, g
from resources.rest_resource_template import RestResourceTemplate
from config import db
from models.membership import Membership


class MembershipResource(RestResourceTemplate):

    def __init__(self):
        super().__init__(Membership)

    def post(self):
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

    def __init__(self):
        super().__init__(Membership)
