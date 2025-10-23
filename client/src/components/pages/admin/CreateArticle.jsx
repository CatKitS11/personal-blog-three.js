import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UploadCloud, X } from "lucide-react";
import { useAdminPosts } from '../../../hooks/useAdminPosts';
import { usePostImageUpload } from '../../../hooks/usePostImageUpload'; // เปลี่ยนจาก uploadProfilePic
import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const CreateArticle = () => {
  const navigate = useNavigate();
  const { createPost } = useAdminPosts();
  const { uploadPostImage, uploading, error: uploadError } = usePostImageUpload(); // เพิ่ม error
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    category_id: '',
    author_name: 'Thompson P.',
    status_id: 2,
    image: ''
  });
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  // Fetch categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesResponse = await axios.get(`${apiBaseUrl}/categories`);
        setCategories(categoriesResponse.data.categories || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([
          { id: 1, name: 'Cat' },
          { id: 2, name: 'General' },
          { id: 3, name: 'Inspiration' }
        ]);
      }
    };
    
    fetchData();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, image: 'Please select an image file' }));
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, image: 'Image size must be less than 5MB' }));
      return;
    }

    try {
      console.log('Starting upload...', file.name, file.size); // Debug log
      
      const result = await uploadPostImage(file);
      
      if (result) {
        console.log('Upload successful:', result); // Debug log
        setFormData(prev => ({ ...prev, image: result.imageUrl }));
        setImagePreview(result.imageUrl);
        setErrors(prev => ({ ...prev, image: null }));
      } else {
        console.log('Upload failed - no result'); // Debug log
        setErrors(prev => ({ ...prev, image: uploadError || 'Failed to upload image' }));
      }
    } catch (error) {
      console.error('Upload catch error:', error); // Debug log
      setErrors(prev => ({ ...prev, image: uploadError || 'Failed to upload image' }));
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: '' }));
    setImagePreview(null);
    setErrors(prev => ({ ...prev, image: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Introduction is required';
    if (!formData.content.trim()) newErrors.content = 'Content is required';
    if (!formData.category_id) newErrors.category_id = 'Category is required';
    if (!formData.image) newErrors.image = 'Image is required';
    
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
        status_id: isDraft ? 2 : 1,
        image: formData.image
      };
      
      const result = await createPost(postData);
      
      if (result.success) {
        alert(`Article ${isDraft ? 'saved as draft' : 'published'} successfully!`);
        navigate('/admin/article-management');
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      alert('An unexpected error occurred');
      console.error('Submit error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Create article</h1>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={() => handleSubmit(true)}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save as draft'}
          </Button>
          <Button 
            className="bg-black text-white"
            onClick={() => handleSubmit(false)}
            disabled={loading}
          >
            {loading ? 'Publishing...' : 'Save and publish'}
          </Button>
        </div>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-sm">
        <div className="space-y-6">
          {/* Thumbnail Image - Top section */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Thumbnail image
            </label>
            
            {/* Debug info */}
            {process.env.NODE_ENV === 'development' && (
              <div className="text-xs text-gray-500 p-2 bg-gray-100 rounded">
                <p>API URL: {import.meta.env.VITE_API_BASE_URL}</p>
                <p>Token exists: {localStorage.getItem('token') ? 'Yes' : 'No'}</p>
                <p>User role: {localStorage.getItem('userRole')}</p>
                {uploadError && <p className="text-red-500">Upload Error: {uploadError}</p>}
              </div>
            )}
            
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
              className="w-full max-w-md"
              onClick={() => document.getElementById('image-upload').click()}
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : 'Upload thumbnail image'}
            </Button>
            
            {errors.image && (
              <p className="text-sm text-red-500">{errors.image}</p>
            )}
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <Select 
                value={formData.category_id} 
                onValueChange={(value) => handleInputChange('category_id', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
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
              <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
                Author name
              </label>
              <Input 
                id="author" 
                type="text" 
                placeholder="Thompson P."
                value={formData.author_name}
                onChange={(e) => handleInputChange('author_name', e.target.value)}
                className="w-full"
              />
            </div>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <Input 
                id="title" 
                type="text" 
                placeholder="Article title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full"
              />
              {errors.title && (
                <p className="text-sm text-red-500 mt-1">{errors.title}</p>
              )}
            </div>

            <div>
              <label htmlFor="introduction" className="block text-sm font-medium text-gray-700 mb-1">
                Introduction (max 120 letters)
              </label>
              <Textarea 
                id="introduction" 
                placeholder="Introduction"
                rows={3}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
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
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                Content
              </label>
              <Textarea 
                id="content" 
                placeholder="Content"
                rows={12}
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                className="w-full"
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