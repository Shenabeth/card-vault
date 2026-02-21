from flask import Flask, jsonify
from flask_cors import CORS
from config import get_config
from database import connect_db, close_db, create_indexes
from routes.auth import auth_bp
from routes.cards import cards_bp
from routes.binders import binders_bp
import logging
import os

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

config = get_config()

# Create Flask app
app = Flask(__name__)
app.config.from_object(config)

# Enable CORS
CORS(app, origins=config.CORS_ORIGINS)

# Register blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(cards_bp)
app.register_blueprint(binders_bp)


@app.before_request
def before_request():
    """Connect to database before each request"""
    pass


@app.teardown_appcontext
def teardown_db(exception):
    """Close database connection after each request"""
    pass


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'ok', 'message': 'Card Vault API is running'}), 200


@app.route('/', methods=['GET'])
def index():
    """API documentation"""
    return jsonify({
        'app': 'Card Vault API',
        'version': '1.0.0',
        'endpoints': {
            'auth': '/api/auth',
            'cards': '/api/cards',
            'binders': '/api/binders',
            'health': '/api/health'
        }
    }), 200


@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404


@app.errorhandler(500)
def internal_error(error):
    logger.error(f"Internal error: {str(error)}")
    return jsonify({'error': 'Internal server error'}), 500


if __name__ == '__main__':
    # Connect to databases on startup
    try:
        connect_db()
        create_indexes()
        logger.info("Database connection established and indexes created")
    except Exception as e:
        logger.error(f"Failed to connect to database: {str(e)}")
        exit(1)
    
    # Run the app
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('FLASK_ENV') == 'development'
    app.run(host='0.0.0.0', port=port, debug=debug)
