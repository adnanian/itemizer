from flask import request, g
from resources.rest_resource_template import RestResourceTemplate
from config import db
from models.assignment import Assignment

class AssignmentResource(RestResourceTemplate):
    """Resource tied to the Assignment model. Handles fetch requests for all Assignment instances.

    Args:
        RestResourceTemplate (RestResourceTemplate): simplify RESTFul API building.
    """
    
    def __init__(self):
        super().__init__(Assignment)

    def post(self):
        """Creates a new instance of Assignment.

        Returns:
            dict: a JSONified dictionary of the created assignment and its attributes, if creation successful, otherwise an error message.
        """
        try:
            new_org = Assignment(
                item_id=request.get_json().get("item_id"),
                organization_id=request.get_json().get("organization_id"),
                count=request.get_json().get("count"),
            )
            db.session.add(new_org)
            db.session.commit()
            return new_org.to_dict(), 201
        except ValueError as e:
            print(e)
            return {"message": "422 Unprocessable Entity"}, 422


class AssignmentById(RestResourceTemplate):
    """Resource tied to the Assignment model. Handles fetch requests for single Assignment instances.

    Args:
        RestResourceTemplate (RestResourceTemplate): simplify RESTFul API building.
    """
    
    def __init__(self):
        super().__init__(Assignment)