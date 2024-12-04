

from datetime import datetime, timezone
import re
from flask import jsonify, request
from app.auth.session import (
    get_user_from_token,
    get_referenced_user,
    user_or_admin_required,
)
from app.models import Product, Sale

from . import checkout

@checkout.route("/", methods=["POST"])
@user_or_admin_required
def process_checkout():
    token = request.headers.get("Authorization")
    payload = get_user_from_token(token)
    user = get_referenced_user(payload)

    # fetch and validate cart
    if not user.cart_items:
        return jsonify({"error": "Cart is empty. Add items to proceed"}), 400
    
    # load or override billing/shipping information
    use_saved_info = request.json.get("use_saved_info", True)

    if use_saved_info:
        billing_info = {
            "address": f"{user.street}, {user.city}, {user.province}, {user.postal_code}",
            "credit_card": "1234123412341234-0129-000"
            # "credit_card": user.get_credit_card_string()
        }
        print(billing_info)
    else:
        billing_info = {
            "address": request.json.get("address"),
            "credit_card": request.json.get("credit_card")
        }
    
    if not billing_info["address"] or not billing_info["credit_card"]:
        return jsonify({"error": "Billing and shipping information are required."}), 400

    # validate inventory
    insufficient_inventory = []
    for item in user.cart_items:
        product = Product.objects.get(id=item.product_id.id)
        if item.quantity > product.quantity:
            insufficient_inventory.append(
                {
                    "product_id": str(product.id),
                    "name": product.name,
                    "requested_quantity": item.quantity,
                    "available_quantity": product.quantity,
                }
            )
    
    if insufficient_inventory:
        return jsonify(
            {
                "error": "Insufficient inventory for some items",
                "details": insufficient_inventory
            }
        ), 400
    
    payment_successful = verify_payment(billing_info["credit_card"])

    if not payment_successful:
        return jsonify(
            {"error": "Credit card authorization failed. Please retry payment"}
        ), 402
    
    for item in user.cart_items:
        product = Product.objects.get(id=item.product_id.id)
        product.quantity -= item.quantity
        product.save()
    
    order = Sale(
        date=datetime.now(timezone.utc),
        user=user,
        purchases=user.cart_items,
        approved=True
    )
    order.save()

    user.cart_items = []
    user.cart_total = 0.0

    user.save()

    order_summary = {
        "items": [
            {
                "product_id": str(item.product_id.id),
                "name": item.product_id.name,
                "quantity": item.quantity,
                "total_price": item.product_id.price * item.quantity,
            }
            for item in order.purchases
        ],
        "order_total": sum(item.product_id.price * item.quantity for item in order.purchases),
        "billing_info": billing_info
    }
    return jsonify({"message": "Order processed successfully", "order_summary": order_summary}), 201

def verify_payment(cc_string: str):
    """
    Validate credit card info against format 
    "xxxxxxxxxxxxxxxx-xxxx-xxx" 
    (16 nums, exp(mmyy),cvv), one string
    """
    pattern = r"^\d{16}-((0[1-9])|(1[0-2]))\d{2}-\d{3}$"
    if re.match(pattern, cc_string):
        return True
    return False



    