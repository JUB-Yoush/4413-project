from flask import Flask
from app.config import Config
from app.extensions import mongo, cors
from app.blueprints import register_blueprints

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions
    mongo.init_app(app)
    cors.init_app(app)

    # Register blueprints
    register_blueprints(app)

    return app