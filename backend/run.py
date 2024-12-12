import os
from app import create_app
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Create Flask app
app = create_app()

# Configure JWT
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
jwt = JWTManager(app)

# Add additional configuration
app.config['DEBUG'] = os.getenv('FLASK_ENV') == 'development'

# Optional: Additional app configuration
def configure_app(app):
    """
    Additional app configuration and extensions
    """
    # Example: Configure logging
    import logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    app.logger.info('Application starting...')

    # Optional: Add error handlers
    @app.errorhandler(404)
    def not_found_error(error):
        return {'error': 'Not Found'}, 404

    @app.errorhandler(500)
    def internal_error(error):
        app.logger.error(f'Server Error: {error}')
        return {'error': 'Internal Server Error'}, 500

# Configure the app
configure_app(app)

# Run the application
if __name__ == '__main__':
    # Determine port from environment or use default
    port = int(os.getenv('PORT', 5000))
    
    # Run with different settings based on environment
    if os.getenv('FLASK_ENV') == 'production':
        # In production, use gunicorn or another WSGI server
        app.logger.info(f'Starting production server on port {port}')
        
    else:
        # Development server
        app.logger.info(f'Starting development server on port {port}')
        app.run(
            host='0.0.0.0', 
            port=port, 
            debug=True
        )