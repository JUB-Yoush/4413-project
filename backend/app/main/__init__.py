from flask import Blueprint

main = Blueprint("main", __name__)

from .user import user as user_blueprint
from .catalog import catalog as catalog_blueprint

main.register_blueprint(user_blueprint)
main.register_blueprint(catalog_blueprint)

from . import routes
