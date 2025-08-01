from flask import Flask
app = Flask(__name__)
from flask_cors import CORS
from config import MAX_CONTENT_LENGTH
from api import auth_bp, profile_bp, posts_bp, feed_bp, jobs_bp, messaging_bp
from extensions import db
import os
from flask import send_from_directory
ALLOWED_ORIGINS = os.getenv('ALLOWED_ORIGINS', 'http://localhost:5173').split(',')
CORS(app,
     origins=ALLOWED_ORIGINS,
     methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
     allow_headers=['Content-Type', 'Authorization', 'X-Requested-With'],
     supports_credentials=True,
     max_age=3600)
from flask_jwt_extended import JWTManager
from flask_jwt_extended.exceptions import NoAuthorizationError, InvalidHeaderError
from flask import jsonify
from flask_migrate import Migrate
from sqlalchemy import create_engine

# Use the environment variable for the database URI
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('SQLALCHEMY_DATABASE_URI')
app.config['MAX_CONTENT_LENGTH'] = MAX_CONTENT_LENGTH
app.config['JWT_SECRET_KEY'] = 'your-very-secret-key'  # Change this to a strong secret!
jwt = JWTManager(app)

db.init_app(app)

migrate = Migrate(app, db)

# TEMP: Create all tables if they don't exist (for deployment)
with app.app_context():
    db.create_all()

app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(profile_bp, url_prefix='/api')
app.register_blueprint(posts_bp, url_prefix='/api')
app.register_blueprint(feed_bp, url_prefix='/api')
app.register_blueprint(jobs_bp, url_prefix='/api')
app.register_blueprint(messaging_bp, url_prefix='/api')

# Add JWT error handlers for better debugging
@jwt.unauthorized_loader
def unauthorized_callback(callback):
    print('JWT Unauthorized:', callback)
    return jsonify({'error': 'Missing or invalid JWT. Please log in again.'}), 401

@jwt.invalid_token_loader
def invalid_token_callback(callback):
    print('JWT Invalid Token:', callback)
    return jsonify({'error': 'Invalid JWT. Please log in again.'}), 422

@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_payload):
    print('JWT Expired Token')
    return jsonify({'error': 'JWT expired. Please log in again.'}), 401

# Static file route for profile images
@app.route('/uploads/profile_images/<filename>')
def uploaded_file(filename):
    upload_folder = os.path.join(os.path.dirname(__file__), 'uploads/profile_images')
    return send_from_directory(upload_folder, filename)

# Static file route for post media
@app.route('/uploads/post_media/<filename>')
def uploaded_post_media(filename):
    upload_folder = os.path.join(os.path.dirname(__file__), 'uploads/post_media')
    return send_from_directory(upload_folder, filename)

if __name__ == "__main__":
    app.run(port=5001, debug=True)
