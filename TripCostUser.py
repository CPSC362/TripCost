import sqlite3

class TripCostUser:
  
    def __init__(self, id, email):
        self.id = id
        self.email = email
    
    def is_authenticated(self):
        return True
    
    def is_active(self):
        return True
    
    def is_anonymous(self):
        return False
    
    def get_id(self):
        return unicode(self.id)
