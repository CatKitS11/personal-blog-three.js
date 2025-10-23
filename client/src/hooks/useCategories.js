import { useState, useEffect } from 'react';
import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiBaseUrl}/categories`);
      setCategories(response.data.categories || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch categories');
      // Set default categories if API fails
      setCategories([
        { id: 1, name: 'Cat' },
        { id: 2, name: 'General' },
        { id: 3, name: 'Inspiration' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    fetchCategories
  };
};
