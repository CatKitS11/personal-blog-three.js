import { useState } from 'react';
import axios from 'axios';

export const useImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const uploadImage = async (file, folder = 'profile-pictures') => {
    if (!file) return null;

    setUploading(true);
    setError(null);

    try {
      // สร้าง FormData
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      // Upload ไปยัง server
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/upload/image`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success) {
        return response.data.imageUrl; // Return URL ของรูปที่ upload สำเร็จ
      }
      return null;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to upload image');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const uploadProfilePicture = async (file) => {
    return await uploadImage(file, 'profile-pictures');
  };

  const uploadPostImage = async (file) => {
    return await uploadImage(file, 'post-images');
  };

  return {
    uploadImage,
    uploadProfilePicture,
    uploadPostImage,
    uploading,
    error
  };
};