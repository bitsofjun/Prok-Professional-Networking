#!/usr/bin/env python3
"""
Simple database connection test
"""
import os
import sys

# Add current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def test_db_connection():
    """Test database connection with proper SQLAlchemy 2.x syntax"""
    
    # Set environment variables
    os.environ.setdefault('FLASK_APP', 'app.py')
    os.environ.setdefault('DB_USER', 'root')
    os.environ.setdefault('DB_PASSWORD', 'arjun*0347')  # Your actual password
    os.environ.setdefault('DB_HOST', 'localhost')
    os.environ.setdefault('DB_NAME', 'prok_db')
    
    try:
        print("🔧 Testing database connection...")
        
        from app import create_app
        from extensions import db
        
        app = create_app()
        
        with app.app_context():
            print("  ✅ App context created")
            
            # Test connection using SQLAlchemy 2.x syntax
            with db.engine.connect() as connection:
                print("  ✅ Database connection established")
                
                # Execute a simple query
                result = connection.execute(db.text("SELECT 1 as test"))
                row = result.fetchone()
                print(f"  ✅ Query executed successfully: {row.test}")
                
                # Test if database exists
                result = connection.execute(db.text("SHOW DATABASES LIKE 'prok_db'"))
                databases = result.fetchall()
                
                if databases:
                    print("  ✅ Database 'prok_db' exists")
                else:
                    print("  ⚠️ Database 'prok_db' does not exist")
                    print("  💡 Creating database...")
                    connection.execute(db.text("CREATE DATABASE prok_db"))
                    connection.commit()
                    print("  ✅ Database 'prok_db' created")
                
                connection.commit()
        
        print("🎉 Database connection test successful!")
        return True
        
    except Exception as e:
        print(f"❌ Database connection error: {e}")
        print("\n🔍 Troubleshooting steps:")
        print("1. Make sure MySQL is running:")
        print("   sudo systemctl start mysql")
        print("2. Check MySQL status:")
        print("   sudo systemctl status mysql")
        print("3. Verify you can connect manually:")
        print("   mysql -u root -p")
        print("4. Check if database exists:")
        print("   mysql -u root -p -e 'SHOW DATABASES;'")
        return False

if __name__ == '__main__':
    test_db_connection() 