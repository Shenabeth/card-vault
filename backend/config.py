import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    """Base configuration"""
    MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/card_vault')
    DATABASE_NAME = 'card_vault'
    
    # JWT Configuration
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'dev-secret-key-change-in-production')
    JWT_ACCESS_TOKEN_EXPIRES = 30 * 24 * 60 * 60  # 30 days
    
    # CORS
    CORS_ORIGINS = os.getenv('CORS_ORIGINS', 'http://localhost:5173,http://localhost:3000').split(',')


class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    TESTING = False


class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    TESTING = False


class TestingConfig(Config):
    """Testing configuration"""
    DEBUG = True
    TESTING = True
    MONGODB_URI = 'mongodb://localhost:27017/card_vault_test'


def get_config():
    env = os.getenv('FLASK_ENV', 'development')
    if env == 'production':
        return ProductionConfig()
    elif env == 'testing':
        return TestingConfig()
    return DevelopmentConfig()
