import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useAdminCategories } from "@/hooks/useAdminCategores";
import axios from "axios";
import { Alert } from "@/components/ui/alert";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const EditCategory = () => {
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const { updateCategory } = useAdminCategories();
  const [categoryName, setCategoryName] = useState("");
  const [originalName, setOriginalName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);
  const [alert, setAlert] = useState({
    show: false,
    type: "info",
    message: "",
    content: "",
  });

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/categories`);
        const category = response.data.categories.find(
          (c) => c.id === parseInt(categoryId)
        );
        if (category) {
          setCategoryName(category.name);
          setOriginalName(category.name);
        } else {
          setAlert({
            show: true,
            type: "error",
            message: "Category not found",
            content: "Redirecting to category management...",
          });
          setTimeout(() => navigate("/admin/category-management"), 1500);
        }
      } catch (err) {
        console.error("Error fetching category:", err);
        setAlert({
          show: true,
          type: "error",
          message: "Failed to load category",
          content: "Please try again later.",
        });
        navigate("/admin/category-management");
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [categoryId, navigate]);

  useEffect(() => {
    if (alert.show && (alert.type === "success" || alert.type === "warning")) {
      const timer = setTimeout(
        () => setAlert((prev) => ({ ...prev, show: false })),
        3000
      );
      return () => clearTimeout(timer);
    }
  }, [alert.show, alert.type]);

  const handleSave = async () => {
    if (!categoryName.trim()) {
      setError("Category name is required");
      setAlert({
        show: true,
        type: "error",
        message: "Validation error",
        content: "Category name is required.",
      });
      return;
    }

    if (categoryName.trim() === originalName) {
      setAlert({
        show: true,
        type: "warning",
        message: "No changes detected",
        content: "The category name is unchanged.",
      });
      navigate("/admin/category-management");
      return;
    }

    const res = await updateCategory(parseInt(categoryId), categoryName.trim());
    if (res.success) {
      setAlert({
        show: true,
        type: "success",
        message: "Category updated",
        content: "Redirecting to category management...",
      });
      navigate("/admin/category-management");
    } else {
      setAlert({
        show: true,
        type: "error",
        message: "Failed to update category",
        content: res.error || "Please try again.",
      });
      setError(res.error || "Failed to update category");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${apiBaseUrl}/categories/${categoryId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setAlert({
        show: true,
        type: "success",
        message: "Category deleted",
        content: "Redirecting to category management...",
      });
      setTimeout(() => navigate("/admin/category-management"), 1500);
    } catch (err) {
      setAlert({
        show: true,
        type: "error",
        message: "Failed to delete category",
        content: "Please try again.",
      });
      console.error("Delete error:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading category...</p>
      </div>
    );
  }

  return (
    <div>
      {alert.show && (
        <Alert
          type={alert.type}
          message={alert.message}
          content={alert.content}
          onClose={() => setAlert((prev) => ({ ...prev, show: false }))}
          variant="fixed"
        />
      )}

      {deleteModal && (
        <>
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
            onClick={() => setDeleteModal(false)}
          />

          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div className="bg-[#F9F8F6] rounded-2xl shadow-xl p-8 max-w-md w-full mx-8 relative pointer-events-auto">
              <button
                onClick={() => setDeleteModal(false)}
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
                Delete category
              </h2>
              <p className="text-[#75716B] mb-6">
                Do you want to delete "{originalName}"?
              </p>

              <div className="flex justify-center gap-6 mb-8 mt-4">
                <button
                  onClick={() => setDeleteModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-6 py-2 bg-[#333333] text-white rounded-full hover:bg-[#2a2a2a] transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="flex justify-between items-center pb-8 mb-4 mt-4 border-b">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/category-management")}
            className="text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold">Edit category</h1>
        </div>
        <Button
          onClick={handleSave}
          className="px-10 py-3 bg-[#333333] text-white rounded-full hover:bg-[#2a2a2a] transition-colors"
        >
          Save
        </Button>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-sm max-w-2xl">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#75716B] mb-2">
              Category name
            </label>
            <Input
              type="text"
              placeholder="Category name"
              value={categoryName}
              onChange={(e) => {
                setCategoryName(e.target.value);
                setError("");
              }}
              onKeyPress={(e) => e.key === "Enter" && handleSave()}
              className="w-full"
            />
            {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <Button
            onClick={() => setDeleteModal(true)}
            variant="outline"
            className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors border-none"
          >
            <Trash2 size={18} />
            Delete category
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditCategory;


