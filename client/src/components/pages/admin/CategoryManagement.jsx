import { useState, useMemo } from "react";
import { Search, Edit, Trash2, Plus, ChevronDown } from "lucide-react";
import { useAdminCategories } from "../../../hooks/useAdminCategores";

const CategoryManagement = () => {
  const { categories, loading, error, createCategory, updateCategory, deleteCategory } = useAdminCategories();
  const [searchTerm, setSearchTerm] = useState("");
  const filtered = useMemo(() => {
    return categories.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [categories, searchTerm]);

  const handleCreate = async () => {
    const name = window.prompt("Category name");
    if (!name?.trim()) return;
    const res = await createCategory(name.trim());
    if (!res.success) alert(res.error);
  };

  const handleEdit = async (cat) => {
    const name = window.prompt("Edit category name", cat.name);
    if (name == null) return;
    const newName = name.trim();
    if (!newName || newName === cat.name) return;
    const res = await updateCategory(cat.id, newName);
    if (!res.success) alert(res.error);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    const res = await deleteCategory(id);
    if (!res.success) alert(res.error);
  };

  return (
    <div> 
      <div className="flex justify-between items-center py-8 px-4 mb-4 border-b"> 
        <h1 className="text-3xl font-bold text-[#333333]">Category management</h1> 
        <button onClick={handleCreate} className="bg-[#333333] text-white text-md font-light px-12 py-3 rounded-full hover:bg-[#2a2a2a] flex items-center gap-2"> 
          <Plus size={20} /> Create category 
        </button> 
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
          <div className="relative opacity-0 pointer-events-none"> {/* keep spacing like Article filter area */} 
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
            <div> 
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
                      <td className="py-4 px-4 text-[#333333]">{cat.name}</td> 
                      <td className="py-4 px-4"> 
                        <div className="flex justify-end items-center gap-4"> 
                          <button onClick={() => handleEdit(cat)} className="flex items-center text-gray-400 hover:text-gray-600 transition-colors"> 
                            <Edit size={18} /> 
                          </button> 
                          <button onClick={() => handleDelete(cat.id)} className="flex items-center text-gray-400 hover:text-gray-600 transition-colors"> 
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

export default CategoryManagement;
