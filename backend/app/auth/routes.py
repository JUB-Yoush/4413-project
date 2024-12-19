from flask import request, jsonify
from . import auth
from ..models import User, Admin
import bcrypt
from .session import generate_token
from cryptography.fernet import Fernet


# Sign-Up route
@auth.route("/signup", methods=["POST"])
def signup():
    print("signing up")
    data = request.json
    try:
        email = data["email"]  # Retrieve email from JSON data
        password = data["password"].encode("utf-8")  # Retrieve password from JSON data
        # Hash password
        h_password = bcrypt.hashpw(password, bcrypt.gensalt())

        # Check if user already exists with email; else, register user
        if User.objects(email=email):
            return jsonify({"error": "This email is already registered!"}), 400

        decryption_key = Fernet.generate_key().decode("utf-8")
        cipher = Fernet(decryption_key.encode("utf-8"))
        cc_string = data["card"]
        encrypted_card = cipher.encrypt(cc_string.encode()).decode("utf-8")

        new_user = User(
            fname=data["fname"],
            lname=data["lname"],
            email=email,
            password=h_password.decode("utf-8"),
            street=data["street"],
            city=data["city"],
            province=data["province"],
            postal_code=data["postal"],
            cc_info=encrypted_card,
            decryption_key=decryption_key,
        )

        # Insert user into database
        new_user.save()
        return jsonify({"message": "User registered successfully! Please log in"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@auth.route("/admin/signup", methods=["POST"])
def admin_signup():
    print("signing up")
    data = request.json
    try:
        email = data["email"]  # Retrieve email from JSON data
        password = data["password"].encode("utf-8")  # Retrieve password from JSON data
        h_password = bcrypt.hashpw(password, bcrypt.gensalt())
        # Insert user into database
        new_admin = Admin(email=email, password=h_password)
        new_admin.save()
        return jsonify(
            {"message": "Admin user registered successfully! Please log in"}
        ), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400


# Login route
@auth.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data["email"]
    password = data["password"].encode("utf-8")

    # Retrieve user from database
    user = User.objects(email=email).first()
    if not user or not bcrypt.checkpw(
        password, user.password.encode("utf-8")
    ):  # if user does not exist OR inputted password is incorrect
        return jsonify({"error": "Invalid email or password!"}), 401

    # Generate and return a JWT token upon successful login
    token = generate_token(email)
    return jsonify({"token": token}), 200


@auth.route("/admin/login", methods=["POST"])
def admin_login():
    data = request.json
    email = data["email"]
    password = data["password"].encode("utf-8")

    # Retrieve user from database
    admin = Admin.objects(email=email).first()
    if not admin or not bcrypt.checkpw(
        password, admin.password.encode("utf-8")
    ):  # if user does not exist OR inputted password is incorrect
        return jsonify({"error": "Invalid email or password!"}), 401

    # Generate and return a JWT token upon successful login
    token = generate_token(email)
    return jsonify({"token": token}), 200
