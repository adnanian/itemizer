from flask import request, g
from flask_restful import Resource
from config import db
from models.models import Item

class ItemResource(Resource):
  def get(self):
    items = [item.to_dict() for item in Item.query.all()]
    return items, 200
  
  def post(self):
    try:
      new_item = Item(
        name=request.get_json().get('name'),
        description=request.get_json().get('description'),
        part_number=request.get_json().get('part_number'),
        image_url=request.get_json().get('image_url')
      )
      db.session.add(new_item)
      db.session.commit()
      return new_item.to_dict(), 201
    except ValueError as e:
      print(e)
      return {'message': '422 Unprocessable Entity'}, 422
    
class ItemById(Resource):
  def get(self, id):
    item = g.item
    return item.to_dict(), 200
  
  def patch(self, id):
    try:
      item = g.item
      json = request.get_json()
      for attr in json:
        setattr(item, attr, json.get(attr))
      db.session.add(item)
      db.session.commit()
      return item.to_dict(), 200
    except ValueError as e:
      return {'error': 'Not Modified'}, 304
    

  def delete(self, id):
    item = g.item
    db.session.delete(item)
    db.session.commit()
    return {'message': 'Item successfully deleted.'}, 204