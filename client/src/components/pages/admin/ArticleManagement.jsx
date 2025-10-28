import { useState, useEffect } from "react";
import { Search, Edit, Trash2, Plus, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useAdminPosts } from "../../../hooks/useAdminPosts";

const ArticleManagement = () => {
  const { posts, loading, error, deletePost } = useAdminPosts();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const handleDelete = async (postId) => {
    if (window.confirm("Are you sure you want to delete this article?")) {
      const result = await deletePost(postId);
      if (!result.success) {
        alert(result.error);
      }
    }
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || post.status === statusFilter;
    const matchesCategory = !categoryFilter || post.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div>
      <div className="flex justify-between items-center py-8 px-4 mb-4 border-b">
        <h1 className="text-3xl font-bold text-[#333333]">
          Article management
        </h1>
        <Link to="/admin/article-management/create">
          <button className="bg-[#333333] text-white text-md font-light px-12 py-3 rounded-full hover:bg-[#2a2a2a] flex items-center gap-2">
            <Plus size={20} />
            Create article
          </button>
        </Link>
      </div>

      <div className="bg-white">
        <div className="flex justify-between items-center mb-6">
          <div className="relative flex-1 max-w-md">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search..."
              className="flex font-semibold text-md text-[#75716B] pl-10 pr-4 py-3 border border-gray-300 rounded-xl min-w-[200px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-6">
            <div className="relative">
              <select
                className="border border-gray-300 rounded-xl pl-4 pr-12 py-3 bg-white text-md font-semibold text-[#75716B] min-w-[200px] appearance-none"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Status</option>
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
              </select>
              <ChevronDown
                className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
                size={18}
              />
            </div>
            <div className="relative">
              <select
                className="border border-gray-300 rounded-xl pl-4 pr-12 py-3 bg-white text-md font-semibold text-[#75716B] min-w-[200px] appearance-none"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">Category</option>
                <option value="Cat">Cat</option>
                <option value="General">General</option>
                <option value="Inspiration">Inspiration</option>
              </select>
              <ChevronDown
                className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
                size={18}
              />
            </div>
          </div>
        </div>

        {loading && <p>Loading articles...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && (
          <div className="border rounded-xl border-gray-200 shadow-md">
            <div className="">
              <table className="w-full">
                <thead className="border-b border-gray-200 bg-gray-50 shadow-sm">
                  <tr className="text-left shadow-md">
                    <th className="py-4 px-4 text-[#75716B] text-md font-semibold">Article title</th>
                    <th className="py-4 px-4 text-[#75716B] text-md font-semibold">Category</th>
                    <th className="py-4 px-4 text-[#75716B] text-md font-semibold">Status</th>
                    <th className="py-4 px-4 text-[#75716B] text-md font-semibold"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPosts.map((article, index) => (
                    <tr
                      key={article.id}
                      className={`transition-colors hover:bg-gray-100 ${
                        index % 2 === 0 ? "bg-white" : "bg-[#EFEEEB]"
                      }`}
                    >
                      <td className="py-4 px-4 text-[#333333]">
                        {article.title}
                      </td>
                      <td className="py-4 px-4 text-[#333333]">
                        {article.category}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-green-500"></span>
                          <span className="text-[#333333]">
                            {article.status || "Draft"}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex justify-end items-center gap-4">
                          <Link
                            to={`/admin/article-management/edit/${article.id}`}
                          >
                            <button className="text-gray-400 hover:text-gray-600 transition-colors">
                              <Edit size={18} />
                            </button>
                          </Link>
                          <button
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                            onClick={() => handleDelete(article.id)}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleManagement;
