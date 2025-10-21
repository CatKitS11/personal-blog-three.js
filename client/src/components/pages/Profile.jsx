import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/authentication';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, Camera, Save, Settings, Key } from 'lucide-react';
import axios from 'axios';

const Profile = () => {
  const { state, fetchUser } = useAuth();
  const { user } = state;
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    username: '',
    email: '',
    profilePicture: null
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        username: user.username || '',
        email: user.email || '',
        profilePicture: user.profile_picture || null
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Preview image
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData(prev => ({
          ...prev,
          profilePicture: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', profileData.name);
      formData.append('username', profileData.username);
      
      // If there's a new image file
      const fileInput = document.getElementById('profile-picture');
      if (fileInput.files[0]) {
        formData.append('profile_picture', fileInput.files[0]);
      }

      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/auth/profile`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success) {
        await fetchUser(); // Refresh user data
        setIsEditing(false);
        alert('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setProfileData({
        name: user.name || '',
        username: user.username || '',
        email: user.email || '',
        profilePicture: user.profile_picture || null
      });
    }
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 min-h-screen p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
              {profileData.profilePicture ? (
                <img 
                  src={profileData.profilePicture} 
                  alt="Profile" 
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <User className="w-6 h-6 text-gray-600" />
              )}
            </div>
            <div>
              <h2 className="font-semibold text-gray-800">{user?.name || 'User'}</h2>
              <p className="text-sm text-gray-500">Profile</p>
            </div>
          </div>

          <nav className="space-y-2">
            <a 
              href="/profile" 
              className="flex items-center gap-3 px-3 py-2 bg-gray-100 text-gray-800 rounded-lg font-medium"
            >
              <Settings className="w-4 h-4" />
              Profile
            </a>
            <a 
              href="/reset-password" 
              className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
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
              {/* Profile Picture Section */}
              <div className="flex items-center gap-6 mb-8">
                <div className="relative">
                  <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                    {profileData.profilePicture ? (
                      <img 
                        src={profileData.profilePicture} 
                        alt="Profile" 
                        className="w-24 h-24 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-12 h-12 text-gray-600" />
                    )}
                  </div>
                  {isEditing && (
                    <label 
                      htmlFor="profile-picture"
                      className="absolute bottom-0 right-0 bg-gray-800 text-white p-2 rounded-full cursor-pointer hover:bg-gray-700 transition-colors"
                    >
                      <Camera className="w-4 h-4" />
                    </label>
                  )}
                </div>
                {isEditing && (
                  <div>
                    <label 
                      htmlFor="profile-picture"
                      className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <Camera className="w-4 h-4" />
                      Upload profile picture
                    </label>
                    <input
                      id="profile-picture"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                )}
              </div>

              {/* Form Fields */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <Input
                    name="name"
                    value={profileData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <Input
                    name="username"
                    value={profileData.username}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full"
                    placeholder="Enter your username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-500">
                    {profileData.email}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Email cannot be changed
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4 mt-8">
                {isEditing ? (
                  <>
                    <Button 
                      onClick={handleSave}
                      disabled={loading}
                      className="bg-gray-800 text-white hover:bg-gray-700"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {loading ? 'Saving...' : 'Save'}
                    </Button>
                    <Button 
                      onClick={handleCancel}
                      variant="outline"
                      className="text-gray-700 border-gray-300 hover:bg-gray-50"
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button 
                    onClick={() => setIsEditing(true)}
                    className="bg-gray-800 text-white hover:bg-gray-700"
                  >
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;