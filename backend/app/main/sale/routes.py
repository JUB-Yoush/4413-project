from flask import render_template, redirect, url_for, request, jsonify
import datetime
import jwt
from . import sale
import bcrypt
from app.models import Product, Sale, Purchase
from mongoengine import Q
from ...auth.session import admin_required, get_user_from_token, get_referenced_user


@sale.route("/history", methods=["GET"])
@admin_required
def get_sales():
    try:
        # get query parameters for filtering, sorting, and searching
        date = request.args.get("date")
        user = request.args.get("user_id")
        product = request.args.get("product")
        total_price = request.args.get("total_price")
        sort_by = request.args.get("sort_by", "name")
        order = request.args.get("order", "asc")
        # query would have to look through every purchase in the sale, to get the purchases purchased.
        # build query
        query = Q()
        if date:
            query &= Q(date__like=date)
        if user:
            query &= Q(user__icontains=user)
        if product:
            query &= Q(product__like=product)
        if total_price:
            query &= Q(price__eq=float(total_price))

        purchases = Sale.objects().all()
        # purchases = Sale.objects(query)
        # # sort results
        # sort_order = 1 if order == "asc" else -1
        # purchases = purchases.order_by(f"{'-' if sort_order == -1 else ''}{sort_by}")

        purchases_json = []
        for product in purchases:
            purchases_json.append(product.json_formatted())

        return jsonify({"purchases": purchases_json}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@sale.route("/<sale_id>", methods=["GET"])
@admin_required
def get_sale(sale_id):
    try:
        sale = Sale.objects.get(id=sale_id)
        return jsonify(sale.json_formatted()), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# you can make sales if you aren't logged in (TODO)
@sale.route("/", methods=["POST"])
def make_sale():
    token = request.headers.get("Authorization")
    payload = get_user_from_token(token)
    user = get_referenced_user(payload)
    try:
        sale = Sale(
            date=datetime.date.today(),
            user=user,
            purchases=user.cart_items,
            approved=True,
        )
        sale.save()
        return jsonify({"message": "sale recorded"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
