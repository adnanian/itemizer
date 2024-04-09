from flask import request, session
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError
from config import app, db, api
from models.models import *


  

@app.route('/api')
def index():
  return '<h1>Hi, I\'m John</h1>'

class Signup(Resource):
  
  def post(self):
    # Retrieve form inputs
    try:
      new_user = User(
        first_name=request.form.get('first_name'),
        last_name=request.form.get('last_name'),
        username=request.form.get('username'),
        email=request.form.get('email')
      )
      new_user.password_hash = request.form.get('password')
      db.session.add(new_user)
      db.session.commit()
      session['user_id'] = new_user.id
      return new_user.to_dict(), 201
    except (IntegrityError, ValueError) as e:
      print(e)
      return {'error': f'422 Unprocessable Entity:'}, 422
    
api.add_resource(Signup, '/api/signup')

if __name__ == "__main__":
  app.run(port=5555, debug=True)