from flask import Blueprint

from routes.auth_routes import auth_bp
from routes.checkin_routes import checkin_bp
from routes.staffdashboard_routes import staffdashboard_bp

def register_routes(app):
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(checkin_bp, url_prefix="/api/checkin")
    app.register_blueprint(staffdashboard_bp, url_prefix="/api/staffdashboard")
    
