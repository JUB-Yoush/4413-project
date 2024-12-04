import jwt
import bcrypt
from ..models import Admin, User
from env import SECRET_KEY
from flask import request, jsonify
# Function for generating token
# Used for verification on subsequent requests


def generate_token(email):
    payload = {"email": email}
    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")  # Secret Key
    return token


def decode_token(token):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError as e:
        print(f"ERROR:{e}")
        return None
    except jwt.InvalidTokenError as e:
        print(f"ERROR:{e}")
        return None


def get_user_from_token(token):
    print(token)
    payload = decode_token(token.split(" ")[1])
    return payload


def admin_required(f):
    def wrapper(*args, **kwargs):
        print("CHECKING IF ADMIN")
        token = request.headers.get("Authorization")
        if not token:
            return jsonify({"message": "Token is missing!"}), 403

        try:
            # Decode the token
            data = get_user_from_token(token)
            email = data["email"]
            # Check if the user is an admin
            admin = Admin.objects(email=email).first()
            if admin is None:
                return jsonify({"message": "User is not an admin!"}), 403

        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token has expired!"}), 403
        except jwt.InvalidTokenError:
            return jsonify({"message": "Invalid token!"}), 403

        return f(*args, **kwargs)

    wrapper.__name__ = f.__name__
    return wrapper


def user_required(f):
    def wrapper(*args, **kwargs):
        token = request.headers.get("Authorization")
        if not token:
            return jsonify({"message": "Token is missing!"}), 403

        try:
            # Decode the token
            data = get_user_from_token(token)
            print(token)
            email = data["email"]
            # Check if the user is an admin
            user = User.objects(email=email).first()
            if user is None:
                return jsonify({"message": "Invalid user token, user not found"}), 400

        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token has expired!"}), 403
        except jwt.InvalidTokenError:
            return jsonify({"message": "Invalid token!"}), 403

        return f(*args, **kwargs)

    wrapper.__name__ = f.__name__
    return wrapper


def user_or_admin_required(f):
    def wrapper(*args, **kwargs):
        token = request.headers.get("Authorization")
        if not token:
            return jsonify({"message": "Token is missing!"}), 403

        try:
            # Decode the token
            data = get_user_from_token(token)
            print(token)
            email = data["email"]
            # Check if the user is an admin
            user = User.objects(email=email).first()
            admin = Admin.objects(email=email).first()
            if user is None and (
                admin is None
                and User.objects(email=request.json.get("email").first() is None)
            ):
                return jsonify(
                    {"message": "Invalid user token or no user email provided."}
                ), 500

        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token has expired!"}), 403
        except jwt.InvalidTokenError:
            return jsonify({"message": "Invalid token!"}), 403

        return f(*args, **kwargs)

    wrapper.__name__ = f.__name__
    return wrapper


def get_referenced_user(payload):
    email = payload["email"]

    # returns either the user in the jwt token or the user referenced in the "user_email" json section if jwt token is an admin.
    # error checking is handled by user_or_admin_required wrapper function
    user = User.objects(email=email).first()
    admin = Admin.objects(email=email).first()
    if admin == None:
        return user
    if user == None:
        return admin
