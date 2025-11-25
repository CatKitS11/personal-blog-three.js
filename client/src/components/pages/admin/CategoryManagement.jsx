import { useState, useMemo } from "react";
import { Search, Edit, Trash2, Plus, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useAdminCategories } from "../../../hooks/useAdminCategores";

const CategoryManagement = () => {
  const { categories, loading, error, deleteCategory } = useAdminCategories();
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteModal, setDeleteModal] = useState({ open: false, categoryId: null, categoryName: '' });

  const filtered = useMemo(() => {
    return categories.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [categories, searchTerm]);

  const handleOpenDelete = (cat) => {
    setDeleteModal({ open: true, categoryId: cat.id, categoryName: cat.name });
  };

  const handleCloseDelete = () => {
    setDeleteModal({ open: false, categoryId: null, categoryName: '' });
  };

  const confirmDelete = async () => {
    const res = await deleteCategory(deleteModal.categoryId);
    handleCloseDelete();
    if (!res.success) alert(res.error);
  };

  return (
    <div>
      {/* DELETE MODAL */}
      {deleteModal.open && (
        <>
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
            onClick={handleCloseDelete}
          />
          
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div className="bg-[#F9F8F6] rounded-2xl shadow-xl p-8 max-w-md w-full mx-8 relative pointer-events-auto">
              <button 
                onClick={handleCloseDelete}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <h2 className="text-2xl font-bold text-[#333333] my-2 py-8">
                Delete category
              </h2>
              <p className="text-[#75716B] mb-6">
                Do you want to delete "{deleteModal.categoryName}"?
              </p>
              
              <div className="flex justify-center gap-6 mb-8 mt-4">
                <button
                  onClick={handleCloseDelete}
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

      {/* MAIN CONTENT */}
      <div className="flex justify-between items-center py-8 px-4 mb-4 border-b">
        <h1 className="text-3xl font-bold text-[#333333]">Category management</h1>
        <Link to="/admin/category-management/create">
          <button className="bg-[#333333] text-white text-md font-light px-12 py-3 rounded-full hover:bg-[#2a2a2a] flex items-center gap-2">
            <Plus size={20} /> Create category
          </button>
        </Link>
      </div>

      <div className="bg-white">
        <div className="flex justify-between items-center mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search..."
              className="flex font-semibold text-md text-[#75716B] pl-10 pr-4 py-3 border border-gray-300 rounded-xl min-w-[200px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative opacity-0 pointer-events-none">
            <select className="border border-gray-300 rounded-xl pl-4 pr-12 py-3 bg-white text-md font-semibold text-[#75716B] min-w-[200px] appearance-none">
              <option>Placeholder</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" size={18} />
          </div>
        </div>

        {loading && <p>Loading categories...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && (
          <div className="border rounded-xl border-gray-200 shadow-md">
            <table className="w-full">
              <thead className="border-b border-gray-200 bg-gray-50 shadow-sm">
                <tr className="text-left shadow-md">
                  <th className="py-4 px-4 text-[#75716B] text-md font-semibold">Category</th>
                  <th className="py-4 px-4 text-[#75716B] text-md font-semibold"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((cat, idx) => (
                  <tr key={cat.id} className={`transition-colors hover:bg-gray-100 ${idx % 2 === 0 ? "bg-white" : "bg-[#EFEEEB]"}`}>
                    <td className="py-4 px-4 text-left text-[#333333]">{cat.name}</td>
                    <td className="py-4 px-4">
                      <div className="flex justify-end items-center gap-4">
                        <Link to={`/admin/category-management/edit/${cat.id}`}>
                          <button className="flex items-center text-gray-400 hover:text-gray-600 transition-colors">
                            <Edit size={18} />
                          </button>
                        </Link>
                        <button 
                          onClick={() => handleOpenDelete(cat)} 
                          className="flex items-center text-gray-400 hover:text-gray-600 transition-colors"
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
        )}
      </div>
    </div>
  );
};

export default CategoryManagement;