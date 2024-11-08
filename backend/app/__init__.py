from flask import Flask
from flask_cors import CORS, cross_origin
from database import get_database


def create_app():
    print("creating blueprint")
    app = Flask(__name__)
    cors = CORS(app)
    app.config["CORS_HEADERS"] = "Content-Type"

    # start db connection
    get_database()

    from .auth import auth as auth_blueprint

    app.register_blueprint(auth_blueprint)

    from .main import main as main_blueprint

    app.register_blueprint(main_blueprint)
    return app
