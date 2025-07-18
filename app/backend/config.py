import os
from datetime import timedelta
from urllib.parse import quote_plus
from flask import Blueprint, request, jsonify, send_from_directory
from models.user import User
from werkzeug.security import check_password_hash
from sqlalchemy.orm import relationship
from flask_cors import CORS

DATABASE_URL = os.environ.get('DATABASE_URL')
if DATABASE_URL and DATABASE_URL.startswith('postgres://'):
    DATABASE_URL = DATABASE_URL.replace('postgres://', 'postgresql://', 1)

SQLALCHEMY_DATABASE_URI = DATABASE_URL or 'mysql://root:arjun*0347@localhost/prok_db?charset=utf8mb4'

MAX_CONTENT_LENGTH = 10 * 1024 * 1024  # 10 MB

ALLOWED_ORIGINS=https://prok-frontend-h1wa.onrender.com
