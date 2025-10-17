import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'https://blog-post-project-api.vercel.app';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Hook สำหรับจัดการ post เดียว (View Post Page)
export const useBlogPost = (postId) => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadPost = async (id) => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.get(`/posts/${id}`);
      setPost(response.data);
    } catch (err) {
      setError(err.message);
      setPost(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPost(postId);
  }, [postId]);

  return {
    post,
    loading,
    error,
    refetch: () => loadPost(postId)
  };
};