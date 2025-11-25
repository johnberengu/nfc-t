import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { DeclineReasonDialog } from './DeclineReasonDialog';
import { AppointmentTimeDialog } from './AppointmentTimeDialog';
import { StaffMember } from './StaffLogin';
import { 
  ArrowLeft, 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye,
  UserCheck,
  UserX,
  Building,
  LogOut,
  User
} from 'lucide-react';

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

interface StaffDashboardProps {
  onBack: () => void;
  visitors: Visitor[];
  onUpdateVisitor: (
    id: string, 
    status: 'approved' | 'declined', 
    reason?: string, 
    category?: string,
    appointmentDate?: string,
    appointmentTime?: string
  ) => void;
  currentStaff: StaffMember | null;
}

export function StaffDashboard({ onBack, visitors, onUpdateVisitor, currentStaff }: StaffDashboardProps) {
  // Separate visitors by status
  const [pendingVisitors, setPendingVisitors] = useState<Visitor[]>([]);
  const [approvedVisitors, setApprovedVisitors] = useState<Visitor[]>([]);
  const [declinedVisitors, setDeclinedVisitors] = useState<Visitor[]>([]);

  const [stats, setStats] = useState({
    totalRegistered: 0,
    pending: 0,
    approvedToday: 0,
    currentlyInside: 0,
    declinedToday: 0
  });

  const [declineDialog, setDeclineDialog] = useState<{
    isOpen: boolean;
    visitorId: string;
    visitorName: string;
  }>({
    isOpen: false,
    visitorId: '',
    visitorName: ''
  });

  const [appointmentDialog, setAppointmentDialog] = useState<{
    isOpen: boolean;
    visitorId: string;
    visitorName: string;
  }>({
    isOpen: false,
    visitorId: '',
    visitorName: ''
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const pendingRes = await fetch('http://127.0.0.1:5000/staffdashboard/stats/pending');
        const approvedRes = await fetch('http://127.0.0.1:5000/staffdashboard/stats/approved-today');
        const insideRes = await fetch('http://127.0.0.1:5000/staffdashboard/stats/inside');
        const declinedRes = await fetch('http://127.0.0.1:5000/staffdashboard/stats/declined-today');

        if (
          pendingRes.ok &&
          approvedRes.ok &&
          insideRes.ok &&
          declinedRes.ok
        ) {
          const pendingData = await pendingRes.json();
          const approvedData = await approvedRes.json();
          const insideData = await insideRes.json();
          const declinedData = await declinedRes.json();

          setStats({
            pending: pendingData.pending,
            approvedToday: approvedData.approved_today,
            currentlyInside: insideData.inside,
            declinedToday: declinedData.declined_today,
            totalRegistered: visitors.length
          });
        } else {
          console.error('Failed to fetch some stats');
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, [visitors]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Pending</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Approved</Badge>;
      case 'declined':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Declined</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDeclineClick = (visitorId: string, visitorName: string) => {
    setDeclineDialog({
      isOpen: true,
      visitorId,
      visitorName
    });
  };

  const handleDeclineConfirm = (reason: string, category: string) => {
    onUpdateVisitor(declineDialog.visitorId, 'declined', reason, category);
    setDeclineDialog({ isOpen: false, visitorId: '', visitorName: '' });
  };

  const handleDeclineCancel = () => {
    setDeclineDialog({ isOpen: false, visitorId: '', visitorName: '' });
  };

  const handleApproveClick = (visitorId: string, visitorName: string) => {
    setAppointmentDialog({
      isOpen: true,
      visitorId,
      visitorName
    });
  };

  const handleAppointmentConfirm = (date: string, time: string) => {
    onUpdateVisitor(appointmentDialog.visitorId, 'approved', undefined, undefined, date, time);
    setAppointmentDialog({ isOpen: false, visitorId: '', visitorName: '' });
  };

  const handleAppointmentCancel = () => {
    setAppointmentDialog({ isOpen: false, visitorId: '', visitorName: '' });
  };

  const StatCard = ({ title, value, icon, color }: { title: string; value: number; icon: React.ReactNode; color: string }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow duration-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm">{title}</p>
              <p className="text-2xl text-slate-800 mt-1">{value}</p>
            </div>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
              {icon}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-800"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
              <div className="h-6 w-px bg-slate-300"></div>
              <h1 className="text-xl text-slate-800">SecureVisit Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              {currentStaff && (
                <div className="flex items-center gap-3 bg-slate-50 rounded-lg px-3 py-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="text-sm">
                    <p className="text-slate-800">{currentStaff.name}</p>
                    <p className="text-slate-600">{currentStaff.department} • {currentStaff.role}</p>
                  </div>
                </div>
              )}
              <div className="text-sm text-slate-600">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
       

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <StatCard
            title="Pending Approvals"
            value={stats.pending}
            icon={<Clock className="w-6 h-6 text-orange-600" />}
            color="bg-orange-100"
          />
          <StatCard
            title="Approved Today"
            value={stats.approvedToday}
            icon={<CheckCircle className="w-6 h-6 text-green-600" />}
            color="bg-green-100"
          />
          <StatCard
            title="Currently Inside"
            value={stats.currentlyInside}
            icon={<Building className="w-6 h-6 text-blue-600" />}
            color="bg-blue-100"
          />
          <StatCard
            title="Declined Today"
            value={stats.declinedToday}
            icon={<XCircle className="w-6 h-6 text-red-600" />}
            color="bg-red-100"
          />
        </motion.div>

        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-white shadow-xl border-0">
            <CardContent className="p-0">
              <div className="px-6 py-4 border-b border-slate-200">
                <h2 className="text-lg text-slate-800">Visitor Requests</h2>
                <p className="text-slate-600 text-sm mt-1">Manage and approve visitor check-ins</p>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50">
                      <TableHead className="text-slate-700">Name</TableHead>
                      <TableHead className="text-slate-700">Email</TableHead>
                      <TableHead className="text-slate-700">Department</TableHead>
                      <TableHead className="text-slate-700">Staff</TableHead>
                      <TableHead className="text-slate-700">Purpose</TableHead>
                      <TableHead className="text-slate-700">Submitted</TableHead>
                      <TableHead className="text-slate-700">Appointment</TableHead>
                      <TableHead className="text-slate-700">Status</TableHead>
                      <TableHead className="text-slate-700">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {visitors.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8 text-slate-500">
                          <Users className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                          No visitor requests yet
                        </TableCell>
                      </TableRow>
                    ) : (
                      visitors
                        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                        .map((visitor) => (
                          <TableRow key={visitor.id} className="hover:bg-slate-50">
                            <TableCell className="text-slate-800">{visitor.fullName}</TableCell>
                            <TableCell className="text-slate-600">{visitor.email}</TableCell>
                            <TableCell className="text-slate-600">{visitor.department}</TableCell>
                            <TableCell className="text-slate-600">{visitor.staff || 'Not specified'}</TableCell>
                            <TableCell className="text-slate-600 max-w-xs truncate">
                              {visitor.purpose || 'No purpose specified'}
                            </TableCell>
                            <TableCell className="text-slate-600">{formatTime(visitor.timestamp)}</TableCell>
                            <TableCell className="text-slate-600">
                              {visitor.appointmentDate && visitor.appointmentTime ? (
                                <div className="text-sm">
                                  <div>{new Date(visitor.appointmentDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                                  <div className="text-slate-500">{visitor.appointmentTime}</div>
                                </div>
                              ) : (
                                <span className="text-slate-400">-</span>
                              )}
                            </TableCell>
                            <TableCell>{getStatusBadge(visitor.status)}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {visitor.status === 'pending' ? (
                                  <>
                                    <Button
                                      size="sm"
                                      onClick={() => handleApproveClick(visitor.id, visitor.fullName)}
                                      className="bg-purple-600 hover:bg-purple-700 text-white"
                                    >
                                      <UserCheck className="w-4 h-4 mr-1" />
                                      Accept
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleDeclineClick(visitor.id, visitor.fullName)}
                                      className="border-red-200 text-red-700 hover:bg-red-50"
                                    >
                                      <UserX className="w-4 h-4 mr-1" />
                                      Decline
                                    </Button>
                                  </>
                                ) : (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-slate-300 text-slate-700 hover:bg-slate-100"
                                  >
                                    <Eye className="w-4 h-4 mr-1" />
                                    View
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Appointment Time Dialog */}
      <AppointmentTimeDialog
        isOpen={appointmentDialog.isOpen}
        onClose={handleAppointmentCancel}
        onConfirm={handleAppointmentConfirm}
        visitorName={appointmentDialog.visitorName}
      />

      {/* Decline Reason Dialog */}
      <DeclineReasonDialog
        isOpen={declineDialog.isOpen}
        onClose={handleDeclineCancel}
        onConfirm={handleDeclineConfirm}
        visitorName={declineDialog.visitorName}
      />
    </div>
  );
}