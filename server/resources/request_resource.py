from flask import request, g
from flask_restful import Resource
from config import db
from models.request import Request

class RequestResource(Resource):
    def get(self):
        requests = [requestObj.to_dict() for requestObj in Request.query.all()]
        return requests, 200
    
    def post(self):
        pass
        # try:
        #     new_org = Request(
        #         item_id=request.get_json().get('item_id'),
        #         organization_id=request.get_json().get('organization_id'),
        #         count=request.get_json().get('count')
        #     )
        #     db.session.add(new_org)
        #     db.session.commit()
        #     return new_org.to_dict(), 201
        # except ValueError as e:
        #     print(e)
        #     return {'message': '422 Unprocessable Entity'}, 422
        
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