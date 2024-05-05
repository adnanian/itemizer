from flask import request, g
from resources.rest_resource_template import RestResourceTemplate
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError
from config import db
from models.models import Item

class ItemResource(RestResourceTemplate):
    """Resource tied to the Item model. Handles fetch requests for all Item instances.

    Args:
        RestResourceTemplate (RestResourceTemplate): simplify RESTFul API building.
    """

    def __init__(self):
        super().__init__(Item)

    def post(self):
        """Creates a new instance of Item.

          Returns:
              dict: a JSONified dictionary of the created Item and its attributes, if creation successful, otherwise an error message.
        """
        try:
            new_item = Item(
                name=request.get_json().get("name"),
                description=request.get_json().get("description"),
                part_number=request.get_json().get("part_number"),
                image_url=request.get_json().get("image_url"),
            )
            db.session.add(new_item)
            db.session.commit()
            return new_item.to_dict(), 201
        except (ValueError, IntegrityError) as e:
            print(e)
            return {"message": str(e)}, 422


class ItemById(RestResourceTemplate):
    """Resource tied to the Item model. Handles fetch requests for single Item instances.

      Args:
          RestResourceTemplate (RestResourceTemplate): simplify RESTFul API building.
    """

    def __init__(self):
        super().__init__(Item)


class ItemByNameOrPartNo(Resource):
    """Resource tied to the Item model. Handles fetch requests for single Item instances,
    except that records are retrieved by part number instead of by id.

    Args:
        RestResourceTemplate (RestResourceTemplate): simplify RESTFul API building.
    """
  
    def get(self, item_name):
        if item := Item.query.filter(
            db.or_(Item.name == item_name, Item.part_number == item_name)
        ).first():
            return item.to_dict(), 200
        return {"error": "404 Not Found"}, 404
