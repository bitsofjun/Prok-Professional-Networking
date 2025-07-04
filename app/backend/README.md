# Prok Professional Networking - Backend

A Flask-based REST API for the Prok Professional Networking platform.

## Features

- User authentication and authorization
- Profile management
- Post creation and feed
- Job board functionality
- Messaging system
- Database migrations with Flask-Migrate

## Setup Instructions

### 1. Install Dependencies

```bash
cd app/backend
pip install -r requirements.txt
```

### 2. Database Setup

Make sure you have MySQL installed and running. Create a database:

```sql
CREATE DATABASE prok_db;
```

### 3. Environment Configuration

Set up environment variables (you can create a `.env` file in the backend directory):

```bash
# Flask Configuration
export FLASK_APP=wsgi.py
export FLASK_ENV=development

# Database Configuration
export DB_USER=root
export DB_PASSWORD=KK@123
export DB_HOST=localhost
export DB_NAME=prok_db

# Security
export SECRET_KEY=your-secret-key-here
export JWT_SECRET_KEY=your-jwt-secret-key-here
```

Or run the setup script:
```bash
python setup.py
```

### 4. Database Migrations

Initialize and run migrations:

```bash
# Initialize migrations (only needed once)
flask db init

# Create initial migration
flask db migrate -m "Initial migration"

# Apply migrations
flask db upgrade
```

### 5. Run the Application

```bash
# Using Flask CLI
flask run

# Or using Python directly
python main.py
```

## Project Structure

```
app/backend/
├── api/                    # API blueprints
│   ├── auth.py            # Authentication endpoints
│   ├── feed.py            # Feed endpoints
│   ├── jobs.py            # Job board endpoints
│   ├── messaging.py       # Messaging endpoints
│   ├── posts.py           # Post endpoints
│   └── profile.py         # Profile endpoints
├── models/                 # Database models
│   ├── user.py            # User model
│   ├── profile.py         # Profile model
│   ├── post.py            # Post model
│   ├── job.py             # Job model
│   └── message.py         # Message model
├── app.py                 # Application factory
├── main.py                # Entry point for running
├── wsgi.py                # WSGI entry point for Flask CLI
├── config.py              # Configuration settings
├── extensions.py          # Flask extensions
├── setup.py               # Setup script
└── requirements.txt       # Python dependencies
```

## API Endpoints

- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile
- `GET /api/feed` - Get posts feed
- `POST /api/posts` - Create new post
- `GET /api/jobs` - Get job listings
- `POST /api/jobs` - Create job posting
- `GET /api/messaging` - Get messages
- `POST /api/messaging` - Send message

## Database Configuration

The application uses MySQL with proper URL encoding for special characters in passwords. The database URI is automatically constructed from environment variables:

- `DB_USER`: Database username (default: root)
- `DB_PASSWORD`: Database password (default: KK@123)
- `DB_HOST`: Database host (default: localhost)
- `DB_NAME`: Database name (default: prok_db)

Special characters in passwords are automatically URL-encoded using `urllib.parse.quote_plus()`.

## Development

### Adding New Models

1. Create the model in the `models/` directory
2. Import it in `wsgi.py` inside the app context
3. Create and run migrations:
   ```bash
   flask db migrate -m "Add new model"
   flask db upgrade
   ```

### Adding New API Endpoints

1. Add routes to the appropriate blueprint in the `api/` directory
2. The blueprint will be automatically registered in `app.py`

## Troubleshooting

### Common Issues

1. **Import Errors**: Make sure you're running commands from the `app/backend` directory
2. **Database Connection**: Verify MySQL is running and credentials are correct
3. **Migration Errors**: Delete the `migrations/` folder and reinitialize if needed
4. **Special Characters in Password**: The application automatically handles URL encoding

### Reset Database

```bash
# Drop and recreate database
mysql -u root -p -e "DROP DATABASE prok_db; CREATE DATABASE prok_db;"

# Remove migrations and reinitialize
rm -rf migrations/
flask db init
flask db migrate -m "Initial migration"
flask db upgrade
``` 