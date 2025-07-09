from flask import Flask
from flask_cors import CORS
from config import MAX_CONTENT_LENGTH
from api import auth_bp, profile_bp, posts_bp, feed_bp, jobs_bp, messaging_bp
from extensions import db
import os
from flask import send_from_directory

app = Flask(__name__)
CORS(app, origins=['http://localhost:5173'], supports_credentials=True)
app.config['SQLALCHEMY_DATABASE_URI'] = "mysql+pymysql://root:arjun*0347@localhost/prok_db"
app.config['MAX_CONTENT_LENGTH'] = MAX_CONTENT_LENGTH

db.init_app(app)

app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(profile_bp, url_prefix='/api')
app.register_blueprint(posts_bp, url_prefix='/api')
app.register_blueprint(feed_bp, url_prefix='/api')
app.register_blueprint(jobs_bp, url_prefix='/api')
app.register_blueprint(messaging_bp, url_prefix='/api')

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
