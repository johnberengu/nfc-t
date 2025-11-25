import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { ArrowLeft, User, Mail, Phone, Building, Users, FileText } from 'lucide-react';

interface VisitorCheckInProps {
  onBack: () => void;
  onSubmit: (visitorData: any) => void;
}

const departments = {
  'Engineering': ['John Smith', 'Sarah Johnson', 'Mike Chen', 'Emily Davis'],
  'Sales': ['Robert Wilson', 'Lisa Anderson', 'David Brown', 'Jennifer Taylor'],
  'Marketing': ['Chris Garcia', 'Amanda Martinez', 'Kevin Lee', 'Rachel White'],
  'HR': ['Maria Rodriguez', 'James Thompson', 'Anna Kim', 'Daniel Jackson'],
  'Finance': ['Michelle Lewis', 'Thomas Walker', 'Jessica Hall', 'Mark Allen']
};

export function VisitorCheckIn({ onBack, onSubmit }: VisitorCheckInProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    department: '',
    staff: '',
    purpose: ''
  });

  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [availableStaff, setAvailableStaff] = useState<string[]>([]);
  const [submissionStatus, setSubmissionStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleDepartmentChange = (value: string) => {
    setSelectedDepartment(value);
    setAvailableStaff(departments[value as keyof typeof departments] || []);
    setFormData(prev => ({ ...prev, department: value, staff: '' }));
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionStatus(null);

    if (!formData.fullName || !formData.email || !formData.department) {
      setSubmissionStatus({ type: 'error', message: 'Please fill in all required fields.' });
      return;
    }

    const payload = {
      ...formData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      status: 'pending'
    };

    try {
      const response = await fetch('http://127.0.0.1:5000/checkin/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmissionStatus({ type: 'success', message: 'Check-in request submitted successfully!' });
        // onSubmit && onSubmit(result.data);
        // Reset form
        setFormData({ fullName: '', email: '', phone: '', department: '', staff: '', purpose: '' });
        setSelectedDepartment('');
        setAvailableStaff([]);
      } else {
        setSubmissionStatus({ type: 'error', message: 'Failed to submit check-in request: ' + (result.error || 'Unknown error') });
      }
    } catch (error: any) {
      setSubmissionStatus({ type: 'error', message: 'Network or server error: ' + error.message });
    }

    // Auto-clear message after 5 seconds
    setTimeout(() => setSubmissionStatus(null), 5000);
  };

  const multipleImages: string[] = []; // Example images array

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-800"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </div>

          <Card className="bg-white shadow-xl border-0">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl text-slate-800">Visitor Check-in</CardTitle>
              <p className="text-slate-600 mt-2">Please fill in your details to register your visit</p>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="flex items-center gap-2 text-slate-700">
                    <User className="w-4 h-4 text-purple-600" />
                    Full Name *
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className="border-slate-200 focus:border-purple-500 focus:ring-purple-500"
                    required
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2 text-slate-700">
                    <Mail className="w-4 h-4 text-purple-600" />
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="border-slate-200 focus:border-purple-500 focus:ring-purple-500"
                    required
                  />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2 text-slate-700">
                    <Phone className="w-4 h-4 text-purple-600" />
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="border-slate-200 focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>

                {/* Department */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-slate-700">
                    <Building className="w-4 h-4 text-purple-600" />
                    Department *
                  </Label>
                  <Select onValueChange={handleDepartmentChange} required>
                    <SelectTrigger className="border-slate-200 focus:border-purple-500 focus:ring-purple-500">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(departments).map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Staff */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-slate-700">
                    <Users className="w-4 h-4 text-purple-600" />
                    Staff/Employee
                  </Label>
                  <Select
                    onValueChange={(value) => handleInputChange('staff', value)}
                    disabled={!selectedDepartment}
                  >
                    <SelectTrigger className="border-slate-200 focus:border-purple-500 focus:ring-purple-500">
                      <SelectValue placeholder={selectedDepartment ? "Select staff member" : "Select department first"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="not-sure">Not Sure</SelectItem>
                      {availableStaff.map((staff) => (
                        <SelectItem key={staff} value={staff}>
                          {staff}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Purpose */}
                <div className="space-y-2">
                  <Label htmlFor="purpose" className="flex items-center gap-2 text-slate-700">
                    <FileText className="w-4 h-4 text-purple-600" />
                    Purpose of Visit
                  </Label>
                  <Textarea
                    id="purpose"
                    placeholder="Briefly describe the purpose of your visit"
                    value={formData.purpose}
                    onChange={(e) => handleInputChange('purpose', e.target.value)}
                    className="border-slate-200 focus:border-purple-500 focus:ring-purple-500 resize-none"
                    rows={3}
                  />
                </div>

                {/* Submit Button */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="pt-4"
                >
                  <Button
                    type="submit"
                    className="w-full py-3 text-white rounded-lg transition-all duration-200"
                    style={{ backgroundColor: '#4162D9' }}
                    disabled={!formData.fullName || !formData.email || !formData.department}
                  >
                    Submit Check-in Request
                  </Button>
                </motion.div>
              </form>

              {/* Submission Status Alert */}
              {submissionStatus && (
                <div
                  className={`mt-4 p-3 text-center rounded ${
                    submissionStatus.type === 'success'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {submissionStatus.message}
                </div>
              )}

              {/* Multiple Images Display */}
              <div className="mt-8 flex justify-center gap-6">
                {multipleImages.map((src, index) => (
                  <img
                    key={index}
                    src={src}
                    alt={`image-${index + 1}`}
                    className="w-24 h-24 object-contain rounded-md shadow-md"
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center mt-8 text-slate-500 text-sm">
            <p>Your information is secure and will only be used for visitor management purposes.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
