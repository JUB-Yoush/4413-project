from flask import Blueprint

catalog_bp = Blueprint('catalog', __name__, url_prefix='/catalog')

from . import routes