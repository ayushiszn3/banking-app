import re
from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from . import db
from .models import User, Transaction
from marshmallow import Schema, fields, ValidationError

bp = Blueprint('routes', __name__)

class UserSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True)
    email = fields.Email(required=True)
    balance = fields.Float(dump_only=True)

class TransactionSchema(Schema):
    id = fields.Int(dump_only=True)
    amount = fields.Float(required=True)
    type = fields.Str(required=True)
    description = fields.Str()
    date = fields.DateTime(dump_only=True)

class RegisterSchema(Schema):
    name = fields.Str(required=True)
    email = fields.Email(required=True)
    password = fields.Str(required=True)

def validate_password(password):
    if len(password) < 8:
        return "Password must be at least 8 characters long."
    if not re.search(r"[A-Za-z]", password):
        return "Password must contain at least one letter."
    if not re.search(r"[0-9]", password):
        return "Password must contain at least one number."
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        return "Password must contain at least one special character."
    return None

@bp.route('/register', methods=['POST'])
def register():
    data = request.json
    if not data:
        return jsonify({'message': 'No input data provided'}), 400

    try:
        RegisterSchema().load(data)
    except ValidationError as err:
        return jsonify({'errors': err.messages}), 422

    password_error = validate_password(data['password'])
    if password_error:
        return jsonify({'message': password_error}), 422

    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'User already exists with this email address.'}), 409

    hashed_password = generate_password_hash(data['password'])
    user = User(name=data['name'], email=data['email'], password=hashed_password)
    db.session.add(user)
    db.session.commit()
    return jsonify({'message': 'User registered successfully.'}), 201

@bp.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(email=data['email']).first()
    if user and user.check_password(data['password']):
        access_token = create_access_token(identity=user.id)
        return jsonify({'access_token': access_token}), 200
    return jsonify({'message': 'Invalid credentials'}), 401

@bp.route('/user', methods=['GET'])
@jwt_required()
def get_user():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({'message': 'User not found'}), 404

    user_schema = UserSchema()
    result = user_schema.dump(user)
    return jsonify(result)

@bp.route('/user', methods=['PUT'])
@jwt_required()
def update_user():
    data = request.json
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({'message': 'User not found'}), 404

    if 'name' in data:
        user.name = data['name']
    if 'email' in data:
        user.email = data['email']

    db.session.commit()
    return jsonify({'message': 'User updated successfully.'}), 200

@bp.route('/change-password', methods=['POST'])
@jwt_required()
def change_password():
    data = request.json
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({'message': 'User not found'}), 404

    current_password = data.get('currentPassword')
    new_password = data.get('newPassword')
    confirm_password = data.get('confirmPassword')

    if not user.check_password(current_password):
        return jsonify({'message': 'Current password is incorrect'}), 400

    if new_password != confirm_password:
        return jsonify({'message': 'New password and confirm password do not match'}), 400

    password_error = validate_password(new_password)
    if password_error:
        return jsonify({'message': password_error}), 422

    user.set_password(new_password)
    db.session.commit()
    return jsonify({'message': 'Password changed successfully.'}), 200

@bp.route('/transactions', methods=['GET'])
@jwt_required()
def get_transactions():
    user_id = get_jwt_identity()
    transactions = Transaction.query.filter_by(user_id=user_id).all()
    if not transactions:
        return jsonify({'message': 'No transactions found'}), 404

    transaction_schema = TransactionSchema(many=True)
    result = transaction_schema.dump(transactions)
    return jsonify(result)

@bp.route('/transactions', methods=['POST'])
@jwt_required()
def create_transaction():
    data = request.json
    try:
        TransactionSchema().load(data)
    except ValidationError as err:
        return jsonify(err.messages), 422

    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({'message': 'User not found'}), 404

    transaction = Transaction(amount=data['amount'], type=data['type'], description=data['description'], user_id=user_id)
    if data['type'].lower() == 'debit':
        user.balance -= data['amount']
    elif data['type'].lower() == 'credit':
        user.balance += data['amount']

    db.session.add(transaction)
    db.session.commit()
    return jsonify({'message': 'Transaction added successfully.'}), 201

@bp.route('/transactions/search', methods=['GET'])
@jwt_required()
def search_transactions():
    query = request.args.get('query', '')
    user_id = get_jwt_identity()
    transactions = Transaction.query.filter(
        Transaction.user_id == user_id,
        (Transaction.description.ilike(f'%{query}%') | (Transaction.amount.like(f'%{query}%')))
    ).all()

    if not transactions:
        return jsonify({'message': 'No transactions found'}), 404

    transaction_schema = TransactionSchema(many=True)
    result = transaction_schema.dump(transactions)
    return jsonify(result)
