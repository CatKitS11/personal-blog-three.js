import { useState, useEffect } from 'react';
import { Search, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAdminPosts } from '../../../hooks/useAdminPosts';

const ArticleManagement = () => {
  const { posts, loading, error, deletePost } = useAdminPosts();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      const result = await deletePost(postId);
      if (!result.success) {
        alert(result.error);
      }
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || post.status === statusFilter;
    const matchesCategory = !categoryFilter || post.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Article Management</h1>
        <Link to="/admin/article-management/create">
          <button className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800">
            + Create Article
          </button>
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border rounded-md w-80"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex space-x-4">
            <select 
              className="border rounded-md px-4 py-2"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
            </select>
            <select 
              className="border rounded-md px-4 py-2"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="Cat">Cat</option>
              <option value="General">General</option>
              <option value="Inspiration">Inspiration</option>
            </select>
          </div>
        </div>

        {loading && <p>Loading articles...</p>}
        {error && <p className="text-red-500">{error}</p>}
        
        {!loading && !error && (
          <table className="w-full table-auto">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="pb-2 font-normal">Article Title</th>
                <th className="pb-2 font-normal">Category</th>
                <th className="pb-2 font-normal">Status</th>
                <th className="pb-2 font-normal">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.map((article) => (
                <tr key={article.id} className="border-t">
                  <td className="py-4 pr-2">{article.title}</td>
                  <td className="py-4 pr-2">{article.category}</td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      article.status === 'Published' 
                        ? 'text-green-700 bg-green-100' 
                        : 'text-yellow-700 bg-yellow-100'
                    }`}>
                      {article.status || 'Draft'}
                    </span>
                  </td>
                  <td className="py-4 flex justify-end space-x-2">
                    <Link to={`/admin/article-management/edit/${article.id}`}>
                      <button className="text-gray-500 hover:text-gray-700">
                        <Edit size={20} />
                      </button>
                    </Link>
                    <button 
                      className="text-gray-500 hover:text-gray-700"
                      onClick={() => handleDelete(article.id)}
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ArticleManagement;