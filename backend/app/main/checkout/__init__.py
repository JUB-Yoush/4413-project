from flask import Blueprint

checkout = Blueprint("checkout", __name__, url_prefix="/checkout")

from . import routes
