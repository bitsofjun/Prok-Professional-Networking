# Database Connection Fix

## Problem
The error `'Engine' object has no attribute 'execute'` occurs because Flask-SQLAlchemy 3.0.5 uses SQLAlchemy 2.x, which has a different API.

## Solution

### 1. Test Database Connection

Run this command to test and fix the database connection:

```bash
cd app/backend
python test_db.py
```

This script will:
- ✅ Test the database connection with proper SQLAlchemy 2.x syntax
- ✅ Create the database if it doesn't exist
- ✅ Verify all connections work

### 2. If Database Doesn't Exist

If the database doesn't exist, create it manually:

```bash
# Connect to MySQL
mysql -u root -p

# Create database
CREATE DATABASE prok_db;

# Verify
SHOW DATABASES;

# Exit
EXIT;
```

### 3. Start MySQL (if not running)

```bash
# Start MySQL service
sudo systemctl start mysql

# Check status
sudo systemctl status mysql

# Enable auto-start
sudo systemctl enable mysql
```

### 4. Run the Complete Setup

After fixing the database connection:

```bash
cd app/backend
python setup_and_run.py
```

## What Was Fixed

### Old SQLAlchemy 1.x Syntax (Deprecated):
```python
db.engine.execute("SELECT 1")
```

### New SQLAlchemy 2.x Syntax (Fixed):
```python
with db.engine.connect() as connection:
    connection.execute(db.text("SELECT 1"))
    connection.commit()
```

## Files Updated

1. **setup_and_run.py** - Fixed database connection test
2. **test_imports.py** - Fixed database connection test
3. **test_setup.py** - Fixed database connection test
4. **test_db.py** - New comprehensive database test script

## Troubleshooting

### If MySQL Connection Fails:

1. **Check MySQL Status:**
   ```bash
   sudo systemctl status mysql
   ```

2. **Start MySQL:**
   ```bash
   sudo systemctl start mysql
   ```

3. **Check MySQL Port:**
   ```bash
   sudo netstat -tlnp | grep 3306
   ```

4. **Test Manual Connection:**
   ```bash
   mysql -u root -p
   ```

### If Database Doesn't Exist:

```bash
mysql -u root -p -e "CREATE DATABASE prok_db;"
```

### If Password Issues:

```bash
# Reset MySQL root password
sudo mysql_secure_installation
```

## Success Criteria

✅ MySQL service is running  
✅ Database 'prok_db' exists  
✅ Python can connect to MySQL  
✅ SQLAlchemy 2.x syntax works  
✅ Flask app can access database  

## Next Steps

After fixing the database connection:

1. Run: `python setup_and_run.py`
2. Test the API endpoints
3. Start the frontend: `npm run dev`
4. Test login/signup functionality 