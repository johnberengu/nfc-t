from flask import Blueprint, request, jsonify, current_app
from models.staffdashboard import Staff
from models import db
from werkzeug.security import check_password_hash
import jwt
import datetime
from functools import wraps

auth_bp = Blueprint('auth_bp', __name__)

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        SECRET_KEY = current_app.config.get('SECRET_KEY', 'your_secret_key')
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        
        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            current_user = Staff.query.filter_by(id=data['id']).first()
        except:
            return jsonify({'message': 'Token is invalid!'}), 401
        return f(current_user, *args, **kwargs)
    return decorated

@auth_bp.route('/login', methods=['POST'])
def login():
    SECRET_KEY = current_app.config.get('SECRET_KEY', 'your_secret_key')
    data = request.json
    email = data.get('email')
    password = data.get('password')
    if not email or not password:
        return jsonify({'message': 'Email and password required'}), 400

    user = Staff.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({'message': 'Invalid credentials'}), 401

    token = jwt.encode(
        {'id': user.id, 'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)},
        SECRET_KEY,
        algorithm="HS256"
    )
    return jsonify({'token': token, 'user': user.to_dict()}), 200


@auth_bp.route('/logout', methods=['POST'])
def logout():


    return jsonify({'message': 'Logout successful'}), 200
