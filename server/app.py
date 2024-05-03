from flask import request, session, g
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError
from config import app, db, api
from models.models import *
from resources.resources import *

@app.before_request
def check_if_logged_in():
  endpoint_whitelist = ['signup', 'login', 'check_session']
  #endpoints_for_postman = ['signup', 'login', 'check_session', 'items', 'item_by_id', 'organizations', 'organization_by_id','users', 'user_by_id', 'requests', 'request_by_id', 'membership_by_id']
  #print(request.endpoint)
  #print (session.get('user_id'))
  if not (session.get('user_id') or request.endpoint in endpoint_whitelist):
    return {'error': 'Unauthorized'}, 401
    
@app.before_request
def get_record_by_id():
  endpoint_model_map = {
    'user_by_id': User,
    'item_by_id': Item,
    'organization_by_id': Organization,
    'membership_by_id': Membership,
    'assignment_by_id': Assignment,
    'request_by_id': Request
  }
  if model := endpoint_model_map.get(request.endpoint):
    id = request.view_args.get('id')
    if record := model.query.filter_by(id=id).first():
      g.record = record
    else:
      return {'error': f'{model.__name__} record of id, {id}, does not exist. Please try again later.'}, 404
  #print(request.endpoint)
  

class Signup(Resource):
  
  def post(self):
    # Retrieve form inputs
    try:
      new_user = User(
        first_name=request.get_json().get('first_name'),
        last_name=request.get_json().get('last_name'),
        username=request.get_json().get('username'),
        email=request.get_json().get('email')
      )
      new_user.password_hash = request.get_json().get('password')
      db.session.add(new_user)
      db.session.commit()
      session['user_id'] = new_user.id
      return new_user.to_dict(), 201
    except (IntegrityError, ValueError) as e:
      print(e)
      return {'message': str(e)}, 422

class Login(Resource):
  def post(self):
    login_name = request.get_json().get('username_or_email')
    print(login_name)
    if login_name:
      user = User.query.filter_by(username=login_name).first() or User.query.filter_by(email=login_name).first()
      if user and user.authenticate(request.get_json().get('password')):
        print(user)
        session['user_id'] = user.id
        return user.to_dict(), 200
    return {'message': '401 Unauthorized'}, 401
  
class Logout(Resource):
  def delete(self):
    print("About to log out.")
    session['user_id'] = None
    print("Logging out")
    return {}, 204
  
class CheckSession(Resource):
  def get(self):
    if user := User.query.filter_by(id=session.get('user_id')).first():
      return user.to_dict(), 200
    return {'message': '401 Unauthorized'}, 401
  
class Authenticate(Resource):
  """
      This resource is dedicated for handling changes in user information
      or account deletion altogether.
  Args:
      Resource (_type_): _description_
  """
  def post(self):
    user = User.query.filter_by(id=session.get('user_id')).first()
    if user and user.authenticate(request.get_json().get('password')):
      return {}, 204
    return {'message': '401 Unauthorized'}, 401

api.add_resource(Signup, '/api/signup', endpoint='signup')
api.add_resource(Login, '/api/login', endpoint='login')
api.add_resource(Logout, '/api/logout', endpoint='logout')
api.add_resource(CheckSession, '/api/check_session', endpoint='check_session')
api.add_resource(Authenticate, '/api/authenticate', endpoint='authenticate')
api.add_resource(UserResource, '/api/users', endpoint='users')
api.add_resource(UserById, '/api/users/<int:id>', endpoint='user_by_id')
api.add_resource(ItemResource, '/api/items', endpoint='items')
api.add_resource(ItemById, '/api/items/<int:id>', endpoint='item_by_id')
api.add_resource(ItemByNameOrPartNo, '/api/items/<string:item_name>', endpoint='item_by_name_or_part_no')
api.add_resource(OrganizationResource, '/api/organizations', endpoint='organizations')
api.add_resource(OrganizationById, '/api/organizations/<int:id>', endpoint='organization_by_id')
api.add_resource(MembershipResource, '/api/memberships', endpoint='membership')
api.add_resource(MembershipById, '/api/memberships/<int:id>', endpoint='membership_by_id')
api.add_resource(AssignmentResource, '/api/assignments', endpoint='assignments')
api.add_resource(AssignmentById, '/api/assignments/<int:id>', endpoint='assignment_by_id')
api.add_resource(RequestResource, '/api/requests', endpoint='requests')
api.add_resource(RequestById, '/api/requests/<int:id>', endpoint='request_by_id')


if __name__ == "__main__":
  app.run(port=5555, debug=True)