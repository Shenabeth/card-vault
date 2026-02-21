from pymongo import MongoClient
from pymongo.errors import ServerSelectionTimeoutError
from config import get_config
import logging

logger = logging.getLogger(__name__)

config = get_config()
client = None
db = None


def connect_db():
    """Connect to MongoDB"""
    global client, db
    try:
        # For development environments, disable SSL cert verification
        # In production, this should be removed for security
        client = MongoClient(
            config.MONGODB_URI, 
            serverSelectionTimeoutMS=5000,
            tlsAllowInvalidCertificates=True
        )
        db = client[config.DATABASE_NAME]
        # Verify connection
        client.admin.command('ping')
        logger.info(f"Connected to MongoDB: {config.DATABASE_NAME}")
        return db
    except ServerSelectionTimeoutError:
        logger.error("Failed to connect to MongoDB. Make sure MongoDB is running.")
        raise


def get_db():
    """Get database instance"""
    if db is None:
        connect_db()
    return db


def close_db():
    """Close MongoDB connection"""
    global client
    if client:
        client.close()
        logger.info("MongoDB connection closed")


def create_indexes():
    """Create database indexes for better query performance"""
    db_instance = get_db()
    
    # Users collection indexes
    db_instance.users.create_index('username', unique=True)
    
    # Cards collection indexes - store user_id to support multi-tenant
    db_instance.cards.create_index('user_id')
    db_instance.cards.create_index([('user_id', 1), ('set', 1)])
    
    # Binders collection indexes
    db_instance.binders.create_index('user_id')
    db_instance.binders.create_index([('user_id', 1), ('created_at', -1)])
    
    logger.info("Database indexes created")
