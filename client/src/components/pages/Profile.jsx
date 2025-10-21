import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/authentication';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, Key } from 'lucide-react';
import axios from 'axios';
import { useImageUpload } from '@/hooks/uploadProfilePic';

const Profile = () => {
  const { state, fetchUser } = useAuth();
  const { user } = state;
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [profileData, setProfileData] = useState({
    name: '',
    username: '',
    email: '',
    profilePicture: null
  });

  const { uploadProfilePicture, uploading: imageUploading, error: uploadError, setUploadError } = useImageUpload();

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || 'Moodeng ja',
        username: user.username || 'moodeng.cute',
        email: user.email || 'moodeng.cute@gmail.com',
        profilePicture: user.profile_picture_url || null
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

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Preview image ทันที
    const reader = new FileReader();
    reader.onload = (e) => {
      setProfileData(prev => ({
        ...prev,
        profilePicture: e.target.result
      }));
    };
    reader.readAsDataURL(file);

    // Upload รูปไปยัง server
    const imageUrl = await uploadProfilePicture(file);
    if (imageUrl) {
      setProfileData(prev => ({
        ...prev,
        profilePicture: imageUrl
      }));
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setSuccessMessage('');
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/auth/profile`,
        {
          name: profileData.name,
          username: profileData.username,
          profile_picture: profileData.profilePicture
        },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success) {
        await fetchUser(); // Refresh user data
        setSuccessMessage('Your profile has been successfully updated');
        setTimeout(() => setSuccessMessage(''), 5000);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 min-h-screen p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
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
              <h2 className="font-semibold text-gray-800">{profileData.name || 'Moodeng ja'}</h2>
              <p className="text-sm text-gray-500">Profile</p>
            </div>
          </div>

          <nav className="space-y-2">
            <a 
              href="/profile" 
              className="flex items-center gap-3 px-3 py-2 bg-gray-100 text-gray-800 rounded-lg font-medium"
            >
              <User className="w-4 h-4" />
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

        {/* Main Content Area */}
        <div className="flex-1 p-8">
          <div className="max-w-2xl">
            {/* Success Message */}
            {successMessage && (
              <div className="mb-6 bg-green-500 text-white px-6 py-3 rounded-lg flex items-center justify-between">
                <span>{successMessage}</span>
                <button 
                  onClick={() => setSuccessMessage('')}
                  className="text-white hover:text-gray-200"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Upload Error Message */}
            {uploadError && (
              <div className="mb-6 bg-red-500 text-white px-6 py-3 rounded-lg flex items-center justify-between">
                <span>{uploadError}</span>
                <button 
                  onClick={() => setUploadError('')}
                  className="text-white hover:text-gray-200"
                >
                  ✕
                </button>
              </div>
            )}

            <div className="bg-gray-100 rounded-xl p-8">
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
                  {imageUploading && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                      <div className="text-white text-xs">Uploading...</div>
                    </div>
                  )}
                </div>
                <div>
                  <label 
                    htmlFor="profile-picture"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors disabled:opacity-50"
                    disabled={imageUploading}
                  >
                    {imageUploading ? 'Uploading...' : 'Upload profile picture'}
                  </label>
                  <input
                    id="profile-picture"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={imageUploading}
                  />
                </div>
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
                    className="w-full bg-white"
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
                    className="w-full bg-white"
                    placeholder="Enter your username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Email
                  </label>
                  <div className="px-3 py-2 bg-white border border-gray-200 rounded-md text-gray-400 text-sm">
                    {profileData.email}
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="mt-8">
                <Button 
                  onClick={handleSave}
                  disabled={loading || imageUploading}
                  className="bg-gray-800 text-white hover:bg-gray-700 rounded-full px-8"
                >
                  {loading ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;