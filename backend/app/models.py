from app import mongo, bcrypt
from bson import ObjectId
from datetime import datetime

class User:
    @staticmethod
    def create_user(username, email, password):
        """
        Create a new user in the database
        
        Args:
            username (str): User's username
            email (str): User's email
            password (str): User's password
        
        Returns:
            dict: Created user document
        """
        # Hash the password
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        
        # Prepare user document
        user_doc = {
            'username': username,
            'email': email,
            'password': hashed_password,
            'created_at': datetime.utcnow(),
            'last_login': None,
            'connection_history': []
        }
        
        # Insert user and return
        result = mongo.db.users.insert_one(user_doc)
        return mongo.db.users.find_one({'_id': result.inserted_id})
    
    @staticmethod
    def authenticate(email, password):
        """
        Authenticate user credentials
        
        Args:
            email (str): User's email
            password (str): User's password
        
        Returns:
            dict or None: User document if authenticated
        """
        user = mongo.db.users.find_one({'email': email})
        
        if user and bcrypt.check_password_hash(user['password'], password):
            # Update last login
            mongo.db.users.update_one(
                {'_id': user['_id']}, 
                {'$set': {'last_login': datetime.utcnow()}}
            )
            return user
        
        return None

class DatabaseConnection:
    @staticmethod
    def save_connection(user_id, db_type, connection_details):
        """
        Save database connection details
        
        Args:
            user_id (str): User's ID
            db_type (str): Database type (MySQL/MongoDB)
            connection_details (dict): Connection parameters
        
        Returns:
            dict: Saved connection document
        """
        connection_doc = {
            'user_id': ObjectId(user_id),
            'db_type': db_type,
            'connection_details': connection_details,
            'created_at': datetime.utcnow()
        }
        
        result = mongo.db.connections.insert_one(connection_doc)
        return mongo.db.connections.find_one({'_id': result.inserted_id})