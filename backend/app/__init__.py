from flask import Flask
from flask_cors import CORS
from flask_pymongo import PyMongo
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager  # Import JWTManager
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Initialize Flask extensions
mongo = PyMongo()
bcrypt = Bcrypt()

def create_app():
    app = Flask(__name__)
    
    # Configure app
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
    app.config['MONGO_URI'] = os.getenv('MONGO_URI')

    # Initialize extensions
    CORS(app)
    mongo.init_app(app)
    bcrypt.init_app(app)

    # Initialize JWTManager for handling JWT tokens
    jwt = JWTManager(app)
    
    # Import and register blueprints
    from .routes import main_blueprint
    app.register_blueprint(main_blueprint, url_prefix='/api')
    
    return app
