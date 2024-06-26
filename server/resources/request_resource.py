from flask import request
from resources.rest_resource_template import RestResourceTemplate
from config import db
from models.request import Request

class RequestResource(RestResourceTemplate):
    """Resource tied to the Request model. Handles fetch requests for all Request instances.

    Args:
        RestResourceTemplate (RestResourceTemplate): simplify RESTFul API building.
    """
  
    def __init__(self):
        super().__init__(Request)
    
    def post(self):
        """Creates a new instance of Request.

        Returns:
            dict: a JSONified dictionary of the created Request and its attributes, if creation successful, otherwise an error message.
        """ 
        try:
            new_request = Request(
                user_id=request.get_json().get('user_id'),
                organization_id=request.get_json().get('organization_id'),
                reason_to_join=request.get_json().get('reason_to_join')
            )
            db.session.add(new_request)
            db.session.commit()
            return new_request.to_dict(), 201
        except ValueError as e:
            print(e)
            return {'message': '422 Unprocessable Entity'}, 422
        
"""
    DO NOT CONFUSE requestObj with request
    requestObj is an instance of the model Request, where a user requests to join an organization.
    request is a Flask object that processes communications between client and server.
"""        
        
class RequestById(RestResourceTemplate):
    """Resource tied to the Request model. Handles fetch requests for single Request instances.

    Args:
        RestResourceTemplate (RestResourceTemplate): simplify RESTFul API building.
    """
  
    def __init__(self):
        super().__init__(Request)