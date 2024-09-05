from werkzeug.security import generate_password_hash, check_password_hash
from . import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(200))
    balance = db.Column(db.Float, default=0.0)
    transactions = db.relationship('Transaction', back_populates='user')

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Float)
    type = db.Column(db.String(10))  # 'debit' or 'credit'
    description = db.Column(db.String(200))
    recipient_account_number = db.Column(db.String(100))  # New field for recipient account number
    sender_account_number = db.Column(db.Integer)  # Field for sender's account number
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    user = db.relationship('User', back_populates='transactions')
