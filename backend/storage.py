# In-memory storage for testing when MongoDB is not available
class InMemoryStorage:
    def __init__(self):
        self.employees = {}
        self.attendance = {}
        self.next_id = 1
    
    def get_next_id(self):
        current_id = self.next_id
        self.next_id += 1
        return str(current_id)

# Global instance
storage = InMemoryStorage()