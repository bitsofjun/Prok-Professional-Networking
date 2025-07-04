#!/usr/bin/env python3
"""
Simple entry point for Flask CLI
"""
from app import create_app

app = create_app()

# Import models inside app context
with app.app_context():
    from models.user import User

if __name__ == '__main__':
    app.run(debug=True) 