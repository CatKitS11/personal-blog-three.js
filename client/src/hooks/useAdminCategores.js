import { useState, useEffect } from 'react';
import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export const useAdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const authHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${apiBaseUrl}/categories`);
      setCategories(res.data.categories || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (name) => {
    try {
      await axios.post(`${apiBaseUrl}/categories`, { name }, authHeader());
      await fetchCategories();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Failed to create category' };
    }
  };

  const updateCategory = async (id, name) => {
    try {
      await axios.put(`${apiBaseUrl}/categories/${id}`, { name }, authHeader());
      await fetchCategories();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Failed to update category' };
    }
  };

  const deleteCategory = async (id) => {
    try {
      await axios.delete(`${apiBaseUrl}/categories/${id}`, authHeader());
      await fetchCategories();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Failed to delete category' };
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  };
};