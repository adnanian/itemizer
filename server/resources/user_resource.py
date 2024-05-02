from flask import request, g
from flask_restful import Resource
from resources.rest_resource_template import RestResourceTemplate
from config import db
from models.models import User

class UserResource(RestResourceTemplate):
    
    def __init__(self):
        super().__init__(User)
    
class UserById(RestResourceTemplate):
    
    def __init__(self):
        super().__init__(User)
    
    def patch(self, id):
        try:
            user = g.record
            json = request.get_json()
            for attr in json:
                value = json.get(attr)
                print(f"{attr} - {value}")
                if (attr == 'new_password' and value != ""):
                    user.password_hash = value
                    print("New password set.")
                else:
                    if (getattr(user, attr) != value):
                        setattr(user, attr, value)
            db.session.add(user)
            db.session.commit()
            return user.to_dict(), 200
        except ValueError as e:
            print(e)
            return {'error': 'Not Modified'}, 304