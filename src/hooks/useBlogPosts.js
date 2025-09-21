import { useState, useEffect } from 'react';
import { fetchBlogPosts } from '../services/blogApi';

export const useBlogPosts = (initialParams = {}) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalPosts: 0,
    postsPerPage: 6
  });
  const [params, setParams] = useState(initialParams);

  const loadPosts = async (newParams = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const mergedParams = { ...params, ...newParams };
      const data = await fetchBlogPosts(mergedParams);
      
      setPosts(data.posts || []);
      setPagination({
        currentPage: data.currentPage || 1,
        totalPages: data.totalPages || 1,
        totalPosts: data.totalPosts || 0,
        postsPerPage: data.postsPerPage || 6
      });
      setParams(mergedParams);
    } catch (err) {
      setError(err.message);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const changePage = (page) => {
    loadPosts({ page });
  };

  const changeCategory = (category) => {
    loadPosts({ category, page: 1 }); // Reset to page 1 when changing category
  };

  const changeLimit = (limit) => {
    loadPosts({ limit, page: 1 }); // Reset to page 1 when changing limit
  };

  // Load posts on mount and when params change
  useEffect(() => {
    loadPosts();
  }, []);

  return {
    posts,
    loading,
    error,
    pagination,
    params,
    loadPosts,
    changePage,
    changeCategory,
    changeLimit,
    refetch: () => loadPosts(params)
  };
};