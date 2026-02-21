import bcrypt
from datetime import datetime, timedelta
import jwt
from config import get_config
from functools import wraps
from flask import request, jsonify
from bson.objectid import ObjectId

config = get_config()


def hash_password(password: str) -> str:
    """Hash password using bcrypt"""
    salt = bcrypt.gensalt(rounds=12)
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')


def verify_password(password: str, hashed_password: str) -> bool:
    """Verify password against hashed password"""
    return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))


def create_token(user_id: str) -> str:
    """Create JWT token for user"""
    payload = {
        'user_id': str(user_id),
        'iat': datetime.utcnow(),
        'exp': datetime.utcnow() + timedelta(seconds=config.JWT_ACCESS_TOKEN_EXPIRES)
    }
    return jwt.encode(payload, config.JWT_SECRET_KEY, algorithm='HS256')


def verify_token(token: str) -> dict:
    """Verify JWT token and return payload"""
    try:
        payload = jwt.decode(token, config.JWT_SECRET_KEY, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


def token_required(f):
    """Decorator to protect routes that require authentication"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = None
        
        # Get token from Authorization header
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(' ')[1]
            except IndexError:
                return jsonify({'error': 'Invalid token format'}), 401
        
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        
        payload = verify_token(token)
        if payload is None:
            return jsonify({'error': 'Invalid or expired token'}), 401
        
        # Store user_id in request context
        request.user_id = payload['user_id']
        return f(*args, **kwargs)
    
    return decorated_function
