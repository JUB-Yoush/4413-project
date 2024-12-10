from flask import render_template, redirect, url_for, request, jsonify
from datetime import datetime, timedelta
import jwt
from . import sale
import bcrypt
from app.models import Product, Sale, User
from mongoengine import Q
from ...auth.session import (
    admin_required,
    get_user_from_token,
    get_referenced_user,
    user_or_admin_required,
    user_required,
)


@sale.route("/history", methods=["GET"])
@admin_required
def get_sales():
    try:
        # get query parameters for filtering, sorting, and searching
        date = request.args.get("date")
        user_email = request.args.get("user_email")
        product_name = request.args.get("product_name")
        total_price = request.args.get("total_price")
        sort_by = request.args.get("sort_by", "name")
        order = request.args.get("order", "asc")
        print(
            f"Query params: {date}\n {user_email} \n {product_name} \n {total_price} \n {sort_by} \n {order}"
        )
        # build query
        query = Q()
        #query a specific day
        if date:
            date = datetime.strptime(date, "%Y-%m-%d")  # Adjust format as needed
            start_of_day = date
            end_of_day = date + timedelta(days=1)
            query &= Q(date__gte=start_of_day, date__lt=end_of_day)  # Use range query
        if user_email:
            user = User.objects(email=user_email).first()
            query &= Q(user=user.id)
        if total_price:
            query &= Q(total_price=float(total_price))
        if product_name:
            product = Product.objects(name=product_name).first()
            query &= Q(purchases__product_id=product.id)

        sales = Sale.objects(query)
        print(sales)
        # sort results
        sort_order = 1 if order == "asc" else -1
        sales = sales.order_by(f"{'-' if sort_order == -1 else ''}{sort_by}")

        sales_json = []
        print("formatting sales")
        for sale in sales:
            sales_json.append(sale.json_formatted())

        return jsonify({"sales": sales_json}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@sale.route("/orders", methods=["GET"])
@user_required
def get_my_orders():
    token = request.headers.get("Authorization")
    payload = get_user_from_token(token)
    user = get_referenced_user(payload)
    try:
        # get query parameters for filtering, sorting, and searching
        date = request.args.get("date")
        product_name = request.args.get("product_name")
        total_price = request.args.get("total_price")
        sort_by = request.args.get("sort_by", "name")
        order = request.args.get("order", "asc")
        print(
            f"Query params: {date}\n {product_name} \n {total_price} \n {sort_by} \n {order}"
        )
        # build query
        query = Q()
        # query &= Q(user__like=user)
        # query a specific day
        if date:
            date = datetime.strptime(date, "%Y-%m-%d")  # Adjust format as needed
            start_of_day = date
            end_of_day = date + timedelta(days=1)
            query &= Q(date__gte=start_of_day, date__lt=end_of_day)  # Use range query
        if total_price:
            query &= Q(total_price=float(total_price))
        if product_name:
            product = Product.objects(name=product_name).first()
            query &= Q(purchases__product_id=product.id)

        sales = Sale.objects(query)
        print(sales)
        # sort results
        sort_order = 1 if order == "asc" else -1
        sales = sales.order_by(f"{'-' if sort_order == -1 else ''}{sort_by}")

        sales_json = []
        print("formatting sales")
        for sale in sales:
            if sale.user.id == user.id:
                sales_json.append(sale.json_formatted())

        return jsonify({"sales": sales_json}), 201
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


@sale.route("/", methods=["POST"])
@user_or_admin_required
def make_sale():
    token = request.headers.get("Authorization")
    payload = get_user_from_token(token)
    user = get_referenced_user(payload)
    try:
        sale = Sale(
            date=datetime.date.today(),
            user=user,
            total_price=user.cart_total,
            purchases=user.cart_items,
            approved=True,
        )
        sale.save()
        # clear a user's cart after a order

        return jsonify({"message": "sale recorded"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
