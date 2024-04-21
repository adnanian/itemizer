from flask import request, g
from flask_restful import Resource
from config import db
from models.models import User

class UserResource(Resource):
    def get(self):
        users = [user.to_dict() for user in User.query.all()]
        return users, 200
    
class UserById(Resource):
    def get(self, id):
        user = g.record
        return user.to_dict(), 200
    
    def patch(self, id):
        try:
            user = g.record
            json = request.get_json()
            for attr in json:
                setattr(user, attr, json.get(attr))
                db.session.add(user)
                db.session.commit()
                return user.to_dict(), 200
        except ValueError as e:
            return {'error': 'Not Modified'}, 304
        
    def delete(self, id):
        user = g.record
        db.session.delete(user)
        db.session.commit()
        return {'message': 'User successfully deleted.'}, 204