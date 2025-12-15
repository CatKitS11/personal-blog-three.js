import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import { useAdminCategories } from "@/hooks/useAdminCategores";
import { Alert } from "@/components/ui/alert";

const CreateCategory = () => {
  const navigate = useNavigate();
  const { createCategory } = useAdminCategories();
  const [categoryName, setCategoryName] = useState("");
  const [error, setError] = useState("");
  const [alert, setAlert] = useState({
    show: false,
    type: "info",
    message: "",
    content: "",
  });

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

    const res = await createCategory(categoryName.trim());
    if (res.success) {
      setAlert({
        show: true,
        type: "success",
        message: "Category created",
        content: "Redirecting to category management...",
      });
      setTimeout(() => navigate("/admin/category-management"), 1500);
    } else {
      setError(res.error || "Failed to create category");
      setAlert({
        show: true,
        type: "error",
        message: "Failed to create category",
        content: res.error || "Please try again.",
      });
    }
  };

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
      <div className="flex justify-between items-center pb-8 mb-4 mt-4 border-b">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/category-management")}
            className="text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold">Create category</h1>
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
                if (alert.show) setAlert((prev) => ({ ...prev, show: false })); // EDIT: ซ่อน alert เมื่อเริ่มพิมพ์
              }}
              onKeyPress={(e) => e.key === "Enter" && handleSave()}
              className="w-full"
            />
            {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCategory;


