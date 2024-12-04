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
        decryption_key = Fernet.generate_key().decode("utf-8")
        cipher = Fernet(decryption_key.encode("utf-8"))

        cc_string = data["card"]
        encrypted_card = cipher.encrypt(cc_string.encode()).decode("utf-8")
        user.cc_info = encrypted_card
        user.decryption_key = decryption_key
        user.save()
        return jsonify({"message": "Card information updated"}), 201
    except Exception as e:
        return jsonify({"error adding credit card to user": str(e)}), 500


@user.route("/", methods=["GET"])
@user_or_admin_required
def get_user():
    token = request.headers.get("Authorization")
    payload = get_user_from_token(token)
    user = get_referenced_user(payload)
    try:
        print("user routes.py: get user passed")
        return jsonify({"user": user.json_formatted()}), 201
    except Exception as e:
        print("user routes.py: get user failed")
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
