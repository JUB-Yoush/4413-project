from flask import Blueprint

main = Blueprint("main", __name__)

from .user import user as user_blueprint
from .catalog import catalog as catalog_blueprint

from .sale import sale as sale_blueprint
from .cart import cart as cart_blueprint
from .checkout import checkout as checkout_blueprint

main.register_blueprint(user_blueprint)
main.register_blueprint(catalog_blueprint)
main.register_blueprint(cart_blueprint)
main.register_blueprint(sale_blueprint)
main.register_blueprint(checkout_blueprint)

from . import routes
