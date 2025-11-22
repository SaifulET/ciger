'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft02Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.snow.css';
import { useBlogStore } from '@/app/store/blogStore';

export default function EditBlog() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const { currentBlog, fetchBlogById, updateBlog, loading, error, setCurrentBlog } = useBlogStore();
  const [title, setTitle] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [description, setDescription] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isInitialDataLoaded, setIsInitialDataLoaded] = useState(false);
  const [isQuillReady, setIsQuillReady] = useState(false);

  const { quill, quillRef } = useQuill({
    theme: 'snow',
    modules: {
      toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ align: [] }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image'],
        [{ color: [] }, { background: [] }],
        ['clean']
      ],
    },
  });

  // Clear current blog when component unmounts
  useEffect(() => {
    return () => {
      setCurrentBlog(null);
    };
  }, [setCurrentBlog]);

  // Reset form state when id changes
  useEffect(() => {
    setIsInitialDataLoaded(false);
    setIsQuillReady(false);
    setTitle('');
    setImage(null);
    setImagePreview('');
    setDescription('');
  }, [id]);

  // Fetch blog data when component mounts or id changes
  useEffect(() => {
    if (id) {
      setCurrentBlog(null);
      fetchBlogById(id);
    }
  }, [id, fetchBlogById, setCurrentBlog]);

  // Update form data when currentBlog changes
  useEffect(() => {
    if (currentBlog && currentBlog._id === id && !isInitialDataLoaded) {
      setTitle(currentBlog.name || '');
      setImagePreview(currentBlog.image || '');
      setDescription(currentBlog.description || '');
      setIsInitialDataLoaded(true);
    }
  }, [currentBlog, id, isInitialDataLoaded]);

  // Initialize Quill editor when it's ready and data is loaded
  useEffect(() => {
    if (quill && isInitialDataLoaded && !isQuillReady) {
      quill.setText('');
      if (description) {
        quill.clipboard.dangerouslyPasteHTML(description);
      }
      setIsQuillReady(true);
    }
  }, [quill, isInitialDataLoaded, isQuillReady, description]);

  // Handle Quill content changes
  useEffect(() => {
    if (quill && isQuillReady) {
      const handler = () => {
        const html = quill.root.innerHTML;
        if (html !== description && html !== '<p><br></p>') {
          setDescription(html);
        }
      };

      quill.on('text-change', handler);

      return () => {
        quill.off('text-change', handler);
      };
    }
  }, [quill, isQuillReady, description]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    if (currentBlog) {
      setImagePreview(currentBlog.image);
    } else {
      setImagePreview('');
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !description.trim() || description === '<p><br></p>') {
      alert('Please fill in all required fields');
      return;
    }

    // Create JSON-like data object to pass to store
    const blogData = {
      name: title,
      description: description,
      image: image || currentBlog?.image, // Pass File object or existing image URL
    };

    try {
      const result = await updateBlog(id, blogData);
      if (result.success) {
        router.push('/pages/blogs');
      } else {
        alert(result.message || 'Failed to update blog');
      }
    } catch (error) {
      console.error('Error updating blog:', error);
      alert('Error updating blog');
    }
  };

  const handleCancel = () => {
    setCurrentBlog(null);
    router.push('/pages/blogs');
  };

  // Loading state
  if (!currentBlog && loading) {
    return (
      <div className="min-h-screen ml-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9A040] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading blog data...</p>
        </div>
      </div>
    );
  }

  if (!id) {
    return (
      <div className="min-h-screen ml-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Blog Not Found</h1>
          <p className="text-gray-600">No blog ID provided.</p>
        </div>
      </div>
    );
  }

  if (!currentBlog && !loading) {
    return (
      <div className="min-h-screen ml-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Blog Not Found</h1>
          <p className="text-gray-600">The blog you are trying to edit does not exist.</p>
          <button
            onClick={() => router.push("/pages/blogs")}
            className="mt-4 px-6 py-2 bg-[#C9A040] text-white rounded-lg font-medium hover:bg-[#8a6e2c] transition"
          >
            Back to Blogs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ml-16">
      <div>
        {/* Header Section */}
        <div className="bg-white mb-6 shadow-sm px-8 py-6 rounded-lg">
          <div className="flex items-center gap-3 text-sm text-gray-600 mb-6">
            <button
              onClick={() => router.push('/pages/blogs')}
              className="flex items-center gap-2 hover:text-gray-900"
            >
              <span><HugeiconsIcon icon={ArrowLeft02Icon} /></span>
              <span>Blog Management</span>
            </button>
            <span><HugeiconsIcon icon={ArrowRight01Icon} /></span>
            <span className="text-gray-900 font-medium">Edit Blog</span>
          </div>

          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Edit Blog</h1>
            <div className="flex items-center gap-3">
              <button
                onClick={handleCancel}
                className="px-8 py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-8 py-3 bg-[#C9A040] text-white font-semibold rounded-lg hover:bg-[#B89030] transition disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>

        {/* Blog Form Section */}
        <div className="bg-white rounded-lg shadow-sm py-6 px-8">
          {/* Title */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter title"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A040] focus:border-transparent bg-gray-50"
            />
          </div>

          {/* Image Upload */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Choose Image {!image && <span className="text-gray-500 text-xs">(Optional - keep current image if not selected)</span>}
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
            <div className="flex items-center gap-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-8 py-3 font-semibold bg-[#C9A040] text-white rounded-lg hover:bg-[#B89030] transition"
              >
                {image ? 'Change Image' : 'Select New Image'}
              </button>
              {image && (
                <button
                  onClick={handleRemoveImage}
                  className="px-4 py-3 font-semibold bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  Remove New Image
                </button>
              )}
            </div>
            {imagePreview && (
              <div className="mt-4">
                <img src={imagePreview} alt="Preview" className="max-w-sm rounded-lg border border-gray-200 shadow-sm" />
                {image && (
                  <p className="text-sm text-gray-600 mt-1">New image selected: {image.name}</p>
                )}
                {!image && currentBlog && (
                  <p className="text-sm text-gray-600 mt-1">Current image</p>
                )}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">Description *</label>
            <div className="bg-gray-50 border border-gray-300 rounded-lg overflow-hidden" style={{ direction: 'ltr' }}>
              <div ref={quillRef} className="min-h-[300px]" />
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}