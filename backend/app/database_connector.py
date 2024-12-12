import mysql.connector
from pymongo import MongoClient
import re
import sqlparse
import json
from bson import json_util

class QueryValidator:
    @staticmethod
    def validate_mysql_query(query):
        """
        Validate MySQL query for safety and basic structure
        
        Args:
            query (str): SQL query to validate
        
        Returns:
            bool: Whether query is valid
        """
        # Prevent dangerous operations
        dangerous_patterns = [
            r'\bDROP\b',
            r'\bDELETE\b',
            r'\bTRUNCATE\b',
            r'\bALTER\b',
            r'--',  # Comments
            r';',   # Multiple statements
        ]
        
        for pattern in dangerous_patterns:
            if re.search(pattern, query, re.IGNORECASE):
                return False
        
        # Use sqlparse to check query structure
        try:
            parsed = sqlparse.parse(query)[0]
            return parsed.tokens[0].ttype in ['SELECT']
        except Exception:
            return False
    
    @staticmethod
    def validate_mongodb_query(query):
        """
        Validate MongoDB query
        
        Args:
            query (dict): MongoDB query dictionary
        
        Returns:
            bool: Whether query is valid
        """
        # Prevent dangerous MongoDB operations
        dangerous_keys = ['$where', '$eval', '$function']
        
        def check_query_safety(q):
            if isinstance(q, dict):
                for key, value in q.items():
                    if key in dangerous_keys:
                        return False
                    if isinstance(value, (dict, list)):
                        if not check_query_safety(value):
                            return False
            elif isinstance(q, list):
                return all(check_query_safety(item) for item in q)
            return True
        
        return check_query_safety(query)

class DatabaseConnector:
    def __init__(self, connection_params):
        """
        Initialize database connection
        
        Args:
            connection_params (dict): Connection parameters
        """
        self.db_type = connection_params.get('db_type')
        self.connection = None
        
        if self.db_type == 'mysql':
            self.connection = mysql.connector.connect(
                host=connection_params['host'],
                user=connection_params['username'],
                password=connection_params['password'],
                database=connection_params['database']
            )
        elif self.db_type == 'mongodb':
            username = connection_params.get('username')
            password = connection_params.get('password')
            host = connection_params['host']
            port = connection_params['port']
            database = connection_params['database']
            
            if username and password:
                # If username and password are provided
                self.connection = MongoClient(
                    f"mongodb://{username}:{password}@{host}:{port}/{database}"
                )[database]
            else:
                # If username or password is missing, connect without authentication
                self.connection = MongoClient(
                    f"mongodb://{host}:{port}/{database}"
                )[database]
    
    def execute_query(self, query):
        """
        Execute query with validation
        
        Args:
            query (str or dict): Query to execute
        
        Returns:
            list: Query results
        """
        try:
            if self.db_type == 'mysql':
                # Validate MySQL query
                if not QueryValidator.validate_mysql_query(query):
                    raise ValueError("Invalid or unsafe MySQL query")
                
                cursor = self.connection.cursor(dictionary=True)
                cursor.execute(query)
                results = cursor.fetchall()
                cursor.close()
                
                return results
            
            elif self.db_type == 'mongodb':
                # Validate MongoDB query
                if not QueryValidator.validate_mongodb_query(query):
                    raise ValueError("Invalid or unsafe MongoDB query")
                
                # Parse and execute MongoDB query
                collection_name = query.get('collection')
                filter_params = query.get('filter', {})
                
                collection = self.connection[collection_name]
                results = list(collection.find(filter_params))
                
                # Convert BSON to JSON for serialization
                return json.loads(json_util.dumps(results))
        
        except Exception as e:
            # Log the error
            print(f"Query execution error: {str(e)}")
            raise
    
    def get_available_collections(self):
        """
        Get available collections/tables
        
        Returns:
            list: Collection or table names
        """
        if self.db_type == 'mysql':
            cursor = self.connection.cursor()
            cursor.execute("SHOW TABLES")
            return [table[0] for table in cursor.fetchall()]
        
        elif self.db_type == 'mongodb':
            return self.connection.list_collection_names()
