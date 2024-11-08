from flask import render_template, redirect, url_for, request, jsonify
import datetime
import jwt
from . import user
import bcrypt
from app.models import User
from app.auth.session import get_user_from_token
from cryptography.fernet import Fernet


# card data send in "xxxxxxxxxxxxxxxx-xxxx-xxx" (16 nums, exp(mmyy),cvv), one string
@user.route("/cc", methods=["POST"])
def add_cc():
    data = request.json
    token = request.headers.get("Authorization")
    if not token:
        return jsonify({"error": "NO SESSION TOKEN"}), 401
    payload = get_user_from_token(token)
    if not payload:
        return jsonify({"error": "INVALID SESSION TOKEN"}), 401

    try:
        user = User.objects(email=payload["email"]).first()
        cipher = Fernet(user.decryption_key)
        cc_string = data["card"]
        encrypted_card = cipher.encrypt(cc_string.encode())
        user.update_credit_card(encrypted_card)
        return jsonify({"message": "Card information updated"}), 201
    except Exception as e:
        return jsonify({"error adding credit card to user": str(e)}), 500
