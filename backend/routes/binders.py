from flask import Blueprint, request, jsonify
from bson.objectid import ObjectId
from datetime import datetime
from database import get_db
from auth import token_required
import logging

logger = logging.getLogger(__name__)
binders_bp = Blueprint('binders', __name__, url_prefix='/api/binders')


@binders_bp.route('', methods=['GET'])
@token_required
def get_binders():
    """Get all binders for the current user"""
    try:
        db = get_db()
        user_id = request.user_id
        
        # Query all binders for this user
        binders = list(db.binders.find({'user_id': user_id}).sort('created_at', -1))
        
        # Convert ObjectId to string for JSON serialization
        for binder in binders:
            binder['_id'] = str(binder['_id'])
            binder['user_id'] = str(binder['user_id'])
        
        return jsonify({'binders': binders}), 200
    
    except Exception as e:
        logger.error(f"Get binders error: {str(e)}")
        return jsonify({'error': 'Failed to fetch binders'}), 500


@binders_bp.route('/<binder_id>', methods=['GET'])
@token_required
def get_binder(binder_id):
    """Get a specific binder by ID"""
    try:
        db = get_db()
        user_id = request.user_id
        
        try:
            binder_oid = ObjectId(binder_id)
        except:
            return jsonify({'error': 'Invalid binder ID'}), 400
        
        binder = db.binders.find_one({'_id': binder_oid, 'user_id': user_id})
        
        if not binder:
            return jsonify({'error': 'Binder not found'}), 404
        
        binder['_id'] = str(binder['_id'])
        binder['user_id'] = str(binder['user_id'])
        
        return jsonify(binder), 200
    
    except Exception as e:
        logger.error(f"Get binder error: {str(e)}")
        return jsonify({'error': 'Failed to fetch binder'}), 500


@binders_bp.route('', methods=['POST'])
@token_required
def create_binder():
    """Create a new binder"""
    try:
        db = get_db()
        user_id = request.user_id
        data = request.get_json()
        
        # Validate required fields
        if not data.get('name') or not data.get('rows') or not data.get('columns'):
            return jsonify({'error': 'Name, rows, and columns are required'}), 400
        
        # Initialize empty slots
        rows = int(data['rows'])
        columns = int(data['columns'])
        slots = [[None for _ in range(columns)] for _ in range(rows)]
        
        binder_doc = {
            'user_id': user_id,
            'name': data.get('name'),
            'rows': rows,
            'columns': columns,
            'slots': slots,
            'created_at': datetime.utcnow().isoformat(),
            'updated_at': datetime.utcnow().isoformat(),
        }
        
        result = db.binders.insert_one(binder_doc)
        
        binder_doc['_id'] = str(result.inserted_id)
        binder_doc['user_id'] = str(binder_doc['user_id'])
        
        logger.info(f"Binder created: {data.get('name')} by user {user_id}")
        
        return jsonify(binder_doc), 201
    
    except Exception as e:
        logger.error(f"Create binder error: {str(e)}")
        return jsonify({'error': 'Failed to create binder'}), 500


@binders_bp.route('/<binder_id>', methods=['PUT'])
@token_required
def update_binder(binder_id):
    """Update a binder"""
    try:
        db = get_db()
        user_id = request.user_id
        data = request.get_json()
        
        try:
            binder_oid = ObjectId(binder_id)
        except:
            return jsonify({'error': 'Invalid binder ID'}), 400
        
        # Verify ownership
        binder = db.binders.find_one({'_id': binder_oid, 'user_id': user_id})
        if not binder:
            return jsonify({'error': 'Binder not found or unauthorized'}), 404
        
        # Build update document
        update_doc = {
            'updated_at': datetime.utcnow().isoformat(),
        }
        
        # Only update provided fields
        allowed_fields = ['name', 'rows', 'columns', 'slots']
        
        for field in allowed_fields:
            if field in data:
                update_doc[field] = data[field]
        
        db.binders.update_one({'_id': binder_oid}, {'$set': update_doc})
        
        # Return updated binder
        updated_binder = db.binders.find_one({'_id': binder_oid})
        updated_binder['_id'] = str(updated_binder['_id'])
        updated_binder['user_id'] = str(updated_binder['user_id'])
        
        logger.info(f"Binder updated: {binder_id} by user {user_id}")
        
        return jsonify(updated_binder), 200
    
    except Exception as e:
        logger.error(f"Update binder error: {str(e)}")
        return jsonify({'error': 'Failed to update binder'}), 500


@binders_bp.route('/<binder_id>', methods=['DELETE'])
@token_required
def delete_binder(binder_id):
    """Delete a binder"""
    try:
        db = get_db()
        user_id = request.user_id
        
        try:
            binder_oid = ObjectId(binder_id)
        except:
            return jsonify({'error': 'Invalid binder ID'}), 400
        
        # Verify ownership
        binder = db.binders.find_one({'_id': binder_oid, 'user_id': user_id})
        if not binder:
            return jsonify({'error': 'Binder not found or unauthorized'}), 404
        
        db.binders.delete_one({'_id': binder_oid})
        
        logger.info(f"Binder deleted: {binder_id} by user {user_id}")
        
        return jsonify({'message': 'Binder deleted successfully'}), 200
    
    except Exception as e:
        logger.error(f"Delete binder error: {str(e)}")
        return jsonify({'error': 'Failed to delete binder'}), 500
