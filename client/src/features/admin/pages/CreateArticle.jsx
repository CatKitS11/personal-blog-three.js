import { useEffect, useState, useCallback } from "react"; // EDIT: add useEffect for auto-hide success alert
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/authentication";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UploadCloud, X } from "lucide-react";
import { useCategories } from "@/hooks/useCategories";
import { useAdminPosts } from "@/hooks/useAdminPosts";
import { usePostImageUpload } from "@/hooks/usePostImageUpload";
import MarkdownEditor from "@/features/blog/MarkdownEditor";
import { Alert } from "@/components/ui/alert"; // EDIT: use shared Alert like Login page

const CreateArticle = () => {
  const navigate = useNavigate();
  const { state } = useAuth();
  const { user } = state;
  const { createPost } = useAdminPosts();
  const { uploadPostImage, uploading, error: uploadError } = usePostImageUpload();
  const { categories: dbCategories } = useCategories();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    category_id: "",
    author_name: "",
    status_id: 1,
    image: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
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

  const handleInputChange = useCallback((field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (alert.show) setAlert((p) => ({ ...p, show: false })); // EDIT: hide alert on edit

    setErrors((prev) => {
      if (prev[field]) {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      }
      return prev;
    });
  }, []);

  const handleContentChange = useCallback(
    (value) => {
      handleInputChange("content", value);
    },
    [handleInputChange]
  );

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, image: "Please select an image file" }));
      setAlert({ // EDIT: surface validation via Alert
        show: true,
        type: "error",
        message: "Invalid file",
        content: "Please select an image file.",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        image: "Image size must be less than 5MB",
      }));
      setAlert({ // EDIT
        show: true,
        type: "error",
        message: "Image too large",
        content: "Image size must be less than 5MB.",
      });
      return;
    }

    try {
      const result = await uploadPostImage(file);

      if (result) {
        setFormData((prev) => ({ ...prev, image: result.imageUrl }));
        setImagePreview(result.imageUrl);
        setErrors((prev) => ({ ...prev, image: null }));
        setAlert({ // EDIT: upload success feedback
          show: true,
          type: "success",
          message: "Image uploaded",
          content: "Thumbnail image uploaded successfully.",
        });
      } else {
        setErrors((prev) => ({
          ...prev,
          image: uploadError || "Failed to upload image",
        }));
        setAlert({ // EDIT
          show: true,
          type: "error",
          message: "Upload failed",
          content: uploadError || "Failed to upload image.",
        });
      }
    } catch (error) {
      console.error("Upload error:", error);
      setErrors((prev) => ({
        ...prev,
        image: uploadError || "Failed to upload image",
      }));
      setAlert({ // EDIT
        show: true,
        type: "error",
        message: "Upload failed",
        content: uploadError || "Failed to upload image.",
      });
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: "" }));
    setImagePreview(null);
    setErrors((prev) => ({ ...prev, image: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim())
      newErrors.description = "Introduction is required";
    if (!formData.content.trim()) newErrors.content = "Content is required";
    if (!formData.category_id) newErrors.category_id = "Category is required";
    if (!formData.image) newErrors.image = "Image is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (isDraft = false) => {
    if (!validateForm()) { // EDIT: surface validation via Alert
      setAlert({
        show: true,
        type: "error",
        message: "Please check your input",
        content: "Fix the highlighted fields and try again.",
      });
      return;
    }
    setLoading(true);
    try {
      const postData = {
        title: formData.title,
        description: formData.description,
        content: formData.content,
        category_id: parseInt(formData.category_id),
        status_id: isDraft ? 1 : 2,
        image: formData.image,
        author_id: user?.id,
      };

      const result = await createPost(postData);

      if (result.success) {
        setAlert({ // EDIT: success alert instead of window.alert
          show: true,
          type: "success",
          message: isDraft ? "Draft saved" : "Article published",
          content: "Redirecting to article management...",
        });
        setTimeout(() => navigate("/admin/article-management"), 1500); // EDIT
      } else {
        setAlert({ // EDIT: error alert
          show: true,
          type: "error",
          message: "Failed to save article",
          content: result.error || "Please try again.",
        });
      }
    } catch (error) {
      console.error("Submit error:", error);
      setAlert({ // EDIT
        show: true,
        type: "error",
        message: "Unexpected error",
        content: "An unexpected error occurred.",
      });
    } finally {
      setLoading(false);
    }
  };

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
      <div className="flex justify-between items-center pb-8 mb-4 mt-4 border-b">
        <h1 className="text-2xl font-bold">Create article</h1>
        <div className="flex gap-6">
          <Button
            className="px-10 py-6 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors"
            variant="outline"
            onClick={() => handleSubmit(true)}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save as draft"}
          </Button>
          <Button
            className="px-10 py-6 bg-black text-white rounded-full"
            onClick={() => handleSubmit(false)}
            disabled={loading}
          >
            {loading ? "Publishing..." : "Save and publish"}
          </Button>
        </div>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-sm">
        <div className="space-y-6">
          <div className="space-y-4">
            <label className="flex text-sm font-medium text-[#75716B]">
              Thumbnail image
            </label>

            <div className="flex flex-row gap-6 items-end">
              {imagePreview ? (
                <div className="relative w-full max-w-md">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center w-full max-w-md h-48 border-2 border-dashed rounded-lg">
                  <UploadCloud className="w-10 h-10 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">No image uploaded</p>
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />

              <Button
                variant="outline"
                className="px-8 py-5 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => document.getElementById("image-upload").click()}
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Upload thumbnail image"}
              </Button>
            </div>
            {errors.image && <p className="text-sm text-red-500">{errors.image}</p>}
          </div>

          <div className="space-y-6">
            <div>
              <label
                htmlFor="category"
                className="flex py-2 text-sm font-medium text-[#75716B]"
              >
                Category
              </label>
              <Select
                value={formData.category_id}
                onValueChange={(value) => handleInputChange("category_id", value)}
              >
                <SelectTrigger className="w-1/2">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {dbCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category_id && (
                <p className="text-sm text-red-500 mt-1">{errors.category_id}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="author"
                className="flex py-2 text-sm font-medium text-[#75716B] mb-1"
              >
                Author name
              </label>
              <Input
                id="author"
                type="text"
                placeholder="Author"
                value={user?.name || ""}
                disabled
                className="w-full bg-[#EFEEEB] cursor-not-allowed"
              />
            </div>

            <div>
              <label
                htmlFor="title"
                className="flex py-2 text-sm font-medium text-[#75716B] mb-1"
              >
                Title
              </label>
              <Input
                id="title"
                type="text"
                placeholder="Article title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="w-full"
              />
              {errors.title && (
                <p className="text-sm text-red-500 mt-1">{errors.title}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="introduction"
                className="flex py-2 text-sm font-medium text-[#75716B] mb-1"
              >
                Introduction (max 120 letters)
              </label>
              <Textarea
                id="introduction"
                placeholder="Introduction"
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                maxLength={120}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.description.length}/120 characters
              </p>
              {errors.description && (
                <p className="text-sm text-red-500 mt-1">{errors.description}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="content"
                className="flex py-2 text-sm font-medium text-[#75716B] mb-1"
              >
                Content (Markdown supported)
              </label>
              <MarkdownEditor
                value={formData.content}
                onChange={handleContentChange}
                placeholder="Write your article content..."
              />
              {errors.content && (
                <p className="text-sm text-red-500 mt-1">{errors.content}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateArticle;


