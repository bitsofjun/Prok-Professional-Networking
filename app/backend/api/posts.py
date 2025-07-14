from flask import Blueprint, request, jsonify, send_from_directory
from extensions import db
from models.post import Post
import os
from werkzeug.utils import secure_filename
from datetime import datetime
from flask_jwt_extended import jwt_required, get_jwt_identity

posts_bp = Blueprint('posts', __name__)
 
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'uploads/post_media')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'mp4', 'mov', 'avi'}
MAX_MEDIA_SIZE = 10 * 1024 * 1024  # 10MB

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def ensure_upload_folder():
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@posts_bp.route('/posts', methods=['POST'])
@jwt_required()
def create_post():
    user_id = get_jwt_identity()
    content = request.form.get('content')
    is_public = request.form.get('is_public', 'true').lower() == 'true'
    allow_comments = request.form.get('allow_comments', 'true').lower() == 'true'
    if not content or content.strip() == '':
        return jsonify({'error': 'Content is required'}), 400

    media_url = None
    if 'media' in request.files:
        file = request.files['media']
        if file.filename == '':
            return jsonify({'error': 'No media file selected'}), 400
        if not allowed_file(file.filename):
            return jsonify({'error': 'Invalid file type'}), 400
        file.seek(0, os.SEEK_END)
        file_size = file.tell()
        file.seek(0)
        if file_size > MAX_MEDIA_SIZE:
            return jsonify({'error': 'File too large (max 10MB)'}), 400
        ensure_upload_folder()
        ext = file.filename.rsplit('.', 1)[1].lower()
        filename = f"post_{user_id}_{datetime.utcnow().strftime('%Y%m%d%H%M%S%f')}.{ext}"
        save_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(save_path)
        media_url = f'/uploads/post_media/{filename}'

    post = Post(
        user_id=user_id,
        content=content,
        media_url=media_url,
        is_public=is_public,
        allow_comments=allow_comments
    )
    db.session.add(post)
    db.session.commit()
    return jsonify({
        'message': 'Post created successfully',
        'post': {
            'id': post.id,
            'user_id': post.user_id,
            'content': post.content,
            'media_url': post.media_url,
            'created_at': post.created_at,
            'is_public': post.is_public,
            'allow_comments': post.allow_comments
        }
    }), 201

# Serve uploaded post media
@posts_bp.route('/uploads/post_media/<filename>')
def serve_post_media(filename):
    try:
        return send_from_directory(UPLOAD_FOLDER, filename)
    except Exception as e:
        return jsonify({'error': 'Media not found'}), 404 