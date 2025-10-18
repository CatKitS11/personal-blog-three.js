import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'https://personal-blog-three-js-api.vercel.app';

// สร้าง axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const useBlogPosts = (initialParams = {}) => {
  const [allPosts, setAllPosts] = useState([]); // เก็บข้อมูลทั้งหมด
  const [posts, setPosts] = useState([]); // ข้อมูลที่แสดง
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalPosts: 0,
    postsPerPage: 6
  });
  const [params, setParams] = useState(initialParams);

  // Fetch ข้อมูลครั้งเดียวตอนเปิดหน้า
  const loadPosts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // ใช้ axios โดยตรงแทน fetchBlogPosts
      const response = await apiClient.get('/posts', {
        params: {
          limit: 100 // เพิ่ม limit เพื่อให้ได้ข้อมูลทั้งหมด
        }
      });
      
      const data = response.data;
      setAllPosts(data.posts || []);
      setParams({ category: 'Highlight', page: 1 });
      
      // Filter ข้อมูลตาม category ที่เลือก
      filterPostsByCategory(data.posts || [], 'Highlight', 1);
      
    } catch (err) {
      setError(err.message);
      setAllPosts([]);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter ข้อมูลตาม category และ page
  const filterPostsByCategory = (postsToFilter, category, page = 1) => {
    let filteredPosts = postsToFilter;
    
    // Filter ตาม category
    if (category && category !== 'Highlight') {
      filteredPosts = postsToFilter.filter(post => post.category === category);
    }
    
    // Pagination
    const postsPerPage = 6;
    const startIndex = (page - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex);
    
    setPosts(paginatedPosts);
    setPagination({
      currentPage: page,
      totalPages: Math.ceil(filteredPosts.length / postsPerPage),
      totalPosts: filteredPosts.length,
      postsPerPage: postsPerPage
    });
  };

  const changePage = (page) => {
    const currentCategory = params.category || 'Highlight';
    filterPostsByCategory(allPosts, currentCategory, page);
    setParams(prev => ({ ...prev, page }));
  };

  const changeCategory = (category) => {
    filterPostsByCategory(allPosts, category, 1); // Reset to page 1 when changing category
    setParams(prev => ({ ...prev, category, page: 1 }));
  };

  const changeLimit = (limit) => {
    // ไม่ต้องใช้เพราะเราใช้ client-side pagination
    console.log('Limit change not implemented for client-side filtering');
  };

  // Load posts on mount only
  useEffect(() => {
    loadPosts();
  }, []); // Empty dependency array - only run once

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
    refetch: loadPosts,
    allPosts,
  };
};