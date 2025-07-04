#!/usr/bin/env python3
"""
Test script to verify imports work correctly
"""
import os
import sys

# Add current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def test_imports():
    """Test if all imports work correctly"""
    try:
        print("Testing imports...")
        
        # Test basic imports
        from extensions import db, migrate
        print("✅ Extensions imported")
        
        from config import Config
        print("✅ Config imported")
        
        from models.user import User
        print("✅ User model imported")
        
        from app import app, create_app
        print("✅ App imported")
        
        # Test app creation
        test_app = create_app()
        print("✅ App creation successful")
        
        # Test database connection
        with test_app.app_context():
            # Use the new SQLAlchemy 2.x syntax
            with db.engine.connect() as connection:
                connection.execute(db.text("SELECT 1"))
                connection.commit()
            print("✅ Database connection successful")
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == '__main__':
    # Set environment variables
    os.environ.setdefault('FLASK_APP', 'app.py')
    os.environ.setdefault('DB_USER', 'root')
    os.environ.setdefault('DB_PASSWORD', 'arjun*0347')  # Your actual password
    os.environ.setdefault('DB_HOST', 'localhost')
    os.environ.setdefault('DB_NAME', 'prok_db')
    
    if test_imports():
        print("\n🎉 All imports successful! You can now run:")
        print("  export FLASK_APP=app.py")
        print("  flask db init")
        print("  flask db migrate -m 'Initial migration'")
        print("  flask db upgrade")
        print("  flask run")
    else:
        print("\n❌ Import test failed. Please check the errors above.") 