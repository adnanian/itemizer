from flask import request, g
from flask_restful import Resource
from config import db
from models.assignment import Assignment

class AssignmentResource(Resource):
    def get(self):
        assignments = [assignment.to_dict() for assignment in Assignment.query.all()]
        return assignments, 200
    
    def post(self):
        pass
        # try:
        #     new_org = Assignment(
        #         name=request.get_json().get('name'),
        #         description=request.get_json().get('description')
        #     )
        #     db.session.add(new_org)
        #     db.session.commit()
        #     return new_org.to_dict(), 201
        # except ValueError as e:
        #     print(e)
        #     return {'message': '422 Unprocessable Entity'}, 422
        
class AssignmentById(Resource):
  def get(self, id):
    assignment = g.record
    return assignment.to_dict(), 200
  
  def patch(self, id):
    try:
      assignment = g.record
      json = request.get_json()
      for attr in json:
        setattr(assignment, attr, json.get(attr))
      db.session.add(assignment)
      db.session.commit()
      return assignment.to_dict(), 200
    except ValueError as e:
      return {'error': 'Not Modified'}, 304

  def delete(self, id):
    assignment = g.record
    db.session.delete(assignment)
    db.session.commit()
    return {'message': 'Assignment successfully deleted.'}, 204