import React, { useState } from 'react';
import { useAuth } from '@/contexts/authentication';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, Key, ArrowLeft } from 'lucide-react';
import axios from 'axios';

const ResetPassword = () => {
  const { state } = useAuth();
  const { user } = state;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage('New passwords do not match');
      return;
    }

    if (formData.newPassword.length < 6) {
      setMessage('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      console.log('Sending reset password request:', { // EDIT: เพิ่ม log
        currentPassword: formData.currentPassword ? '***' : 'EMPTY',
        newPassword: formData.newPassword ? '***' : 'EMPTY',
        hasToken: !!localStorage.getItem('token')
      });

      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/auth/reset-password`,
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      console.log('Response:', response.data); // EDIT: เพิ่ม log

      if (response.data.success) {
        setMessage('Password updated successfully!');
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setMessage(response.data.error || 'Failed to update password');
      }
    } catch (error) {
      console.error('Full error:', error); // EDIT: เพิ่ม log detail
      console.error('Response data:', error.response?.data); // EDIT: เพิ่ม log
      setMessage(error.response?.data?.error || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 min-h-screen p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-800">{user?.name || 'User'}</h2>
              <p className="text-sm text-gray-500">Profile</p>
            </div>
          </div>

          <nav className="space-y-2">
            <a 
              href="/profile" 
              className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <User className="w-4 h-4" />
              Profile
            </a>
            <a 
              href="/reset-password" 
              className="flex items-center gap-3 px-3 py-2 bg-gray-100 text-gray-800 rounded-lg font-medium"
            >
              <Key className="w-4 h-4" />
              Reset password
            </a>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="max-w-2xl">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.history.back()}
                  className="p-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <h1 className="text-2xl font-bold text-gray-800">Reset Password</h1>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <Input
                    name="currentPassword"
                    type="password"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    required
                    className="w-full"
                    placeholder="Enter current password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <Input
                    name="newPassword"
                    type="password"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    required
                    className="w-full"
                    placeholder="Enter new password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <Input
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    className="w-full"
                    placeholder="Confirm new password"
                  />
                </div>

                {message && (
                  <div className={`p-3 rounded-md ${
                    message.includes('successfully') 
                      ? 'bg-green-50 text-green-700 border border-green-200' 
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    {message}
                  </div>
                )}

                <Button 
                  type="submit"
                  disabled={loading}
                  className="bg-gray-800 text-white hover:bg-gray-700"
                >
                  <Key className="w-4 h-4 mr-2" />
                  {loading ? 'Updating...' : 'Update Password'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;