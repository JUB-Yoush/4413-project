from flask import Blueprint

cart = Blueprint("cart", __name__, url_prefix="/cart")

from . import routes
