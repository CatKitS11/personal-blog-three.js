import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Trash2 } from "lucide-react";
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
import { UploadCloud, X, ArrowLeft } from "lucide-react";
import { useAdminPosts } from "../../../hooks/useAdminPosts";
import { usePostImageUpload } from "../../../hooks/usePostImageUpload";
import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const EditArticle = () => {
  const navigate = useNavigate();
  const { postId } = useParams();
  const { state } = useAuth();
  const { user } = state;
  const { updatePost } = useAdminPosts();
  const {
    uploadPostImage,
    uploading,
    error: uploadError,
  } = usePostImageUpload();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    category_id: "",
    status_id: 2,
    image: "",
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingPost, setFetchingPost] = useState(true);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ open: false });

  // Fetch post data
  useEffect(() => {
    const fetchPost = async () => {
      setFetchingPost(true);
      try {
        const response = await axios.get(`${apiBaseUrl}/posts/${postId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const post = response.data;

        // Need to get category_id from category name
        const categoriesResponse = await axios.get(`${apiBaseUrl}/categories`);
        const cats = categoriesResponse.data.categories || [];
        setCategories(cats);

        const category = cats.find((c) => c.name === post.category);
        const statusId =
          post.status === "Published" ? 1 : post.status === "Draft" ? 2 : 3;

        setFormData({
          title: post.title || "",
          description: post.description || "",
          content: post.content || "",
          category_id: category?.id.toString() || "",
          status_id: statusId,
          image: post.image || "",
        });

        setImagePreview(post.image);
      } catch (error) {
        console.error("Error fetching post:", error);
        alert("Failed to load article");
        navigate("/admin/article-management");
      } finally {
        setFetchingPost(false);
      }
    };

    fetchPost();
  }, [postId]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, image: "Please select an image file" }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        image: "Image size must be less than 5MB",
      }));
      return;
    }

    try {
      const result = await uploadPostImage(file);

      if (result) {
        setFormData((prev) => ({ ...prev, image: result.imageUrl }));
        setImagePreview(result.imageUrl);
        setErrors((prev) => ({ ...prev, image: null }));
      } else {
        setErrors((prev) => ({
          ...prev,
          image: uploadError || "Failed to upload image",
        }));
      }
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        image: uploadError || "Failed to upload image",
      }));
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
    if (!validateForm()) return;

    setLoading(true);

    try {
      const postData = {
        title: formData.title,
        description: formData.description,
        content: formData.content,
        category_id: parseInt(formData.category_id),
        status_id: isDraft ? 1 : 2,
        image: formData.image,
      };

      const result = await updatePost(postId, postData);

      if (result.success) {
        alert(
          `Article ${
            isDraft ? "saved as draft" : "updated and published"
          } successfully!`
        );
        navigate("/admin/article-management");
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      alert("An unexpected error occurred");
      console.error("Submit error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    setDeleteModal({ open: true });
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${apiBaseUrl}/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setDeleteModal({ open: false });
      alert("Article deleted successfully!");
      navigate("/admin/article-management");
    } catch (error) {
      setDeleteModal({ open: false });
      alert("Failed to delete article");
      console.error("Delete error:", error);
    }
  };

  const cancelDelete = () => {
    setDeleteModal({ open: false });
  };

  if (fetchingPost) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading article...</p>
      </div>
    );
  }

  return (
    <div>
      {/* DELETE MODAL */}
      {deleteModal.open && (
        <>
          {/* BACKDROP - Blurred background */}
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
            onClick={cancelDelete}
          />

          {/* MODAL DIALOG */}
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div className="bg-[#F9F8F6] rounded-2xl shadow-xl p-8 max-w-md w-full mx-8 relative pointer-events-auto">
              {/* Close button */}
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

              {/* Content */}
              <h2 className="text-2xl font-bold text-[#333333] my-2 py-8">
                Delete article
              </h2>
              <p className="text-[#75716B] mb-6">
                Do you want to delete this article?
              </p>

              {/* Buttons */}
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

      {/* HEADER */}
      <div className="flex justify-between items-center pb-8 mb-4 mt-4 border-b">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/article-management")}
            className="text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold">Edit article</h1>
        </div>
        <div className="flex gap-6">
          <Button
            className="px-10 py-6 border border-red-500 text-red-500 rounded-full hover:bg-red-50 transition-colors"
            variant="outline"
            onClick={handleDelete}
            disabled={loading}
          >
            Delete
          </Button>
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
            {loading ? "Updating..." : "Update and publish"}
          </Button>
        </div>
      </div>

      {/* FORM */}
      <div className="bg-white p-8 rounded-lg shadow-sm">
        <div className="space-y-6">
          {/* Thumbnail Image */}
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
                  <p className="mt-2 text-sm text-gray-500">
                    No image uploaded
                  </p>
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
            {errors.image && (
              <p className="text-sm text-red-500">{errors.image}</p>
            )}
          </div>

          {/* Form Fields */}
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
                onValueChange={(value) =>
                  handleInputChange("category_id", value)
                }
              >
                <SelectTrigger className="w-1/2">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.id.toString()}
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category_id && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.category_id}
                </p>
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
                placeholder="Author name"
                value={user?.name || ""}
                disabled={true}
                className="w-1/2 bg-[#EFEEEB] cursor-not-allowed"
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
                <p className="text-sm text-red-500 mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="content"
                className="flex py-2 text-sm font-medium text-[#75716B] mb-1"
              >
                Content
              </label>
              <Textarea
                id="content"
                placeholder="Content"
                rows={12}
                value={formData.content}
                onChange={(e) => handleInputChange("content", e.target.value)}
                className="w-full"
              />
              {errors.content && (
                <p className="text-sm text-red-500 mt-1">{errors.content}</p>
              )}
            </div>
          </div>
        </div>
        <div className="flex my-4">
        <Button
          className="flex border-none text-md text-center text-gray-400 items-center hover:text-gray-600 transition-colors"
          onClick={handleDelete}      
          variant="outline"
          disabled={loading}
        >
          <Trash2 size={18} />
          Delete article
        </Button>
      </div>
      </div>
    </div>
  );
};

export default EditArticle;