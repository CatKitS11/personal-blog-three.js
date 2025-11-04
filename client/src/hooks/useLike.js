import { useState, useEffect } from 'react';
import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export const useLike = (postId, initialLikes = 0) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikes);
  const [loading, setLoading] = useState(false);

  // เช็คสถานะ like เมื่อ component mount
  useEffect(() => {
    const checkLikeStatus = async () => {
      const token = localStorage.getItem('token');
      if (!token || !postId) return;

      try {
        const response = await axios.get(
          `${apiBaseUrl}/posts/${postId}/like/status`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setIsLiked(response.data.isLiked);
      } catch (error) {
        console.error('Failed to check like status:', error);
      }
    };

    checkLikeStatus();
  }, [postId]);

  const toggleLike = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      return { success: false, error: 'Not authenticated' };
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${apiBaseUrl}/posts/${postId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setIsLiked(response.data.isLiked);
        setLikeCount(response.data.likesCount);
        return { success: true };
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    isLiked,
    likeCount,
    toggleLike,
    loading
  };
};