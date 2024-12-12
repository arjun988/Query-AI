from flask import Blueprint, request, jsonify
from bson import ObjectId
from app import mongo  # Import mongo from the app initialization
from app.models import User, DatabaseConnection
from app.database_connector import DatabaseConnector
from app.ai_query_handler import AIQueryHandler
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

main_blueprint = Blueprint('main', __name__)
ai_query_handler = AIQueryHandler()

@main_blueprint.route('/auth/signup', methods=['POST'])
def signup():
    """
    User signup endpoint
    """
    data = request.json
    try:
        user = User.create_user(
            username=data['username'],
            email=data['email'], 
            password=data['password']
        )
        
        # Generate JWT token
        access_token = create_access_token(identity=str(user['_id']))
        
        return jsonify({
            'message': 'User created successfully',
            'access_token': access_token,
            'user_id': str(user['_id'])
        }), 201
    
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@main_blueprint.route('/auth/login', methods=['POST'])
def login():
    """
    User login endpoint
    """
    data = request.json
    user = User.authenticate(data['email'], data['password'])
    
    if user:
        access_token = create_access_token(identity=str(user['_id']))
        return jsonify({
            'message': 'Login successful',
            'access_token': access_token,
            'user_id': str(user['_id'])
        })
    
    return jsonify({'error': 'Invalid credentials'}), 401

@main_blueprint.route('/database/connect', methods=['POST'])
@jwt_required()
def connect_database():
    """
    Establish database connection
    """
    data = request.json
    user_id = get_jwt_identity()
    
    try:
        # Attempt to connect
        connector = DatabaseConnector(data)
        
        # Save connection details
        connection = DatabaseConnection.save_connection(
            user_id, 
            data['db_type'], 
            data
        )
        
        # Get available collections/tables
        available_collections = connector.get_available_collections()
        
        return jsonify({
            'message': 'Connected successfully',
            'available_collections': available_collections,
            'connection_id': str(connection['_id'])
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@main_blueprint.route('/query/execute', methods=['POST'])
@jwt_required()
def execute_query():
    """
    Execute database query with AI optimization
    """
    data = request.json
    user_id = get_jwt_identity()
    
    try:
        # Attempt to connect using saved connection
        connection_details = mongo.db.connections.find_one({
            'user_id': ObjectId(user_id),
            'db_type': data['db_type']
        })
        
        if not connection_details:
            return jsonify({'error': 'No active database connection'}), 400
        
        # Create connector
        connector = DatabaseConnector(connection_details['connection_details'])
        
        # Optimize query with AI
        optimized_query = ai_query_handler.optimize_query(
            data['query'], 
            data['db_type']
        )
        
        # Execute query
        results = connector.execute_query(
            optimized_query['optimized_query']
        )
        
        return jsonify({
            'results': results,
            'optimization_details': optimized_query
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    
@main_blueprint.route('/database/collections', methods=['GET'])
@jwt_required()
def get_available_collections():
    """
    Get available collections/tables for the connected database
    """
    user_id = get_jwt_identity()
    try:
        connection_details = mongo.db.connections.find_one({'user_id': ObjectId(user_id)})
        
        if not connection_details:
            return jsonify({'error': 'No active database connection'}), 400
        
        # Create connector
        connector = DatabaseConnector(connection_details['connection_details'])
        
        # Get available collections/tables
        available_collections = connector.get_available_collections()
        
        return jsonify({
            'available_collections': available_collections
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 400

