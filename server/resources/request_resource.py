from flask import request, g
from flask_restful import Resource
from config import db
from models.request import Request

class RequestResource(Resource):
    def get(self):
        requests = [requestObj.to_dict() for requestObj in Request.query.all()]
        return requests, 200
    
    def post(self): 
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
        
class RequestById(Resource):
  def get(self, id):
    requestObj = g.record
    return requestObj.to_dict(), 200
  
  def patch(self, id):
    try:
      requestObj = g.record
      json = request.get_json()
      for attr in json:
        setattr(requestObj, attr, json.get(attr))
      db.session.add(requestObj)
      db.session.commit()
      return requestObj.to_dict(), 200
    except ValueError as e:
      return {'error': 'Not Modified'}, 304

  def delete(self, id):
    request = g.record
    db.session.delete(request)
    db.session.commit()
    return {'message': 'Request successfully deleted.'}, 204