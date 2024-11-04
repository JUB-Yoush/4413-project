from app.blueprints.catalog import catalog_bp

def register_blueprints(app):
    app.register_blueprint(catalog_bp)