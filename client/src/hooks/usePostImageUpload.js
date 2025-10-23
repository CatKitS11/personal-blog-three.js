import { useState } from 'react';
import axios from 'axios';

export const usePostImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const uploadPostImage = async (file) => {
    if (!file) return null;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      console.log('Uploading to:', `${import.meta.env.VITE_API_BASE_URL}/upload/post-image`); // Debug log

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/upload/post-image`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      console.log('Upload response:', response.data); // Debug log

      if (response.data.success) {
        return {
          imageUrl: response.data.imageUrl,
          filename: response.data.filename
        };
      }
      return null;
    } catch (err) {
      console.error('Upload error details:', err); // Debug log
      
      let errorMessage = 'Failed to upload post image';
      
      if (err.response) {
        // Server responded with error status
        errorMessage = err.response.data?.error || `Server error: ${err.response.status}`;
        
        if (err.response.status === 401) {
          errorMessage = 'Unauthorized: Please login as admin';
        } else if (err.response.status === 403) {
          errorMessage = 'Forbidden: Admin access required';
        } else if (err.response.status === 404) {
          errorMessage = 'User not found in database';
        } else if (err.response.status === 500) {
          errorMessage = 'Server error: Check Supabase bucket configuration';
        }
      } else if (err.request) {
        // Request was made but no response received
        errorMessage = 'Network error: Cannot connect to server';
      }
      
      setError(errorMessage);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const deletePostImage = async (filename) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/upload/post-image/${filename}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      return response.data.success;
    } catch (err) {
      console.error('Delete post image error:', err);
      return false;
    }
  };

  return {
    uploadPostImage,
    deletePostImage,
    uploading,
    error,
    setError
  };
};
