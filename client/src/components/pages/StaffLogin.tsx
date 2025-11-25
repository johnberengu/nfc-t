import { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { ArrowLeft, User, Lock, Shield, AlertCircle } from 'lucide-react';

interface StaffLoginProps {
  onBack: () => void;
  onLogin: (staffData: StaffMember) => void;
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
}

// Mock staff database - in production, this would be in a secure backend
const mockStaffDatabase = [
  { username: 'admin', password: 'admin123', name: 'Admin User', email: 'admin@company.com', department: 'Administration', role: 'Admin' },
  { username: 'security', password: 'sec123', name: 'Security Officer', email: 'security@company.com', department: 'Security', role: 'Security Officer' },
  { username: 'manager', password: 'mgr123', name: 'John Manager', email: 'john@company.com', department: 'Engineering', role: 'Manager' },
  { username: 'hr', password: 'hr123', name: 'Sarah HR', email: 'sarah@company.com', department: 'HR', role: 'Manager' },
];

export function StaffLogin({ onBack, onLogin }: StaffLoginProps) {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.username && formData.password) {
      setIsLoading(true);
      setError('');
      
      // Simulate login process
      setTimeout(() => {
        const staffMember = mockStaffDatabase.find(
          staff => staff.username === formData.username && staff.password === formData.password
        );
        
        if (staffMember) {
          const loggedInStaff: StaffMember = {
            id: Date.now().toString(),
            name: staffMember.name,
            email: staffMember.email,
            department: staffMember.department,
            role: staffMember.role
          };
          
          onLogin(loggedInStaff);
        } else {
          setError('Invalid username or password');
        }
        setIsLoading(false);
      }, 1000);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(''); // Clear error when user starts typing
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
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

          {/* Main Login Card */}
          <Card className="bg-white shadow-xl border-0">
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
              <CardTitle className="text-2xl text-slate-800">Staff Login</CardTitle>
              <p className="text-slate-600 mt-2">Enter your details to access the dashboard</p>
            </CardHeader>

            <CardContent className="space-y-6">
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Username */}
                <div className="space-y-2">
                  <Label htmlFor="username" className="flex items-center gap-2 text-slate-700">
                    <User className="w-4 h-4 text-purple-600" />
                    Username *
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    className="border-slate-200 focus:border-purple-500 focus:ring-purple-500"
                    required
                  />
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="flex items-center gap-2 text-slate-700">
                    <Lock className="w-4 h-4 text-purple-600" />
                    Password *
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="border-slate-200 focus:border-purple-500 focus:ring-purple-500"
                    required
                  />
                </div>

                {/* Login Button */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="pt-4"
                >
                  <Button
                    type="submit"
                    className="w-full py-3 text-white rounded-lg transition-all duration-200"
                    style={{ backgroundColor: '#4162D9' }}
                    disabled={!formData.username || !formData.password || isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Logging in...
                      </div>
                    ) : (
                      'Access Dashboard'
                    )}
                  </Button>
                </motion.div>
              </form>
            </CardContent>
          </Card>

          {/* Demo Credentials */}
          {/* <div className="mt-8 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <h3 className="text-sm font-medium text-slate-800 mb-2">Demo Credentials:</h3>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
              <div>admin / admin123</div>
              <div>security / sec123</div>
              <div>manager / mgr123</div>
              <div>hr / hr123</div>
            </div>
          </div> */}

          {/* Footer */}
          <div className="text-center mt-4 text-slate-500 text-sm">
            <p>This login is for demonstration purposes only.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}