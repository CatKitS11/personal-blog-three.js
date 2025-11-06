import { useState } from 'react';
import axios from 'axios';

export const useContentImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const uploadContentImage = async (file) => {
    if (!file) return null;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

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

      if (response.data.success) {
        return response.data.imageUrl;
      }
      return null;
    } catch (err) {
      console.error('Content image upload error:', err);
      setError(err.response?.data?.error || 'Failed to upload image');
      return null;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadContentImage,
    uploading,
    error
  };
};