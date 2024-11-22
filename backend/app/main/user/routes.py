from flask import render_template, redirect, url_for, request, jsonify
import datetime
import jwt
from . import user
import bcrypt
from app.models import User, Product
from app.auth.session import (
    get_user_from_token,
    admin_required,
    user_required,
    user_or_admin_required,
    get_referenced_user,
)
from cryptography.fernet import Fernet


# card data send in "xxxxxxxxxxxxxxxx-xxxx-xxx" (16 nums, exp(mmyy),cvv), one string
@user.route("/cc", methods=["PATCH"])
@user_required
def add_cc():
    data = request.json
    token = request.headers.get("Authorization")
    payload = get_user_from_token(token)
    user = User.objects(email=payload["email"]).first()
    try:
        cipher = Fernet(user.decryption_key)
        cc_string = data["card"]
        encrypted_card = cipher.encrypt(cc_string.encode())
        user.update_credit_card(encrypted_card)
        return jsonify({"message": "Card information updated"}), 201
    except Exception as e:
        return jsonify({"error adding credit card to user": str(e)}), 500


@user.route("/", methods=["GET"])
@user_or_admin_required
def get_user():
    data = request.json
    token = request.headers.get("Authorization")
    payload = get_user_from_token(token)
    user = get_referenced_user(payload)
    try:
        return jsonify(user.json_formatted()), 201
    except Exception as e:
        return jsonify({"error getting user data": str(e)}), 500


@user.route("/", methods=["PATCH"])
@user_or_admin_required
def edit_user():
    data = request.json
    token = request.headers.get("Authorization")
    payload = get_user_from_token(token)
    user = get_referenced_user(payload)
    try:
        for key, value in data.items():
            if hasattr(user, key):
                setattr(user, key, value)
        user.save()

        return jsonify({"message": "user info updated."}), 201
    except Exception as e:
        return jsonify({"error updating user data": str(e)}), 500
