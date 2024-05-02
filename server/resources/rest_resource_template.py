from flask import request, g
from flask_restful import Resource
from config import db

class RestResourceTemplate(Resource):
    SERIALIZE_RULES = "rules"
    SERIALIZE_ONLY = "only"
    
    def __init__(self, model):
        #super().__init__()
        self.model = model
        
    
    def get(self, id = None):        
        if id is int:
            record = g.record
            return record.to_dict(), 200
        else:
            records = [record.to_dict() for record in self.model.query.all()]
            return records, 200
    
    def patch(self, id):
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
        record = g.record
        db.session.delete(record)
        db.session.commit()
        return {'message': f'{self.model.__name__} successfully deleted.'}