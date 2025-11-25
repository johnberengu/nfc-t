from flask import Flask
from flask_cors import CORS
from models import db

# Import blueprints
from routes.auth_routes import auth_bp
from routes.checkin_routes import checkin_bp
from routes.staffdashboard_routes import staffdashboard_bp

def create_app():
    app = Flask(__name__)

    # -------- CORS --------
    CORS(app, resources={r"/*": {"origins": "*"}})

    # -------- Database --------
    app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://nfc_xe7v_user:5sl4cDyOouQldaPvT9Znxx4yEaAN0jSr@dpg-d4ipajnpm1nc73cru6f0-a.render.com:5432/nfc_xe7v"
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = "your_secret_key_here"

    db.init_app(app)

    # -------- Blueprints --------
    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(checkin_bp, url_prefix="/checkin")
    app.register_blueprint(staffdashboard_bp, url_prefix="/staffdashboard")

    # -------- Home Route --------
    @app.route("/")
    def home():
        return "<h1>Hello World!</h1>"

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
