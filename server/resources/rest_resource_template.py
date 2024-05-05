from flask import request, g
from flask_restful import Resource
from config import db

class RestResourceTemplate(Resource):
    """_summary_

    Args:
        Resource (_type_): _description_
    """
    
    def __init__(self, model):
        """Creates a new instance of RestResourceTemplate.

        Args:
            model (db.Model): the model to tie the resource to.
        """
        self.model = model
        
    
    def get(self, id = None):
        """
        If an id is specified, then retrieves a db.Model record with that id if it exists.
        If the record with that id does not exist, then returns a message saying "not found".
        Otherwise, returns all records.
        """   
        if type(id) is int:
            record = g.record
            return record.to_dict(), 200
        else:
            records = [record.to_dict() for record in self.model.query.all()]
            return records, 200
    
    def patch(self, id):
        """Updates a db.Model record with a given id.

        Args:
            id (int): the id.

        Returns:
            dict: a JSONified dictionary of the record if successfully updated; if update failed, then will
            return a "Not Modified" message. If record with id, does not exist, a "Not Found" will be returned.
        """
        try:
            record = g.record
            json = request.get_json()
            for attr in json:
                setattr(record, attr, json.get(attr))
            db.session.add(record)
            db.session.commit()
            return record.to_dict(), 200
        except ValueError as e:
            print(e)
            return {'error': 'Not Modified'}, 304
        
    def delete(self, id):
        """Deletes a db.Model record with a given id.

        Args:
            id (int): the id.

        Returns:
            dict: no content or a message saying that the record was deleted.
        """
        record = g.record
        db.session.delete(record)
        db.session.commit()
        return {'message': f'{self.model.__name__} successfully deleted.'}