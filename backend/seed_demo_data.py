"""
Seed script to populate MongoDB with demo data.
Usage: python seed_demo_data.py
"""

from pymongo import MongoClient
from bson.objectid import ObjectId
from datetime import datetime
import sys
import logging
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# MongoDB connection
MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/card_vault')
DATABASE_NAME = os.getenv('DATABASE_NAME', 'card_vault')

def connect_db():
    """Connect to MongoDB"""
    try:
        # For development environments, disable SSL cert verification
        # In production, this should be removed for security
        client = MongoClient(
            MONGODB_URI, 
            serverSelectionTimeoutMS=5000,
            tlsAllowInvalidCertificates=True
        )
        client.admin.command('ping')
        logger.info(f"Connected to MongoDB: {DATABASE_NAME}")
        return client[DATABASE_NAME]
    except Exception as e:
        logger.error(f"Failed to connect to MongoDB: {str(e)}")
        sys.exit(1)


def seed_demo_data():
    """Seed demo data into the database"""
    db = connect_db()
    
    # Clear existing demo data
    demo_user = db.users.find_one({'username': 'demo'})
    if demo_user:
        logger.info("Clearing existing demo data...")
        demo_user_id = str(demo_user['_id'])
        db.cards.delete_many({'user_id': demo_user_id})
        db.binders.delete_many({'user_id': demo_user_id})
        db.users.delete_one({'_id': demo_user['_id']})
    
    # Create demo user
    from auth import hash_password
    hashed_password = hash_password('demo123')
    
    demo_user_doc = {
        'username': 'demo',
        'password': hashed_password,
        'is_demo': True,
        'created_at': datetime.utcnow(),
    }
    
    result = db.users.insert_one(demo_user_doc)
    demo_user_id = str(result.inserted_id)
    
    logger.info(f"Demo user created: {demo_user_id}")
    
    # Sample cards data
    demo_cards = [
        {
            'user_id': demo_user_id,
            'name': 'Charizard',
            'set': 'Base Set',
            'card_number': '4/102',
            'image_url': 'https://via.placeholder.com/300x400?text=Charizard',
            'is_graded': True,
            'grading': {
                'company': 'PSA',
                'grade': 9,
                'cert_number': 'PSA-12345678'
            },
            'condition': 'Near Mint',
            'purchase_price': 250,
            'estimated_value': 400,
            'quantity': 1,
            'notes': 'Iconic card from Base Set',
            'tags': ['Investment', 'Graded'],
            'created_at': datetime.utcnow().isoformat(),
            'updated_at': datetime.utcnow().isoformat(),
        },
        {
            'user_id': demo_user_id,
            'name': 'Blastoise',
            'set': 'Base Set',
            'card_number': '2/102',
            'image_url': 'https://via.placeholder.com/300x400?text=Blastoise',
            'is_graded': True,
            'grading': {
                'company': 'BGS',
                'grade': 8.5,
                'cert_number': 'BGS-87654321'
            },
            'condition': 'Excellent',
            'purchase_price': 150,
            'estimated_value': 280,
            'quantity': 1,
            'notes': 'Graded by BGS',
            'tags': ['Graded'],
            'created_at': datetime.utcnow().isoformat(),
            'updated_at': datetime.utcnow().isoformat(),
        },
        {
            'user_id': demo_user_id,
            'name': 'Venusaur',
            'set': 'Base Set',
            'card_number': '3/102',
            'image_url': 'https://via.placeholder.com/300x400?text=Venusaur',
            'is_graded': False,
            'grading': {},
            'condition': 'Good',
            'purchase_price': 50,
            'estimated_value': 120,
            'quantity': 1,
            'notes': 'Raw card in good condition',
            'tags': ['For Trade'],
            'created_at': datetime.utcnow().isoformat(),
            'updated_at': datetime.utcnow().isoformat(),
        },
        {
            'user_id': demo_user_id,
            'name': 'Arcanine',
            'set': 'Base Set',
            'card_number': '23/102',
            'image_url': 'https://via.placeholder.com/300x400?text=Arcanine',
            'is_graded': False,
            'grading': {},
            'condition': 'Mint',
            'purchase_price': 75,
            'estimated_value': 200,
            'quantity': 2,
            'notes': 'Beautiful condition',
            'tags': ['PC', 'Investment'],
            'created_at': datetime.utcnow().isoformat(),
            'updated_at': datetime.utcnow().isoformat(),
        },
        {
            'user_id': demo_user_id,
            'name': 'Machamp',
            'set': 'Base Set',
            'card_number': '25/102',
            'image_url': 'https://via.placeholder.com/300x400?text=Machamp',
            'is_graded': True,
            'grading': {
                'company': 'CGC',
                'grade': 8,
                'cert_number': 'CGC-11111111'
            },
            'condition': 'Excellent',
            'purchase_price': 80,
            'estimated_value': 180,
            'quantity': 1,
            'notes': 'Graded by CGC',
            'tags': ['Graded'],
            'created_at': datetime.utcnow().isoformat(),
            'updated_at': datetime.utcnow().isoformat(),
        },
        {
            'user_id': demo_user_id,
            'name': 'Pikachu',
            'set': 'Base Set',
            'card_number': '58/102',
            'image_url': 'https://via.placeholder.com/300x400?text=Pikachu',
            'is_graded': False,
            'grading': {},
            'condition': 'Near Mint',
            'purchase_price': 40,
            'estimated_value': 150,
            'quantity': 3,
            'notes': 'Multiple copies available',
            'tags': ['For Sale', 'PC'],
            'created_at': datetime.utcnow().isoformat(),
            'updated_at': datetime.utcnow().isoformat(),
        },
    ]
    
    cards_result = db.cards.insert_many(demo_cards)
    logger.info(f"Inserted {len(cards_result.inserted_ids)} demo cards")
    
    # Create demo binders with some cards placed
    demo_binders = [
        {
            'user_id': demo_user_id,
            'name': 'Base Set Master',
            'rows': 3,
            'columns': 3,
            'slots': [
                [str(cards_result.inserted_ids[0]), None, str(cards_result.inserted_ids[1])],
                [None, str(cards_result.inserted_ids[2]), None],
                [str(cards_result.inserted_ids[3]), None, str(cards_result.inserted_ids[4])],
            ],
            'created_at': datetime.utcnow().isoformat(),
            'updated_at': datetime.utcnow().isoformat(),
        },
        {
            'user_id': demo_user_id,
            'name': 'Favorites 4x4',
            'rows': 4,
            'columns': 4,
            'slots': [
                [str(cards_result.inserted_ids[4]), None, None, None],
                [None, str(cards_result.inserted_ids[5]), None, None],
                [None, None, str(cards_result.inserted_ids[0]), None],
                [None, None, None, None],
            ],
            'created_at': datetime.utcnow().isoformat(),
            'updated_at': datetime.utcnow().isoformat(),
        },
    ]
    
    binders_result = db.binders.insert_many(demo_binders)
    logger.info(f"Inserted {len(binders_result.inserted_ids)} demo binders")
    
    logger.info("\n" + "="*50)
    logger.info("✅ Demo data seeded successfully!")
    logger.info("="*50)
    logger.info(f"Demo User ID: {demo_user_id}")
    logger.info(f"Username: demo")
    logger.info(f"Password: demo123")
    logger.info("="*50)


if __name__ == '__main__':
    seed_demo_data()
