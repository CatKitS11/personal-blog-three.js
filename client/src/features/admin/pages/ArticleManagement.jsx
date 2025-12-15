import { useEffect, useState } from "react"; // EDIT: add useEffect for auto-hide success alert
import { Search, Edit, Trash2, Plus, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useAdminPosts } from "@/hooks/useAdminPosts";
import { Alert } from "@/components/ui/alert"; // EDIT: use shared Alert like Login page

const ArticleManagement = () => {
  const { posts, loading, error, deletePost } = useAdminPosts();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    postId: null,
    postTitle: "",
  });
  const [alert, setAlert] = useState({ // EDIT: unified alert state
    show: false,
    type: "info",
    message: "",
    content: "",
  });

  useEffect(() => { // EDIT: auto-hide success alerts
    if (alert.show && alert.type === "success") {
      const t = setTimeout(() => setAlert((p) => ({ ...p, show: false })), 3000);
      return () => clearTimeout(t);
    }
  }, [alert.show, alert.type]);

  const handleDelete = async (postId) => {
    const post = posts.find((p) => p.id === postId);
    setDeleteModal({ open: true, postId, postTitle: post?.title || "" });
  };

  const confirmDelete = async () => {
    if (!deleteModal.postId) return;
    const result = await deletePost(deleteModal.postId);
    setDeleteModal({ open: false, postId: null, postTitle: "" });
    if (result.success) { // EDIT: show success via Alert
      setAlert({
        show: true,
        type: "success",
        message: "Article deleted",
        content: "The article has been deleted successfully.",
      });
      return;
    }
    setAlert({ // EDIT: show error via Alert
      show: true,
      type: "error",
      message: "Failed to delete article",
      content: result.error || "Please try again.",
    });
  };

  const cancelDelete = () => {
    setDeleteModal({ open: false, postId: null, postTitle: "" });
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
      {alert.show && ( // EDIT: render shared Alert
        <Alert
          type={alert.type}
          message={alert.message}
          content={alert.content}
          onClose={() => setAlert((prev) => ({ ...prev, show: false }))}
          variant="fixed"
        />
      )}
      {deleteModal.open && (
        <>
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
            onClick={cancelDelete}
          />

          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div className="bg-[#F9F8F6] rounded-2xl shadow-xl p-8 max-w-md w-full mx-8 relative pointer-events-auto">
              <button
                onClick={cancelDelete}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <h2 className="text-2xl font-bold text-[#333333] my-2 py-8">
                Delete article
              </h2>
              <p className="text-[] mb-6">Do you want to delete this article?</p>

              <div className="flex justify-center gap-6 mb-8 mt-4">
                <button
                  onClick={cancelDelete}
                  className="px-6 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-6 py-2 bg-[#333333] text-white rounded-full hover:bg-[#2a2a2a] transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </>
      )}
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
                    <th className="py-4 px-4 text-[#75716B] text-md font-semibold">
                      Article title
                    </th>
                    <th className="py-4 px-4 text-[#75716B] text-md font-semibold">
                      Category
                    </th>
                    <th className="py-4 px-4 text-[#75716B] text-md font-semibold">
                      Status
                    </th>
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
                      <td className="flex py-4 px-4 text-[#333333]">
                        {article.title}
                      </td>
                      <td className="block-inline text-left py-4 px-4 text-[#333333]">
                        {article.category}
                      </td>
                      <td className="block-inline text-left py-4 px-4 text-[#333333]">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              article.status === "Published"
                                ? "bg-[#12B279]"
                                : "bg-[#75716B]"
                            }`}
                          ></span>
                          <span
                            className={`${
                              article.status === "Published"
                                ? "text-[#12B279]"
                                : "text-[#75716B]"
                            }`}
                          >
                            {article.status || "Draft"}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex justify-end items-center gap-4">
                          <Link
                            to={`/admin/article-management/edit/${article.id}`}
                          >
                            <button className="flex items-center text-gray-400 hover:text-gray-600 transition-colors">
                              <Edit size={18} />
                            </button>
                          </Link>
                          <button
                            className="flex text-gray-400 items-center hover:text-gray-600 transition-colors"
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


