from flask import Flask
from flask_cors import CORS
from extensions import db, migrate
from config import Config

def create_app(config_class=Config):
    """Application factory function"""
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    CORS(app)
    
    # Import and register blueprints
    from api.auth import auth_bp
    from api.feed import feed_bp
    from api.jobs import jobs_bp
    from api.messaging import messaging_bp
    from api.posts import posts_bp
    from api.profile import profile_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(feed_bp, url_prefix='/api/feed')
    app.register_blueprint(jobs_bp, url_prefix='/api/jobs')
    app.register_blueprint(messaging_bp, url_prefix='/api/messaging')
    app.register_blueprint(posts_bp, url_prefix='/api/posts')
    app.register_blueprint(profile_bp, url_prefix='/api/profile')

    return app

# Create app instance for Flask CLI
app = create_app()

# Import models inside app context to avoid circular imports
with app.app_context():
    from models.user import User

if __name__ == '__main__':
    app.run(debug=True)
