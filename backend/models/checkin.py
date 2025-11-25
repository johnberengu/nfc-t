from datetime import datetime
from . import db

class Checkin(db.Model):
    __tablename__ = 'checkins'

    id = db.Column(db.String, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20))
    department = db.Column(db.String(50), nullable=False)
    staff = db.Column(db.String(100))
    purpose = db.Column(db.String(255))
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    status = db.Column(db.String(20), default='pending')
    is_inside = db.Column(db.Boolean, default=False)

    decline_reason = db.Column(db.String(255))
    decline_category = db.Column(db.String(100))
    approved_by = db.Column(db.String(100))
    declined_by = db.Column(db.String(100))

    appointment_date = db.Column(db.String(20))
    appointment_time = db.Column(db.String(20))

    def to_dict(self):
        return {
            'id': self.id,
            'fullName': self.full_name,
            'email': self.email,
            'phone': self.phone,
            'department': self.department,
            'staff': self.staff,
            'purpose': self.purpose,
            'timestamp': self.timestamp.isoformat() if self.timestamp else None,
            'updatedAt': self.updated_at.isoformat() if self.updated_at else None,
            'status': self.status,
            'isInside': self.is_inside,
            'declineReason': self.decline_reason,
            'declineCategory': self.decline_category,
            'approvedBy': self.approved_by,
            'declinedBy': self.declined_by,
            'appointmentDate': self.appointment_date,
            'appointmentTime': self.appointment_time
        }
