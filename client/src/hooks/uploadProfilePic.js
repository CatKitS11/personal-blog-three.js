import { useState } from 'react';
import axios from 'axios';

export const useImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const uploadImage = async (file) => {
    if (!file) return null;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

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
        return {
          imageUrl: response.data.imageUrl,
          filename: response.data.filename // เพิ่ม filename เพื่อใช้ลบรูปเก่า
        };
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
    return await uploadImage(file);
  };

  const uploadPostImage = async (file) => {
    return await uploadImage(file);
  };

  // เพิ่มฟังก์ชันลบรูป
  const deleteImage = async (filename) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/upload/image/${filename}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      return response.data.success;
    } catch (err) {
      console.error('Delete image error:', err);
      return false;
    }
  };

  return {
    uploadImage,
    uploadProfilePicture,
    uploadPostImage,
    deleteImage, // เพิ่มฟังก์ชันลบรูป
    uploading,
    error,
    setError
  };
};