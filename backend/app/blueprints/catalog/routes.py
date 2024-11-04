from bson import ObjectId
from flask import jsonify, request
from . import catalog_bp
from app.extensions import mongo

@catalog_bp.route('/products', methods=['GET'])
def get_products():
    products_db = mongo.db.products
    try:
        # get query parameters for filtering, sorting, and searching
        category = request.args.get('category')
        brand = request.args.get('brand')
        album = request.args.get('album')
        name = request.args.get('name')
        min_price = request.args.get('min_price')
        max_price = request.args.get('max_price')
        sort_by = request.args.get('sort_by', 'name')
        order = request.args.get('order', 'asc')

        # build query
        query = {}
        if category:
            query['category'] = {'$regex': category, '$options': 'i'}
        if brand:
            query['brand'] = {'$regex': brand, '$options': 'i'}
        if album:
            query['album'] = {'$regex': album, '$options': 'i'}
        if name:
            query['name'] = {'$regex': name, '$options': 'i'}
        if min_price:
            query['price'] = {'$gte': float(min_price)}
        if max_price:
            query['price'] = {'$lte': float(max_price)}

        # build sort criteria
        sort_order = 1 if order == 'asc' else -1
        sort_criteria = [(sort_by, sort_order)]

        # fetch products from the database
        products = list(products_db.find(query).sort(sort_criteria))

        # convert ObjectId to string for JSON serialization
        for product in products:
            product['_id'] = str(product['_id'])
        return jsonify({"products": products})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@catalog_bp.route('/products', methods=['POST'])
def add_product():
    products_db = mongo.db.products
    data = request.json
    try:
        products_db.insert_one({
            'name': data['name'],
            'category': data['category'],
            'brand': data['brand'],
            'album': data['album'],
            'quantity': data.get('quantity', 0),
            'price': data['price'],
            'description': data['description'],
            'image_url': data['image_url']
            
        })
        return jsonify({'message': 'Product added successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@catalog_bp.route('/products/<product_id>', methods=['GET'])
def get_product(product_id):
    products_db = mongo.db.products
    try:
        product = products_db.find_one({'_id': ObjectId(product_id)})
        if product:
            product['_id'] = str(product['_id'])
            return jsonify(product)
        else:
            return jsonify({'error': 'Product not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500