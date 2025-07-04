#!/usr/bin/env python3
"""
Manual migration script that doesn't rely on Flask CLI
"""
import os
import sys

# Add current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def setup_migrations():
    """Setup database migrations manually"""
    
    # Set environment variables
    os.environ.setdefault('FLASK_APP', 'app.py')
    os.environ.setdefault('DB_USER', 'root')
    os.environ.setdefault('DB_PASSWORD', 'arjun*0347')
    os.environ.setdefault('DB_HOST', 'localhost')
    os.environ.setdefault('DB_NAME', 'prok_db')
    
    try:
        print("🔧 Setting up database migrations...")
        
        from app import create_app
        from extensions import db
        
        app = create_app()
        
        with app.app_context():
            print("  ✅ App context created")
            
            # Create all tables directly
            print("  🗄️ Creating database tables...")
            db.create_all()
            print("  ✅ Database tables created successfully!")
            
            # Verify tables exist
            with db.engine.connect() as connection:
                result = connection.execute(db.text("SHOW TABLES"))
                tables = result.fetchall()
                print(f"  📋 Tables created: {[table[0] for table in tables]}")
            
            print("🎉 Database setup complete!")
            return True
            
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False

def start_server():
    """Start the Flask server"""
    try:
        print("🚀 Starting Flask server...")
        
        from app import app
        
        print("🌐 Server will be available at: http://localhost:5000")
        print("📚 API Endpoints:")
        print("  POST /api/auth/signup - User registration")
        print("  POST /api/auth/login - User login")
        print("\n🛑 Press Ctrl+C to stop the server")
        print("=" * 50)
        
        app.run(debug=True, host='0.0.0.0', port=5000)
        
    except KeyboardInterrupt:
        print("\n👋 Server stopped. Goodbye!")
    except Exception as e:
        print(f"❌ Server error: {e}")

def main():
    print("🎯 Prok Professional Networking - Manual Setup")
    print("=" * 50)
    
    # Setup database
    if not setup_migrations():
        print("❌ Database setup failed. Exiting.")
        return
    
    print("\n" + "=" * 50)
    
    # Start server
    start_server()

if __name__ == '__main__':
    main() 