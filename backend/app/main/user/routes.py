from flask import render_template, redirect, url_for, request, jsonify
import datetime
import jwt
from . import user
from mongoengine import Q
import bcrypt
from ...auth.session import generate_token
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
        print("1")

        cc_string = data["cc_info"]
        print("12")
        encrypted_card = cipher.encrypt(cc_string.encode()).decode("utf-8")
        user.cc_info = encrypted_card
        user.decryption_key = decryption_key
        print("13")
        user.save()
        return jsonify({"message": "Card information updated"}), 201
    except Exception as e:
        return jsonify({"error adding credit card to user": str(e)}), 500


@user.route("/users", methods=["GET"])
@admin_required
def get_users():
    try:
        # get query parameters for filtering, sorting, and searching
        fname = request.args.get("fname")
        lname = request.args.get("lname")
        email = request.args.get("email")
        street = request.args.get("street")
        city = request.args.get("city")
        province = request.args.get("province")
        postal_code = request.args.get("postal_code")
        sort_by = request.args.get("sort_by", "name")
        order = request.args.get("order", "asc")

        print(
            f"Query params: {fname}\n {lname} \n {email} \n {street} \n {city} "
            f"\n {province} \n {postal_code} \n {sort_by} \n {order}"
        )

        # build query
        query = Q()
        if fname:
            query &= Q(fname__like=fname)
        if lname:
            query &= Q(lname__like=lname)
        if email:
            query &= Q(email__like=email)
        if street:
            query &= Q(street__like=street)  # OR logic
        if city:
            query &= Q(city__like=city)
        if province:
            query &= Q(province__like=province)
        if postal_code:
            query &= Q(postal_code__like=postal_code)

        users = User.objects(query)
        print(users)
        # sort results
        sort_order = 1 if order == "asc" else -1
        users = users.order_by(f"{'-' if sort_order == -1 else ''}{sort_by}")

        users_json = []
        print("formatting users")
        for u in users:
            users_json.append(u.json_formatted())

        return jsonify({"users": users_json}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


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

        token = generate_token(data["email"])
        return jsonify({"token": token}), 200
    except Exception as e:
        return jsonify({"error updating user data": str(e)}), 500


@user.route("/<user_id>", methods=["PATCH"])
@admin_required
def edit_other_user(user_id):
    data = request.json
    try:
        u = User.objects.get(id=user_id)
        for key, value in data.items():
            if hasattr(u, key):
                setattr(u, key, value)
        u.save()
        return jsonify({"message": "updated u"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@user.route("/pw", methods=["PATCH"])
@user_or_admin_required
def edit_user_pw():
    data = request.json
    token = request.headers.get("Authorization")
    payload = get_user_from_token(token)
    user = get_referenced_user(payload)
    try:
        password = data["password"].encode("utf-8")  # Retrieve password from JSON data
        # Hash password
        h_password = bcrypt.hashpw(password, bcrypt.gensalt())
        password = h_password.decode("utf-8")
        user.password = password
        user.save()

        return jsonify({"message": "User Password edited"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400
