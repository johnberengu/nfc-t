import React, { useState } from 'react';
import { motion } from 'motion/react';
import { NFCCheckInAnimation } from "./components/pages/NFCCheckInAnimation";
import { VisitorCheckIn } from "./components/pages/VisitorCheckIn";
import { StaffDashboard } from "./components/pages/StaffDashboard";
import { StaffLogin, StaffMember } from "./components/pages/StaffLogin";
import { Button } from "./components/ui/button";
// import logo from 'figma:asset/32ded43d0037d2aa8f97f9b6648ca70b2d6d598c.png'; 

import { Users, Shield } from 'lucide-react';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate
} from 'react-router-dom';


interface Visitor {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  department: string;
  staff: string;
  purpose: string;
  timestamp: string;
  status: 'pending' | 'approved' | 'declined';
  declineReason?: string;
  declineCategory?: string;
  approvedBy?: string;
  declinedBy?: string;
  appointmentTime?: string;
  appointmentDate?: string;
}



function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
  
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-500 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-blue-300 rounded-full blur-2xl"></div>
      </div>


     
      <header className="relative z-10 p-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          

          <div>
            <h1 className="text-2xl font-semibold text-slate-800">NFC SecureVisit</h1>
            <p className="text-slate-600">Secure Visitor Check-In</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm text-slate-600">
          <span>Secure</span>
          <span>•</span>
          <span>Contactless</span>
          <span>•</span>
          <span>Instant</span>
        </div>
      </header>

      
      <main className="relative z-10 flex-1 flex items-center justify-center px-8">
        <NFCCheckInAnimation />
      </main>

      {/* Action Buttons */}
      <div className="relative z-10 flex justify-center gap-4 px-8 mb-8">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={() => navigate('/checkin')}
            className="flex items-center gap-2 px-6 py-3 text-white rounded-lg shadow-lg"
            style={{ backgroundColor: '#4162D9' }}
          >
            <Users className="w-5 h-5" />
            Start Check-in
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={() => navigate('/staff-login')}
            variant="outline"
            className="flex items-center gap-2 px-6 py-3 border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg shadow-lg"
          >
            <Shield className="w-5 h-5" />
            Staff Dashboard
          </Button>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 p-8 text-center">
        <p className="text-slate-500">Simply tap your phone on the station to check in</p>
        <div className="flex justify-center gap-2 mt-4">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
          <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
        </div>
      </footer>
    </div>
  );
}

import { useEffect } from 'react';

function App() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [currentStaff, setCurrentStaff] = useState<StaffMember | null>(null);

  const navigate = useNavigate();

  // Fetch visitors from backend on mount
  useEffect(() => {
    async function fetchVisitors() {
      try {
        const response = await fetch('http://127.0.0.1:5000/staffdashboard/checkins', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
            // Add auth token if required
          }
        });
        if (response.ok) {
          const data = await response.json();
          setVisitors(data);
        } else {
          console.error('Failed to fetch visitors');
        }
      } catch (error) {
        console.error('Error fetching visitors:', error);
      }
    }
    fetchVisitors();
  }, []);

  const handleVisitorSubmit = (visitorData: Visitor) => {
    setVisitors(prev => [...prev, visitorData]);
    navigate('/');
  };

  const handleStaffLogin = (staffData: StaffMember) => {
    setCurrentStaff(staffData);
    navigate('/dashboard');
  };

  const handleStaffLogout = () => {
    setCurrentStaff(null);
    navigate('/');
  };

  const handleUpdateVisitor = async (
    id: string,
    status: 'approved' | 'declined',
    reason?: string,
    category?: string,
    appointmentDate?: string,
    appointmentTime?: string
  ) => {
    if (!currentStaff) return;

    const payload: any = {
      status,
    };

    if (status === 'approved') {
      payload.appointmentDate = appointmentDate;
      payload.appointmentTime = appointmentTime;
    } else if (status === 'declined') {
      payload.declineReason = reason;
      payload.declineCategory = category;
    }

    try {
      const response = await fetch(`http://127.0.0.1:5000/staffdashboard/checkins/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
  
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setVisitors(prev =>
          prev.map(visitor =>
            visitor.id === id ? result.data : visitor
          )
        );
      } else {
        console.error('Failed to update visitor', result.error || '');
        // Optionally show user feedback for failure
      }
    } catch (error: any) {
      console.error('Error updating visitor', error.message);
      // Optionally show user feedback for error
    }
  };

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/checkin"
        element={<VisitorCheckIn onBack={() => navigate(-1)} onSubmit={handleVisitorSubmit} />}
      />
      <Route
        path="/staff-login"
        element={<StaffLogin onBack={() => navigate(-1)} onLogin={handleStaffLogin} />}
      />
      <Route
        path="/dashboard"
        element={
          currentStaff ? (
            <StaffDashboard
              onBack={handleStaffLogout}
              visitors={visitors}
              onUpdateVisitor={handleUpdateVisitor}
              currentStaff={currentStaff}
            />
          ) : (
            <Navigate to="/staff-login" replace />
          )
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

