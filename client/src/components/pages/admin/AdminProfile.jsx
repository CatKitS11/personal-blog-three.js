import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/authentication';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User } from 'lucide-react';
import axios from 'axios';
import { useImageUpload } from '@/hooks/uploadProfilePic';

const AdminProfile = () => {
  const { state, fetchUser } = useAuth();
  const { user } = state;
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [profileData, setProfileData] = useState({
    name: '',
    username: '',
    email: '',
    bio: '',
    profilePicture: null,
    currentFilename: null
  });

  const { uploadProfilePicture, deleteImage, uploading: imageUploading, error: uploadError, setUploadError } = useImageUpload();

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        username: user.username || '',
        email: user.email || '',
        bio: user.bio || '',
        profilePicture: user.profile_picture_url || null,
        currentFilename: user.profile_picture_url ? extractFilenameFromUrl(user.profile_picture_url) : null
      });
    }
  }, [user]);

  const extractFilenameFromUrl = (url) => {
    if (!url) return null;
    const parts = url.split('/');
    return parts[parts.length - 1];
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Limit bio to 120 characters
    if (name === 'bio' && value.length > 120) {
      return;
    }
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Preview image
    const reader = new FileReader();
    reader.onload = (e) => {
      setProfileData(prev => ({
        ...prev,
        profilePicture: e.target.result
      }));
    };
    reader.readAsDataURL(file);

    // Delete old image if exists
    if (profileData.currentFilename) {
      await deleteImage(profileData.currentFilename);
    }

    // Upload new image
    const result = await uploadProfilePicture(file);
    if (result) {
      setProfileData(prev => ({
        ...prev,
        profilePicture: result.imageUrl,
        currentFilename: result.filename
      }));
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setSuccessMessage('');
    setUploadError('');
    
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/auth/profile`,
        {
          name: profileData.name,
          username: profileData.username,
          bio: profileData.bio,
          profile_picture: profileData.profilePicture
        },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success) {
        await fetchUser();
        setSuccessMessage('Your profile has been successfully updated');
        setTimeout(() => setSuccessMessage(''), 5000);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setUploadError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header with Title and Save Button */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-semibold text-gray-800">Profile</h1>
        <Button 
          onClick={handleSave}
          disabled={loading || imageUploading}
          className="bg-gray-900 text-white hover:bg-gray-800 rounded-full px-8 py-2.5 font-medium"
        >
          {loading ? 'Saving...' : 'Save'}
        </Button>
      </div>

      {/* Error Message */}
      {uploadError && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between animate-in slide-in-from-top-2">
          <span className="text-sm">{uploadError}</span>
          <button 
            onClick={() => setUploadError('')}
            className="text-red-700 hover:text-red-900 ml-4 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Content Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-8">
          {/* Profile Picture Section */}
          <div className="flex items-start gap-6 mb-8 pb-8 border-b border-gray-200">
            <div className="relative">
              <div className="w-28 h-28 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden ring-4 ring-gray-100">
                {profileData.profilePicture ? (
                  <img 
                    src={profileData.profilePicture} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-gray-400" />
                )}
              </div>
              {imageUploading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                  <div className="text-white text-xs font-medium">Uploading...</div>
                </div>
              )}
            </div>
            <div className="flex flex-col items-center">
              <label 
                htmlFor="admin-profile-picture"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-white border-2 border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {imageUploading ? 'Uploading...' : 'Upload profile picture'}
              </label>
              <input
                id="admin-profile-picture"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={imageUploading}
              />
              <p className="text-xs text-gray-500 mt-2">JPG, PNG or GIF. Max size 5MB</p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            {/* Name Field */}
            <div>
              <label className="flex pl-0.5 text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <Input
                name="name"
                value={profileData.name}
                onChange={handleInputChange}
                className="w-full bg-white border-gray-300 focus:border-gray-900 focus:ring-gray-900"
                placeholder="Enter your name"
              />
            </div>

            {/* Username Field */}
            <div>
              <label className="flex pl-0.5 text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <Input
                name="username"
                value={profileData.username}
                onChange={handleInputChange}
                className="w-full bg-white border-gray-300 focus:border-gray-900 focus:ring-gray-900"
                placeholder="Enter your username"
              />
            </div>

            {/* Email Field (Read-only) */}
            <div>
              <label className="flex pl-0.5 text-sm font-medium text-gray-500 mb-2">
                Email
              </label>
              <div className="flex px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 text-sm">
                {profileData.email}
              </div>
              <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
            </div>

            {/* Bio Field */}
            <div>
              <label className="flex pl-0.5 text-sm font-medium text-gray-700 mb-2">
                Bio <span className="text-gray-400 font-normal">(max 120 letters)</span>
              </label>
              <textarea
                name="bio"
                value={profileData.bio}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none text-sm leading-relaxed"
                rows="4"
                maxLength="120"
                placeholder="I am a pet enthusiast and freelance writer who specializes in animal behavior and care. With a deep love for cats, I enjoy sharing insights on feline companionship and their loving natures.

When I'm not writing, I spends time volunteering at my local animal shelter, helping cats find loving homes."
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-gray-500">Tell us about yourself</p>
                <div className="text-xs font-medium text-gray-600">
                  <span className={profileData.bio.length >= 120 ? 'text-red-600' : ''}>{profileData.bio.length}</span>
                  <span className="text-gray-400">/120</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Toast Notification */}
      {successMessage && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-bottom-5">
          <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-xl flex items-center gap-4 min-w-[420px]">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-base">Saved profile</p>
              <p className="text-sm text-green-50 mt-0.5">{successMessage}</p>
            </div>
            <button 
              onClick={() => setSuccessMessage('')}
              className="text-white hover:text-green-100 transition-colors flex-shrink-0 ml-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProfile;