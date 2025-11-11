import os
from datetime import timedelta
from dotenv import load_dotenv
from pathlib import Path
env_path = Path(__file__).parent / ".env"

load_dotenv(dotenv_path=env_path)

class Config:
    # Database
    
    # SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'postgresql://keyopptta:Ra_sy6a7e2@localhost/lansia_db')
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Security
    SECRET_KEY = os.getenv('SECRET_KEY')
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SECURE = False  # Set to True in production with HTTPS
    PERMANENT_SESSION_LIFETIME = timedelta(hours=24)
    
    # Konfigurasi Gmail SMTP
    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USERNAME = os.getenv("MAIL_USERNAME")         # Email kamu
    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")          # App password dari Google
    MAIL_DEFAULT_SENDER = os.getenv("MAIL_USERNAME")
    
    # CORS
    CORS_ORIGINS = [os.getenv("FRONTEND_URL")]
    CORS_SUPPORTS_CREDENTIALS = True

class DevelopmentConfig(Config):
    DEBUG = True

class ProductionConfig(Config):
    DEBUG = False
    SESSION_COOKIE_SECURE = True

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
