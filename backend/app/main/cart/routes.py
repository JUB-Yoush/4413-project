from flask import jsonify, request

from app.auth.session import get_user_from_token
from app.models import CartItem, Product, User, json_formatted
from mongoengine import DoesNotExist
from . import cart


@cart.route("/", methods=["GET"])
def get_cart():
    token = request.headers.get("Authorization")
    # check if token exists
    if not token:
        return jsonify({"error": "NO SESSION TOKEN"}), 401
    payload = get_user_from_token(token)

    # check if user exists
    if not payload:
        return jsonify({"error": "INVALID SESSION TOKEN"}), 401

    # get user from token
    user = User.objects(email=payload["email"]).first()

    # if a user was not found
    if not user:
        return jsonify({"error": "User not found"}), 404

    cart_items = []

    for item in user.cart_items:
        product = Product.objects.get(id=item.product_id.id)
        cart_items.append(
            {
                "product_id": str(product.id),
                "name": product.name,
                "price": product.price,
                "total_price": product.price * item.quantity,
                "quantity": item.quantity,
                "image_url": product.image_url,
            }
        )
    return jsonify({"items": cart_items, "cart_total": user.cart_total}), 200


@cart.route("/", methods=["POST"])
def add_to_cart():
    data = request.json
    token = request.headers.get("Authorization")
    product_id = data["product_id"]
    quantity = data["quantity"]

    # check if token exists
    if not token:
        return jsonify({"error": "NO SESSION TOKEN"}), 401
    payload = get_user_from_token(token)

    # check if user exists
    if not payload:
        return jsonify({"error": "INVALID SESSION TOKEN"}), 401

    # get user from token
    user = User.objects(email=payload["email"]).first()

    # if a user was not found
    if not user:
        return jsonify({"error": "User not found"}), 404

    # fetch the product
    try:
        product = Product.objects.get(id=product_id)
    except DoesNotExist:
        return jsonify({"error": "Product not found"}), 404

    # check if product is in user's cart
    for item in user.cart_items:
        if str(item.product_id.id) == product_id:
            item.quantity += quantity
            user.update_cart_total()
            return jsonify(
                {
                    "message": "Product quantity updated",
                    "total": user.cart_total,
                }
            ), 200

    # otherwise create new cart item and add to user cart
    new_item = CartItem(product_id=product, quantity=quantity)

    user.cart_items.append(new_item)

    user.update_cart_total()
    return jsonify(
        {
            "message": "Product added to cart",
            "total": user.cart_total,
        }
    ), 201


# Edit a specific cart item's quantity
@cart.route("/<product_id>", methods=["PATCH"])
def edit_cart_item_quantity(product_id):
    data = request.json
    token = request.headers.get("Authorization")
    new_quantity = data["quantity"]

    if not token:
        return jsonify({"error": "NO SESSION TOKEN"}), 401
    payload = get_user_from_token(token)

    if new_quantity < 0:
        return jsonify({"error": "Quantity cannot be less than 0"})

    # get user from payload
    if not payload:
        return jsonify({"error": "INVALID SESSION TOkEN"}), 401

    user = User.objects(email=payload["email"]).first()

    if not user:
        return jsonify({"error": "User not found"}), 404

    try:
        for item in user.cart_items:
            if str(item.product_id.id) == product_id:
                item.quantity = new_quantity
                user.update_cart_total()
                return jsonify({"message": "Product quantity updated"}), 200
        return jsonify({"error editing item quantity": "item not in cart"}), 500
    except Exception as e:
        return jsonify({"error editing cart item quantity": str(e)}), 500


@cart.route("/<product_id>", methods=["DELETE"])
def remove_cart_item(product_id):
    token = request.headers.get("Authorization")

    if not token:
        return jsonify({"error": "NO SESSION TOKEN"}), 401
    payload = get_user_from_token(token)

    # get user from payload
    if not payload:
        return jsonify({"error": "INVALID SESSION TOkEN"}), 401

    user = User.objects(email=payload["email"]).first()

    if not user:
        return jsonify({"error": "User not found"}), 404

    try:
        user.cart_items = [
            item for item in user.cart_items if str(item.product_id.id) != product_id
        ]
        user.update_cart_total()
        return jsonify({"message": "Product removed successfully"}), 200
    except Exception as e:
        return jsonify({"error removing item from cart": str(e)}), 500


@cart.route("/", methods=["DELETE"])
def clear_cart():
    token = request.headers.get("Authorization")

    if not token:
        return jsonify({"error": "NO SESSION TOKEN"}), 401
    payload = get_user_from_token(token)

    # get user from payload
    if not payload:
        return jsonify({"error": "INVALID SESSION TOkEN"}), 401

    user = User.objects(email=payload["email"]).first()

    if not user:
        return jsonify({"error": "User not found"}), 404

    user.cart_items = []
    user.update_cart_total()
    return jsonify({"message": "Cleared cart successfully"}), 200
