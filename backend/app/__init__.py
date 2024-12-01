from flask import Flask
from flask_cors import CORS, cross_origin
from database import get_database


def create_app(testing=False):
    print("creating blueprint")
    app = Flask(__name__)
    cors = CORS(app, supports_credentials=True, resources={r"/*": {"origins": "http://localhost:3000"}}),
    app.config["CORS_HEADERS"] = "Content-Type"
    app.config["TESTING"] = testing

    from .tests import tests as test_blueprint

    app.register_blueprint(test_blueprint)
    # start db connection
    from .auth import auth as auth_blueprint

    app.register_blueprint(auth_blueprint)

    from .main import main as main_blueprint

    app.register_blueprint(main_blueprint)

    get_database(app)

    return app
