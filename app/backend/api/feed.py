from flask import Blueprint, request, jsonify
from models.post import Post

feed_bp = Blueprint('feed', __name__)

@feed_bp.route('/feed', methods=['GET', 'OPTIONS'])
def get_feed():
    if request.method == 'OPTIONS':
        return '', 200
    # Fetch all posts, newest first
    posts = Post.query.order_by(Post.created_at.desc()).all()
    feed = []
    for post in posts:
        feed.append({
            'id': post.id,
            'user_id': post.user_id,
            'content': post.content,
            'created_at': post.created_at.isoformat() if post.created_at else '',
            'likes': 0,  # Placeholder, update if you have likes logic
            'media_url': post.media_url
        })
    return jsonify({'feed': feed}), 200 