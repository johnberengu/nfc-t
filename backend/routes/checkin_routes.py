from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from models.checkin import Checkin
from models import db
import uuid
from datetime import datetime
import threading, asyncio
from notification_service import NotificationService

checkin_bp = Blueprint('checkin_bp', __name__)

notification_service = NotificationService()

# --------------------------
# Helper to run async tasks
# --------------------------
def run_async_task(async_func, *args, **kwargs):
    def wrapper():
        try:
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            print(f"🌐 Running async task: {async_func.__name__} with args {args} and kwargs {kwargs}", flush=True)
            loop.run_until_complete(async_func(*args, **kwargs))
            print(f"🌐 Async task {async_func.__name__} completed successfully", flush=True)
            loop.close()
        except Exception as e:
            print(f"❌ Exception in async task {async_func.__name__}: {e}", flush=True)
    threading.Thread(target=wrapper).start()


# --------------------------
# PUT - Update Checkin + SEND EMAIL
# --------------------------
@checkin_bp.route('/<checkin_id>', methods=['PUT'])
@cross_origin()
def update_checkin(checkin_id):
    print(f"🔥 PUT /checkins/{checkin_id} HIT", flush=True)

    data = request.json or {}
    checkin = Checkin.query.get(checkin_id)

    if not checkin:
        print("❌ Checkin not found", flush=True)
        return jsonify({"success": False, "error": "Checkin not found"}), 404

    new_status = data.get("status", checkin.status).lower()
    checkin.status = new_status
    checkin.staff = data.get("staff", checkin.staff)
    checkin.approved_by = data.get("approvedBy", checkin.approved_by)
    checkin.declined_by = data.get("declinedBy", checkin.declined_by)
    checkin.decline_reason = data.get("declineReason", checkin.decline_reason)
    checkin.decline_category = data.get("declineCategory", checkin.decline_category)

    # Logic for inside/outside
    checkin.is_inside = (new_status == "approved")

    db.session.commit()

    print(f"📬 Status changed to: {new_status}", flush=True)
    print("📤 Triggering email...", flush=True)

    # SEND EMAIL
    if new_status == "approved":
        print("▶ Calling send_approval_email", flush=True)
        run_async_task(
            notification_service.send_approval_email,
            visitor_email=checkin.email,
            visitor_name=checkin.full_name,
            staff_name=checkin.staff,
            appointment_time=f"{checkin.appointment_date} {checkin.appointment_time}",
            purpose=checkin.purpose,
            department=checkin.department
        )
        print("✔ send_approval_email called", flush=True)

    elif new_status == "declined":
        print("▶ Calling send_decline_email", flush=True)
        run_async_task(
            notification_service.send_decline_email,
            visitor_email=checkin.email,
            visitor_name=checkin.full_name,
            staff_name=checkin.staff,
            decline_reason=checkin.decline_reason or "No reason provided",
            decline_category=checkin.decline_category or "General",
            department=checkin.department
        )
        print("✔ send_decline_email called", flush=True)

    return jsonify({"success": True, "data": checkin.to_dict()})


# --------------------------
# POST - Create Checkin
# --------------------------
@checkin_bp.route('/', methods=['POST'])
@cross_origin()
def create_checkin():
    data = request.json or {}

    required = ['fullName', 'email', 'department']
    missing = [f for f in required if not data.get(f)]

    if missing:
        return jsonify({"success": False, "error": f"Missing fields: {', '.join(missing)}"}), 400

    checkin = Checkin(
        id=str(uuid.uuid4()),
        full_name=data['fullName'],
        email=data['email'],
        phone=data.get('phone'),
        department=data['department'],
        staff=data.get('staff'),
        purpose=data.get('purpose'),
        status="pending",
        is_inside=False,
        appointment_date=data.get('appointmentDate'),
        appointment_time=data.get('appointmentTime')
    )

    try:
        db.session.add(checkin)
        db.session.commit()
        print(f"✅ Checkin created: {checkin.full_name}", flush=True)
        return jsonify({"success": True, "data": checkin.to_dict()}), 201

    except Exception as e:
        db.session.rollback()
        print(f"❌ Error creating checkin: {e}", flush=True)
        return jsonify({"success": False, "error": str(e)}), 500


# --------------------------
# GET - Fetch all checkins
# --------------------------
@checkin_bp.route('/', methods=['GET'])
@cross_origin()
def get_checkins():
    checkins = Checkin.query.order_by(Checkin.timestamp.desc()).all()
    return jsonify([c.to_dict() for c in checkins])
