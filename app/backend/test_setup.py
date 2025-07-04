#!/usr/bin/env python3
"""
Test script to verify backend setup
"""
import os
import sys

def test_imports():
    """Test if all imports work correctly"""
    try:
        from app import create_app
        from extensions import db, migrate
        from config import Config
        from models.user import User
        print("✅ All imports successful")
        return True
    except Exception as e:
        print(f"❌ Import error: {e}")
        return False

def test_app_creation():
    """Test if app can be created"""
    try:
        from app import create_app
        app = create_app()
        print("✅ App creation successful")
        return True
    except Exception as e:
        print(f"❌ App creation error: {e}")
        return False

def test_database_connection():
    """Test database connection"""
    try:
        from app import create_app
        from extensions import db
        
        app = create_app()
        with app.app_context():
            # Test database connection
            with db.engine.connect() as connection:
                connection.execute(db.text("SELECT 1"))
                connection.commit()
            print("✅ Database connection successful")
        return True
    except Exception as e:
        print(f"❌ Database connection error: {e}")
        return False

def main():
    print("Testing backend setup...")
    print("=" * 40)
    
    # Set environment variables
    os.environ.setdefault('FLASK_APP', 'wsgi.py')
    os.environ.setdefault('DB_USER', 'root')
    os.environ.setdefault('DB_PASSWORD', 'KK@123')
    os.environ.setdefault('DB_HOST', 'localhost')
    os.environ.setdefault('DB_NAME', 'prok_db')
    
    tests = [
        test_imports,
        test_app_creation,
        test_database_connection
    ]
    
    passed = 0
    for test in tests:
        if test():
            passed += 1
        print()
    
    print("=" * 40)
    print(f"Tests passed: {passed}/{len(tests)}")
    
    if passed == len(tests):
        print("🎉 Backend setup is ready!")
        print("\nNext steps:")
        print("1. Run: flask db init")
        print("2. Run: flask db migrate -m 'Initial migration'")
        print("3. Run: flask db upgrade")
        print("4. Run: flask run")
    else:
        print("❌ Some tests failed. Please check the errors above.")

if __name__ == '__main__':
    main() 