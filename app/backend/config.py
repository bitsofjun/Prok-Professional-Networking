import os
from datetime import timedelta
from urllib.parse import quote_plus
from flask import Blueprint, request, jsonify, send_from_directory
from models.user import User
from werkzeug.security import check_password_hash
from sqlalchemy.orm import relationship

MAX_CONTENT_LENGTH = 10 * 1024 * 1024  # 10 MB
