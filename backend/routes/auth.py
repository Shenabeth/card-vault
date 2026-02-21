from flask import Blueprint, request, jsonify
from bson.objectid import ObjectId
from database import get_db
from auth import hash_password, verify_password, create_token
import logging

logger = logging.getLogger(__name__)
auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')


@auth_bp.route('/signup', methods=['POST'])
def signup():
    """Create a new user account"""
    try:
        data = request.get_json()
        
        # Validate input
        if not data.get('username') or not data.get('password'):
            return jsonify({'error': 'Username and password are required'}), 400
        
        if len(data['password']) < 6:
            return jsonify({'error': 'Password must be at least 6 characters'}), 400
        
        db = get_db()
        
        # Check if user already exists
        if db.users.find_one({'username': data['username']}):
            return jsonify({'error': 'Username already exists'}), 409
        
        # Hash password and create user
        hashed_password = hash_password(data['password'])
        
        user_doc = {
            'username': data['username'],
            'password': hashed_password,
            'is_demo': False,
            'created_at': ObjectId().generation_time,  # Use ObjectId generation time for consistency
        }
        
        result = db.users.insert_one(user_doc)
        user_id = str(result.inserted_id)
        
        # Create token
        token = create_token(user_id)
        
        logger.info(f"New user created: {data['username']}")
        
        return jsonify({
            'token': token,
            'user': {
                'id': user_id,
                'username': data['username']
            }
        }), 201
    
    except Exception as e:
        logger.error(f"Signup error: {str(e)}")
        return jsonify({'error': 'Signup failed'}), 500


@auth_bp.route('/login', methods=['POST'])
def login():
    """Log in an existing user"""
    try:
        data = request.get_json()
        
        # Validate input
        if not data.get('username') or not data.get('password'):
            return jsonify({'error': 'Username and password are required'}), 400
        
        db = get_db()
        user = db.users.find_one({'username': data['username']})
        
        if not user or not verify_password(data['password'], user['password']):
            return jsonify({'error': 'Invalid username or password'}), 401
        
        # Create token
        token = create_token(str(user['_id']))
        
        logger.info(f"User logged in: {data['username']}")
        
        return jsonify({
            'token': token,
            'user': {
                'id': str(user['_id']),
                'username': user['username']
            }
        }), 200
    
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        return jsonify({'error': 'Login failed'}), 500


@auth_bp.route('/me', methods=['GET'])
def get_current_user():
    """Get current authenticated user info"""
    try:
        # Get token from header
        token = None
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(' ')[1]
            except IndexError:
                return jsonify({'error': 'Invalid token format'}), 401
        
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        
        from auth import verify_token
        payload = verify_token(token)
        if payload is None:
            return jsonify({'error': 'Invalid or expired token'}), 401
        
        user_id = payload['user_id']
        db = get_db()
        user = db.users.find_one({'_id': ObjectId(user_id)})
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({
            'user': {
                'id': str(user['_id']),
                'username': user['username']
            }
        }), 200
    
    except Exception as e:
        logger.error(f"Get current user error: {str(e)}")
        return jsonify({'error': 'Failed to get user info'}), 500
