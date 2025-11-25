from flask import Blueprint, request, jsonify
from flask_cors import CORS
from models.checkin import Checkin
from models import db
from datetime import date

staffdashboard_bp = Blueprint('staffdashboard_bp', __name__)
CORS(staffdashboard_bp, origins=["http://localhost:3000"], supports_credentials=True)

@staffdashboard_bp.route('/checkins', methods=['GET'])

def get_checkins():
    checkins = Checkin.query.all()
    return jsonify([c.to_dict() for c in checkins])


@staffdashboard_bp.route('/checkins/<id>', methods=['PUT'])
def update_checkin(id):
    data = request.json
    checkin = Checkin.query.filter_by(id=id).first()

    if not checkin:
        return jsonify({"message": "Checkin not found"}), 404

    # Update fields
    status = data.get('status')

    if status:
        checkin.status = status

        # Auto-update inside status
        if status == "approved":
            checkin.is_inside = True
        if status == "declined":
            checkin.is_inside = False

    try:
        db.session.commit()
        return jsonify({"success": True, "data": checkin.to_dict()})
    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "error": str(e)}), 500


# Pending Approvals
@staffdashboard_bp.route('/stats/pending', methods=['GET'])
def pending_approvals():
    count = Checkin.query.filter_by(status="pending").count()
    return jsonify({"pending": count})



# Approved Today
@staffdashboard_bp.route('/stats/approved-today', methods=['GET'])
def approved_today():
    today = date.today()
    count = Checkin.query.filter(
        Checkin.status == "approved",
        db.func.date(Checkin.updated_at) == today
    ).count()
    return jsonify({"approved_today": count})



# Currently Inside
@staffdashboard_bp.route('/stats/inside', methods=['GET'])
def currently_inside():
    count = Checkin.query.filter_by(is_inside=True).count()
    return jsonify({"inside": count})


# Declined Today
@staffdashboard_bp.route('/stats/declined-today', methods=['GET'])
def declined_today():
    today = date.today()
    count = Checkin.query.filter(
        Checkin.status == "declined",
        db.func.date(Checkin.updated_at) == today
    ).count()
    return jsonify({"declined_today": count})

@staffdashboard_bp.route("/pending_count", methods=["GET"])
def pending_count():
    count = Checkin.query.filter_by(status="pending").count()
    return jsonify({"count": count})


