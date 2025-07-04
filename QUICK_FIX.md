# Quick Fix for Import Error

## Problem
Flask CLI can't find the `extensions` module due to Python path issues.

## Solution

### Option 1: Use Manual Migration Script (Recommended)

```bash
cd app/backend
python manual_migrate.py
```

This script will:
- ✅ Create database tables directly (no Flask CLI needed)
- ✅ Start the Flask server
- ✅ Handle all import issues automatically

### Option 2: Fix Flask CLI (Alternative)

```bash
cd app/backend

# Set PYTHONPATH
export PYTHONPATH=$PWD

# Set Flask app
export FLASK_APP=app.py

# Run migrations
flask db init
flask db migrate -m "Initial migration"
flask db upgrade

# Start server
flask run
```

### Option 3: Simple Direct Approach

```bash
cd app/backend

# Create tables and start server in one command
python -c "
import os, sys
sys.path.insert(0, '.')
os.environ['DB_PASSWORD'] = 'arjun*0347'
from app import app
from extensions import db
with app.app_context():
    db.create_all()
    print('✅ Tables created!')
app.run(debug=True)
"
```

## What Each Option Does

### Option 1 (Recommended):
- Bypasses Flask CLI completely
- Creates tables directly with `db.create_all()`
- Starts server immediately
- No import path issues

### Option 2:
- Fixes Flask CLI import issues
- Uses proper migrations
- More complex but follows Flask conventions

### Option 3:
- Quick one-liner
- Creates tables and starts server
- Good for testing

## Test the API

Once the server is running:

```bash
# Test signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"12345678"}'

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usernameOrEmail":"test","password":"12345678"}'
```

## Next Steps

After backend is running:
1. Start frontend: `cd app/frontend && npm run dev`
2. Test in browser: `http://localhost:5173`
3. Test login/signup forms

**Use Option 1 for the quickest solution!** 🚀 