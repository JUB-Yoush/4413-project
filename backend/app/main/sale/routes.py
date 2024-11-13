from flask import render_template, redirect, url_for, request, jsonify
import datetime
import jwt
from . import catalog
import bcrypt
from app.models import Product, Sale, json_formatted
from mongoengine import Q
from ...auth.session import admin_required


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
        # query would have to look through every purchase in the sale, to get the products purchased.
        # build query
        query = Q()
        if category:
            query &= Q(category__icontains=category)
        if brand:
            query &= Q(brand__icontains=brand)
        if album:
            query &= Q(album__icontains=album)
        if name:
            query &= Q(name__icontains=name)
        if min_price:
            query &= Q(price__gte=float(min_price))
        if max_price:
            query &= Q(price__lte=float(max_price))

        products = Product.objects(query)
        # sort results
        sort_order = 1 if order == "asc" else -1
        products = products.order_by(f"{'-' if sort_order == -1 else ''}{sort_by}")

        products_json = []
        for product in products:
            products_json.append(json_formatted(product))

        return jsonify({"products": products_json}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@sale.route("/<sale_id>", methods=["GET"])
@admin_required
def get_sale(sale_id):
    try:
        sale = Sale.objects.get(id=sale_id)
        return jsonify(json_formatted(sale_id)), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
