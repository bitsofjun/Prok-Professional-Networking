from flask import Blueprint, request, jsonify, current_app, send_from_directory
from extensions import db
from models.profile import Profile
import os
from werkzeug.utils import secure_filename
from PIL import Image
import io
import secrets
import json

profile_bp = Blueprint('profile', __name__)

UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'uploads/profile_images')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
MAX_IMAGE_SIZE = 5 * 1024 * 1024  # 5MB
THUMBNAIL_SIZE = (128, 128)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def ensure_upload_folder():
    """Ensure upload folder exists"""
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# GET /api/profile
@profile_bp.route('/profile', methods=['GET'])
def get_profile():
    try:
        user_id = 1  # Replace with actual user auth in production
        profile = Profile.query.filter_by(user_id=user_id).first()
        
        if not profile:
            # Auto-create a default profile if not found
            profile = Profile(user_id=user_id, name='Default User')
            db.session.add(profile)
            db.session.commit()
        
        # Parse JSON fields
        social = json.loads(profile.social) if profile.social else {}
        activity = json.loads(profile.activity) if profile.activity else {}
        education = json.loads(profile.education) if profile.education else []
        experience = json.loads(profile.experience) if profile.experience else []
        contact = json.loads(profile.contact) if profile.contact else {}
        
        return jsonify({
            'id': profile.id,
            'user_id': profile.user_id,
            'name': profile.name,
            'avatar': profile.avatar,
            'title': profile.title,
            'location': profile.location,
            'bio': profile.bio,
            'skills': profile.skills,
            'experience': experience,
            'education': education,
            'contact': contact,
            'social': social,
            'activity': activity
        })
    except Exception as e:
        print(f'Error in get_profile: {str(e)}')
        return jsonify({'error': 'Failed to load profile'}), 500

# PUT /api/profile
@profile_bp.route('/profile', methods=['PUT'])
def update_profile():
    try:
        user_id = 1  # Replace with actual user auth in production
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        profile = Profile.query.filter_by(user_id=user_id).first()
        if not profile:
            # Auto-create profile if not found
            profile = Profile(user_id=user_id, name=data.get('name', ''))
            db.session.add(profile)
        
        # Update fields
        fields_to_update = ['name', 'title', 'location', 'bio', 'skills']
        for field in fields_to_update:
            if field in data:
                setattr(profile, field, data[field])
        
        # Handle JSON fields
        if 'experience' in data:
            profile.experience = json.dumps(data['experience'])
        if 'education' in data:
            profile.education = json.dumps(data['education'])
        if 'contact' in data:
            profile.contact = json.dumps(data['contact'])
        if 'social' in data:
            profile.social = json.dumps(data['social'])
        if 'activity' in data:
            profile.activity = json.dumps(data['activity'])
        
        db.session.commit()
        
        return jsonify({
            'message': 'Profile updated successfully',
            'profile': {
                'id': profile.id,
                'user_id': profile.user_id,
                'name': profile.name,
                'avatar': profile.avatar,
                'title': profile.title,
                'location': profile.location,
                'bio': profile.bio,
                'skills': profile.skills
            }
        })
    except Exception as e:
        print(f'Error in update_profile: {str(e)}')
        db.session.rollback()
        return jsonify({'error': f'Failed to update profile: {str(e)}'}), 400

# POST /api/profile/image
@profile_bp.route('/profile/image', methods=['POST'])
def upload_profile_image():
    try:
        user_id = 1  # Replace with actual user auth in production
        
        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400
        
        file = request.files['image']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'error': 'Invalid file type. Only PNG, JPG, JPEG, GIF allowed'}), 400
        
        # Check file size
        file.seek(0, io.SEEK_END)
        file_size = file.tell()
        file.seek(0)
        
        if file_size > MAX_IMAGE_SIZE:
            return jsonify({'error': f'File too large. Maximum size is {MAX_IMAGE_SIZE // (1024*1024)}MB'}), 400
        
        # Ensure upload folder exists
        ensure_upload_folder()
        
        # Generate secure filename
        ext = file.filename.rsplit('.', 1)[1].lower()
        random_hex = secrets.token_hex(8)
        filename = f"profile_{user_id}_{random_hex}.{ext}"
        save_path = os.path.join(UPLOAD_FOLDER, filename)
        
        # Process and save image
        try:
            img = Image.open(file.stream)
            
            # Convert to RGB if needed
            if ext in ("jpg", "jpeg", "png") and img.mode in ("RGBA", "P"):
                img = img.convert("RGB")
            
            # Resize if too large (max 512x512)
            if img.size[0] > 512 or img.size[1] > 512:
                img.thumbnail((512, 512), Image.Resampling.LANCZOS)
            
            # Save original image
            img.save(save_path, format=img.format if img.format else ext.upper(), quality=85)
            
            # Generate thumbnail
            thumb = img.copy()
            thumb.thumbnail(THUMBNAIL_SIZE, Image.Resampling.LANCZOS)
            thumb_filename = f"thumb_{filename}"
            thumb_save_path = os.path.join(UPLOAD_FOLDER, thumb_filename)
            thumb.save(thumb_save_path, format='JPEG', quality=80)
            
        except Exception as e:
            print(f'Image processing error: {str(e)}')
            return jsonify({'error': 'Failed to process image'}), 400
        
        # Update profile with new image
        profile = Profile.query.filter_by(user_id=user_id).first()
        if not profile:
            profile = Profile(user_id=user_id, name='Default User')
            db.session.add(profile)
        
        profile.avatar = filename
        db.session.commit()
        
        return jsonify({
            'message': 'Image uploaded successfully',
            'image_url': f'/uploads/profile_images/{filename}',
            'thumbnail_url': f'/uploads/profile_images/{thumb_filename}',
            'filename': filename
        })
        
    except Exception as e:
        print(f'Error in upload_profile_image: {str(e)}')
        return jsonify({'error': f'Failed to upload image: {str(e)}'}), 500

# Serve uploaded images
@profile_bp.route('/uploads/profile_images/<filename>')
def serve_profile_image(filename):
    try:
        return send_from_directory(UPLOAD_FOLDER, filename)
    except Exception as e:
        print(f'Error serving image {filename}: {str(e)}')
        return jsonify({'error': 'Image not found'}), 404 