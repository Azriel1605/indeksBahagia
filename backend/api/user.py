from . import api
from flask_bcrypt import Bcrypt
from flask import session, request, jsonify
from model import db, User, PasswordResetToken
from datetime import datetime, timedelta
import secrets
import os


bcrypt = Bcrypt()

@api.route('/check-auth', methods=['GET'])
def check_auth():
    if 'user_id' in session:
        user = User.query.get(session['user_id'])
        if user:
            return jsonify({
                'authenticated': True,
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'role': user.role
                }
            })
    
    return jsonify({'authenticated': False}), 401

@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    user = User.query.filter_by(username=username).first() or User.query.filter_by(email=username).first()
    
    if user and bcrypt.check_password_hash(user.password_hash, password):
        session.permanent = True
        session['user_id'] = user.id
        session['username'] = user.username
        session['role'] = user.role
        
        return jsonify({
            'message': 'Login successful',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'role': user.role
            }
        })
    
    return jsonify({'message': 'Invalid credentials'}), 401

@api.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'message': 'Logout successful'})

@api.route('/reset-password', methods=['POST'])
def reset_password():
    
    return jsonify({}), 200

@api.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    email = data.get('email')
    
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'message': 'Email not found'}), 404
    
    # Generate reset token
    token = secrets.token_urlsafe(32)
    expires_at = datetime.now() + timedelta(hours=1)
    
    # Use frontend URL
    frontend_url = os.getenv("FRONTEND_URL"+"/api")
    reset_link = f"{frontend_url}/forgot-password?token={token}"
    
    reset_token = PasswordResetToken(
        user_id=user.id,
        token=token,
        expires_at=expires_at
    )
    db.session.add(reset_token)
    db.session.commit()
    
    if not send_reset_email(user_email=email, url=reset_link):
        return jsonify({
            'message': 'Gagal Terkirim'
        }), 400
    
    return jsonify({
        'message': 'Password reset token generated',
        'token': token  # Remove this in production
    })
