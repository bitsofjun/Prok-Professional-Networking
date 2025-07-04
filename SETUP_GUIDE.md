# Setup Guide for First 2 Modules (Login & Signup) - FIXED VERSION

This guide will help you set up and run the first 2 modules of the Prok Professional Networking platform.

## Prerequisites

- Python 3.8+
- Node.js 16+
- MySQL 8.0+
- Git

## Quick Start (Recommended)

### 1. Backend Setup - One Command Solution

```bash
cd app/backend
python setup_and_run.py
```

This script will:
- ✅ Set up all environment variables
- ✅ Test all imports
- ✅ Test database connection
- ✅ Initialize migrations
- ✅ Create and apply initial migration
- ✅ Start the Flask server

### 2. Frontend Setup

```bash
cd app/frontend
npm install
npm run dev
```

## Manual Setup (Alternative)

### Backend Setup

#### 1. Install Python Dependencies

```bash
cd app/backend
pip install -r requirements.txt
```

#### 2. Database Setup

Make sure MySQL is running and create the database:

```sql
CREATE DATABASE prok_db;
```

#### 3. Environment Configuration

```bash
export FLASK_APP=app.py
export FLASK_ENV=development
export DB_USER=root
export DB_PASSWORD=KK@123
export DB_HOST=localhost
export DB_NAME=prok_db
export SECRET_KEY=your-secret-key-here
export JWT_SECRET_KEY=your-jwt-secret-key-here
```

#### 4. Test Setup

```bash
python test_imports.py
```

#### 5. Initialize Database

```bash
# Initialize migrations (only needed once)
flask db init

# Create initial migration
flask db migrate -m "Initial migration"

# Apply migrations
flask db upgrade
```

#### 6. Run Backend

```bash
flask run
```

The backend will be available at `http://localhost:5000`

### Frontend Setup

#### 1. Install Node.js Dependencies

```bash
cd app/frontend
npm install
```

#### 2. Run Frontend

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Testing the Modules

### 1. Test Signup

1. Open `http://localhost:5173/signup`
2. Fill in the form:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `password123`
   - Confirm Password: `password123`
3. Click "Sign Up"
4. You should be redirected to `/profile` on success

### 2. Test Login

1. Open `http://localhost:5173/login`
2. Fill in the form:
   - Username/Email: `testuser` or `test@example.com`
   - Password: `password123`
3. Click "Login"
4. You should be redirected to `/profile` on success

## API Endpoints

### Authentication Endpoints

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### Request/Response Examples

#### Signup Request
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}
```

#### Signup Response
```json
{
  "message": "User created successfully",
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com"
  }
}
```

#### Login Request
```json
{
  "usernameOrEmail": "testuser",
  "password": "password123"
}
```

#### Login Response
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com"
  }
}
```

## Troubleshooting

### Common Issues

1. **Import Error: No module named 'app'**
   - **Solution**: Use `export FLASK_APP=app.py` (not wsgi.py)
   - **Alternative**: Run `python setup_and_run.py`

2. **Database Connection Error**
   - Ensure MySQL is running
   - Check database credentials in environment variables
   - Verify database `prok_db` exists

3. **Migration Errors**
   - Delete `migrations/` folder and reinitialize
   - Ensure database exists and is accessible

4. **Frontend API Errors**
   - Verify backend is running on `http://localhost:5000`
   - Check browser console for CORS errors
   - Ensure API endpoints are accessible

### Reset Everything

```bash
# Backend
cd app/backend
rm -rf migrations/
mysql -u root -p -e "DROP DATABASE prok_db; CREATE DATABASE prok_db;"
python setup_and_run.py

# Frontend
cd app/frontend
npm run dev
```

## File Structure

```
app/
├── backend/
│   ├── api/
│   │   └── auth.py              # Login/Signup endpoints
│   ├── models/
│   │   └── user.py              # User model
│   ├── app.py                   # Main app file (Flask CLI entry point)
│   ├── wsgi.py                  # WSGI entry point
│   ├── main.py                  # Alternative entry point
│   ├── config.py                # Configuration
│   ├── extensions.py            # Flask extensions
│   ├── setup_and_run.py         # Automated setup script
│   ├── test_imports.py          # Import test script
│   └── requirements.txt         # Python dependencies
└── frontend/
    ├── src/
    │   ├── components/auth/
    │   │   ├── Login.tsx        # Login component
    │   │   ├── Signup.tsx       # Signup component
    │   │   └── api.ts           # Auth API calls
    │   └── routes/
    │       └── index.tsx        # Routing configuration
    └── package.json             # Node.js dependencies
```

## Key Changes Made

### Backend Fixes:
1. **Simplified app.py** - Created app instance at module level for Flask CLI
2. **Fixed import paths** - Removed circular import issues
3. **Added automated setup** - `setup_and_run.py` handles everything
4. **Corrected FLASK_APP** - Use `app.py` instead of `wsgi.py`

### Frontend Fixes:
1. **API integration** - Connected forms to backend endpoints
2. **Error handling** - Added loading states and error messages
3. **Form validation** - Client-side validation with server feedback

## Success Criteria

✅ Backend runs without import errors  
✅ Database migrations work  
✅ Signup endpoint creates users  
✅ Login endpoint authenticates users  
✅ Frontend displays login/signup forms  
✅ Forms submit to backend successfully  
✅ Users are redirected after successful auth  
✅ Error handling works for invalid inputs  

## Next Steps

After successfully running the first 2 modules:

1. Implement profile management
2. Add post creation and feed
3. Implement job board functionality
4. Add messaging system
5. Deploy to production 