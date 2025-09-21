const API_BASE_URL = 'https://blog-post-project-api.vercel.app';

/**
 * Fetch blog posts from API with optional query parameters
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.limit - Posts per page (default: 6)
 * @param {string} params.category - Filter by category (optional)
 * @returns {Promise<Object>} API response with posts and pagination info
 */
export const fetchBlogPosts = async (params = {}) => {
  try {
    const { page = 1, limit = 6, category } = params;
    
    // Build query string
    const queryParams = new URLSearchParams();
    queryParams.append('page', page.toString());
    queryParams.append('limit', limit.toString());
    
    if (category && category !== 'Highlight') {
      queryParams.append('category', category);
    }
    
    const url = `${API_BASE_URL}/posts?${queryParams.toString()}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    throw error;
  }
};

/**
 * Fetch a single blog post by ID
 * @param {number} id - Post ID
 * @returns {Promise<Object>} Single blog post
 */
export const fetchBlogPost = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/${id}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    throw error;
  }
};