import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: apiBaseUrl,
  headers: { 'Content-Type': 'application/json' },
});

export const useComments = (postId) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);

  const load = useCallback(async () => {
    if (!postId) return;
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`/posts/${postId}/comments`);
      // shape ให้เข้ากับ UI เดิม
      const mapped = (res.data.comments || []).map((c) => ({
        id: c.id,
        name: c.user?.name || 'Unknown',
        avatar: c.user?.avatar ? '' : (c.nameInitials || ''),
        avatarUrl: c.user?.avatar || '',
        date: new Date(c.date).toLocaleString('en-GB', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'long', year: 'numeric' }),
        createdAt: c.date, // EDIT: เก็บ ISO timestamp ดิบไว้สำหรับ sort
        content: c.content,
      }));
      setComments(mapped);
    } catch (e) {
      setError(e.message || 'Failed to load comments');
    } finally {
      setLoading(false);
    }
  }, [postId]);

  const add = useCallback(async (text) => {
    const token = localStorage.getItem('token');
    const res = await api.post(
      `/posts/${postId}/comments`,
      { comment_text: text },
      { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    // แปลงเป็นรูปแบบ UI เดิม
    const c = res.data;
    const mapped = {
        id: c.id,
        name: c.user?.name || 'Unknown',
        avatarUrl: c.user?.avatar || '',
        date: new Date(c.date).toLocaleString('en-GB', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'long', year: 'numeric' }),
        createdAt: c.date, // EDIT: เก็บ ISO timestamp ดิบ
        content: c.content,
      };
    setComments((prev) => [mapped, ...prev]);
    return mapped;
  }, [postId]);

  useEffect(() => { load(); }, [load]);

  return { comments, loading, error, refetch: load, addComment: add };
};