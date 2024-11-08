import jwt
import bcrypt
from ..models import Admin
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
