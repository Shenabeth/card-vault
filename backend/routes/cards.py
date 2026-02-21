from flask import Blueprint, request, jsonify
from bson.objectid import ObjectId
from datetime import datetime
from database import get_db
from auth import token_required
import logging

logger = logging.getLogger(__name__)
cards_bp = Blueprint('cards', __name__, url_prefix='/api/cards')


@cards_bp.route('', methods=['GET'])
@token_required
def get_cards():
    """Get all cards for the current user"""
    try:
        db = get_db()
        user_id = request.user_id
        
        # Query all cards for this user
        cards = list(db.cards.find({'user_id': user_id}))
        
        # Convert ObjectId to string for JSON serialization
        for card in cards:
            card['_id'] = str(card['_id'])
            card['user_id'] = str(card['user_id'])
        
        return jsonify({'cards': cards}), 200
    
    except Exception as e:
        logger.error(f"Get cards error: {str(e)}")
        return jsonify({'error': 'Failed to fetch cards'}), 500


@cards_bp.route('/<card_id>', methods=['GET'])
@token_required
def get_card(card_id):
    """Get a specific card by ID"""
    try:
        db = get_db()
        user_id = request.user_id
        
        try:
            card_oid = ObjectId(card_id)
        except:
            return jsonify({'error': 'Invalid card ID'}), 400
        
        card = db.cards.find_one({'_id': card_oid, 'user_id': user_id})
        
        if not card:
            return jsonify({'error': 'Card not found'}), 404
        
        card['_id'] = str(card['_id'])
        card['user_id'] = str(card['user_id'])
        
        return jsonify(card), 200
    
    except Exception as e:
        logger.error(f"Get card error: {str(e)}")
        return jsonify({'error': 'Failed to fetch card'}), 500


@cards_bp.route('', methods=['POST'])
@token_required
def create_card():
    """Create a new card"""
    try:
        db = get_db()
        user_id = request.user_id
        data = request.get_json()
        
        # Validate required fields
        if not data.get('name') or not data.get('set') or data.get('card_number') is None:
            return jsonify({'error': 'Name, set, and card_number are required'}), 400
        
        card_doc = {
            'user_id': user_id,
            'name': data.get('name'),
            'set': data.get('set'),
            'card_number': data.get('card_number'),
            'image_url': data.get('image_url', ''),
            'is_graded': data.get('is_graded', False),
            'grading': data.get('grading', {}),
            'condition': data.get('condition', 'Raw'),
            'purchase_price': data.get('purchase_price', 0),
            'estimated_value': data.get('estimated_value', 0),
            'quantity': data.get('quantity', 1),
            'notes': data.get('notes', ''),
            'tags': data.get('tags', []),
            'created_at': datetime.utcnow().isoformat(),
            'updated_at': datetime.utcnow().isoformat(),
        }
        
        result = db.cards.insert_one(card_doc)
        
        card_doc['_id'] = str(result.inserted_id)
        card_doc['user_id'] = str(card_doc['user_id'])
        
        logger.info(f"Card created: {data.get('name')} by user {user_id}")
        
        return jsonify(card_doc), 201
    
    except Exception as e:
        logger.error(f"Create card error: {str(e)}")
        return jsonify({'error': 'Failed to create card'}), 500


@cards_bp.route('/<card_id>', methods=['PUT'])
@token_required
def update_card(card_id):
    """Update a card"""
    try:
        db = get_db()
        user_id = request.user_id
        data = request.get_json()
        
        try:
            card_oid = ObjectId(card_id)
        except:
            return jsonify({'error': 'Invalid card ID'}), 400
        
        # Verify ownership
        card = db.cards.find_one({'_id': card_oid, 'user_id': user_id})
        if not card:
            return jsonify({'error': 'Card not found or unauthorized'}), 404
        
        # Build update document
        update_doc = {
            'updated_at': datetime.utcnow().isoformat(),
        }
        
        # Only update provided fields
        allowed_fields = ['name', 'set', 'card_number', 'image_url', 'is_graded', 
                         'grading', 'condition', 'purchase_price', 'estimated_value', 
                         'quantity', 'notes', 'tags']
        
        for field in allowed_fields:
            if field in data:
                update_doc[field] = data[field]
        
        db.cards.update_one({'_id': card_oid}, {'$set': update_doc})
        
        # Return updated card
        updated_card = db.cards.find_one({'_id': card_oid})
        updated_card['_id'] = str(updated_card['_id'])
        updated_card['user_id'] = str(updated_card['user_id'])
        
        logger.info(f"Card updated: {card_id} by user {user_id}")
        
        return jsonify(updated_card), 200
    
    except Exception as e:
        logger.error(f"Update card error: {str(e)}")
        return jsonify({'error': 'Failed to update card'}), 500


@cards_bp.route('/<card_id>', methods=['DELETE'])
@token_required
def delete_card(card_id):
    """Delete a card"""
    try:
        db = get_db()
        user_id = request.user_id
        
        try:
            card_oid = ObjectId(card_id)
        except:
            return jsonify({'error': 'Invalid card ID'}), 400
        
        # Verify ownership
        card = db.cards.find_one({'_id': card_oid, 'user_id': user_id})
        if not card:
            return jsonify({'error': 'Card not found or unauthorized'}), 404
        
        db.cards.delete_one({'_id': card_oid})
        
        logger.info(f"Card deleted: {card_id} by user {user_id}")
        
        return jsonify({'message': 'Card deleted successfully'}), 200
    
    except Exception as e:
        logger.error(f"Delete card error: {str(e)}")
        return jsonify({'error': 'Failed to delete card'}), 500
