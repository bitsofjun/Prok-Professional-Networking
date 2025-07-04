#!/usr/bin/env python3
"""
Setup script for Prok Professional Networking Backend
"""
import os
import sys

def setup_environment():
    """Setup environment variables for Flask CLI"""
    os.environ.setdefault('FLASK_APP', 'wsgi.py')
    os.environ.setdefault('FLASK_ENV', 'development')
    
    # Database configuration
    os.environ.setdefault('DB_USER', 'root')
    os.environ.setdefault('DB_PASSWORD', 'KK@123')
    os.environ.setdefault('DB_HOST', 'localhost')
    os.environ.setdefault('DB_NAME', 'prok_db')
    
    # Security keys
    os.environ.setdefault('SECRET_KEY', 'dev-secret-key-change-in-production')
    os.environ.setdefault('JWT_SECRET_KEY', 'jwt-secret-key-change-in-production')

if __name__ == '__main__':
    setup_environment()
    print("✅ Environment variables set up successfully!")
    print("You can now run:")
    print("  flask db init")
    print("  flask db migrate -m 'Initial migration'")
    print("  flask db upgrade")
    print("  flask run") 