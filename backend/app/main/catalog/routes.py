from flask import render_template, redirect, url_for, request, jsonify
import datetime
import jwt
from . import catalog
import bcrypt
from app.models import Product
from mongoengine import Q
from ...auth.session import admin_required


@catalog.route("/products", methods=["GET"])
def get_products():
    try:
        # get query parameters for filtering, sorting, and searching
        category = request.args.get("category")
        brand = request.args.get("brand")
        album = request.args.get("album")
        name = request.args.get("name")
        min_price = request.args.get("min_price")
        max_price = request.args.get("max_price")
        sort_by = request.args.get("sort_by", "name")
        order = request.args.get("order", "asc")

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
            products_json.append(product.json_formatted())

        return jsonify({"products": products_json}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@catalog.route("/products", methods=["POST"])
@admin_required
def add_product():
    data = request.json
    try:
        new_product = Product(
            name=data["name"],
            category=data["category"],
            brand=data["brand"],
            album=data["album"],
            quantity=data.get("quantity", 0),
            price=data["price"],
            description=data["description"],
            image_url=data["image_url"],
        )
        new_product.save()
        return jsonify({"message": "Product added successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@catalog.route("/products/<product_id>", methods=["GET"])
def get_product(product_id):
    try:
        product = Product.objects.get(id=product_id)
        return jsonify(product.json_formatted()), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@catalog.route("/products/<product_id>", methods=["PATCH"])
@admin_required
def edit_product(product_id):
    data = request.json
    try:
        product = Product.objects.get(id=product_id)
        for key, value in data.items():
            if hasattr(product, key):
                setattr(product, key, value)
        product.save()
        return jsonify({"message": "updated product"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
