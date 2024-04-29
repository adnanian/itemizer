from flask import request, g
from flask_restful import Resource
from config import db
from models.membership import Membership

class MembershipResource(Resource):
    def get(self):
        memberships = [membership.to_dict() for membership in Membership.query.all()]
        return memberships, 200
    
    def post(self):
        try:
            new_membership = Membership(
                user_id=request.get_json().get('user_id'),
                organization_id=request.get_json().get('organization_id'),
                role=request.get_json().get('role')
            )
            db.session.add(new_membership)
            db.session.commit()
            return new_membership.to_dict(), 201
        except ValueError as e:
            print(e)
            return {'message': '422 Unprocessable Entity'}, 422
        
class MembershipById(Resource):
  def get(self, id):
    membership = g.record
    return membership.to_dict(), 200
  
  def patch(self, id):
    try:
      membership = g.record
      json = request.get_json()
      for attr in json:
        setattr(membership, attr, json.get(attr))
      db.session.add(membership)
      db.session.commit()
      return membership.to_dict(), 200
    except ValueError as e:
        print(e)
        return {'error': 'Not Modified'}, 304

  def delete(self, id):
    membership = g.record
    db.session.delete(membership)
    db.session.commit()
    return {'message': 'Membership successfully deleted.'}, 204