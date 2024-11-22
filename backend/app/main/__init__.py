from flask import Blueprint

main = Blueprint("main", __name__)

from .user import user as user_blueprint
from .catalog import catalog as catalog_blueprint
from .cart import cart as cart_blueprint

main.register_blueprint(user_blueprint)
main.register_blueprint(catalog_blueprint)
main.register_blueprint(cart_blueprint)
from . import routes
