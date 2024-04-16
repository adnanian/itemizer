from flask import request, session
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError
from config import app, db, api
from models.models import *

@app.before_request
def check_if_logged_in():
  endpoint_whitelist = ['signup', 'login', 'check_session']
  print(request.endpoint)
  print (session.get('user_id'))
  if not (session.get('user_id') or request.endpoint in endpoint_whitelist):
    return {'error': 'Unauthorized'}, 401

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

api.add_resource(Signup, '/api/signup', endpoint='signup')
api.add_resource(Login, '/api/login', endpoint='login')
api.add_resource(Logout, '/api/logout', endpoint='logout')
api.add_resource(CheckSession, '/api/check_session', endpoint='check_session')

if __name__ == "__main__":
  app.run(port=5555, debug=True)