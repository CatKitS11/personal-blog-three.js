import { useState, useEffect } from 'react';
import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

// สร้าง axios instance
const apiClient = axios.create({
  baseURL: apiBaseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// EDIT: เพิ่ม default author
const DEFAULT_AUTHOR = {
  name: 'Unknown Author',
  bio: 'I am a passionate writer who loves sharing insights and stories with readers around the world.',
  avatar: 'https://res.cloudinary.com/dcbpjtd1r/image/upload/v1728449784/my-blog-post/xgfy0xnvyemkklcqodkg.jpg'
};

// EDIT: Helper function
const enrichPostsWithAuthor = (posts) => {
  return posts.map(post => ({
    ...post,
    author: post.author || DEFAULT_AUTHOR  // EDIT: เพิ่ม default author
  }));
};

export const useBlogPosts = (initialParams = {}) => {
  const [allPosts, setAllPosts] = useState([]);
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
      // EDIT: เพิ่ม console.log เพื่อดูว่า API ส่งอะไรมา
      console.log('API Response:', data.posts?.[0]); // ดู post แรก
      console.log('Has author?', data.posts?.[0]?.author);

      const enrichedPosts = enrichPostsWithAuthor(data.posts || []); // EDIT: เพิ่ม author
      // EDIT: ดูผลหลัง enrich
      console.log('After enrich:', enrichedPosts?.[0]?.author);

      setAllPosts(enrichedPosts); // EDIT: ใช้ enrichedPosts
      setParams({ category: 'Highlight', page: 1 });

      // Filter ข้อมูลตาม category ที่เลือก
      filterPostsByCategory(enrichedPosts, 'Highlight', 1); // EDIT: ใช้ enrichedPosts

    } catch (err) {
      setError(err.message);
      setAllPosts([]);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  // ... existing code (ไม่ต้องแก้ส่วนอื่น) ...

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
    filterPostsByCategory(allPosts, category, 1);
    setParams(prev => ({ ...prev, category, page: 1 }));
  };

  // Load posts on mount only
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
    refetch: loadPosts,
    allPosts,
  };
};