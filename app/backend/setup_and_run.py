#!/usr/bin/env python3
"""
Comprehensive setup and run script for the Flask backend
"""
import os
import sys
import subprocess
import time

def setup_environment():
    """Setup environment variables"""
    print("🔧 Setting up environment variables...")
    
    env_vars = {
        'FLASK_APP': 'app.py',
        'FLASK_ENV': 'development',
        'DB_USER': 'root',
        'DB_PASSWORD': 'arjun*0347',  # Your actual password
        'DB_HOST': 'localhost',
        'DB_NAME': 'prok_db',
        'SECRET_KEY': 'dev-secret-key-change-in-production',
        'JWT_SECRET_KEY': 'jwt-secret-key-change-in-production'
    }
    
    for key, value in env_vars.items():
        os.environ[key] = value
        print(f"  ✅ {key}={value}")
    
    print()

def test_imports():
    """Test if all imports work correctly"""
    print("🧪 Testing imports...")
    
    try:
        # Add current directory to Python path
        sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
        
        from extensions import db, migrate
        print("  ✅ Extensions imported")
        
        from config import Config
        print("  ✅ Config imported")
        
        from models.user import User
        print("  ✅ User model imported")
        
        from app import app, create_app
        print("  ✅ App imported")
        
        # Test app creation
        test_app = create_app()
        print("  ✅ App creation successful")
        
        return True
        
    except Exception as e:
        print(f"  ❌ Import error: {e}")
        return False

def test_database_connection():
    """Test database connection"""
    print("🗄️ Testing database connection...")
    
    try:
        sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
        from app import create_app
        from extensions import db
        
        app = create_app()
        with app.app_context():
            # Use the new SQLAlchemy 2.x syntax
            with db.engine.connect() as connection:
                connection.execute(db.text("SELECT 1"))
                connection.commit()
            print("  ✅ Database connection successful")
        return True
        
    except Exception as e:
        print(f"  ❌ Database connection error: {e}")
        print("  💡 Make sure MySQL is running and database 'prok_db' exists")
        return False

def run_flask_command(command, description):
    """Run a Flask command"""
    print(f"🚀 {description}...")
    
    try:
        # Set PYTHONPATH to include current directory
        env = os.environ.copy()
        env['PYTHONPATH'] = os.path.dirname(os.path.abspath(__file__))
        
        result = subprocess.run(
            ['flask', *command.split()],
            capture_output=True,
            text=True,
            cwd=os.path.dirname(os.path.abspath(__file__)),
            env=env
        )
        
        if result.returncode == 0:
            print(f"  ✅ {description} successful")
            if result.stdout:
                print(f"  📝 Output: {result.stdout.strip()}")
            return True
        else:
            print(f"  ❌ {description} failed")
            print(f"  📝 Error: {result.stderr.strip()}")
            return False
            
    except Exception as e:
        print(f"  ❌ Command error: {e}")
        return False

def main():
    print("🎯 Prok Professional Networking - Backend Setup")
    print("=" * 50)
    
    # Setup environment
    setup_environment()
    
    # Test imports
    if not test_imports():
        print("\n❌ Import test failed. Please check your Python environment and dependencies.")
        return
    
    # Test database connection
    if not test_database_connection():
        print("\n❌ Database connection failed. Please check MySQL and database setup.")
        return
    
    print("\n✅ All tests passed! Setting up database...")
    
    # Initialize database
    if not run_flask_command("db init", "Initializing database migrations"):
        print("\n⚠️ Database already initialized or error occurred.")
    
    if not run_flask_command("db migrate -m 'Initial migration'", "Creating initial migration"):
        print("\n⚠️ Migration creation failed or already exists.")
    
    if not run_flask_command("db upgrade", "Applying migrations"):
        print("\n❌ Migration application failed.")
        return
    
    print("\n🎉 Setup complete! Starting the server...")
    print("=" * 50)
    print("🌐 Backend will be available at: http://localhost:5000")
    print("📚 API Documentation:")
    print("  POST /api/auth/signup - User registration")
    print("  POST /api/auth/login - User login")
    print("\n🛑 Press Ctrl+C to stop the server")
    print("=" * 50)
    
    # Start the Flask server
    try:
        # Set PYTHONPATH to include current directory
        env = os.environ.copy()
        env['PYTHONPATH'] = os.path.dirname(os.path.abspath(__file__))
        
        subprocess.run(['flask', 'run'], cwd=os.path.dirname(os.path.abspath(__file__)), env=env)
    except KeyboardInterrupt:
        print("\n👋 Server stopped. Goodbye!")

if __name__ == '__main__':
    main() 