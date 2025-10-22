'use client';

import { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { ArrowLeft02Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

// ✅ Import React QuillJS
import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.snow.css';

export default function CreateBlog() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [description, setDescription] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize Quill editor
  const { quill, quillRef } = useQuill({
    theme: 'snow',
    modules: {
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ align: [] }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image'],
        [{ color: [] }, { background: [] }],
        ['clean'],
      ],
    },
  });

  // Update description state whenever Quill content changes
  if (quill) {
    quill.on('text-change', () => {
      setDescription(quill.root.innerHTML);
    });
  }

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

  const handlePost = () => {
    const blogData = {
      title,
      image: image?.name || null,
      imagePreview,
      description,
      createdAt: new Date().toISOString(),
    };
    console.log('Blog Data:', blogData);
  };

  return (
    <div className="min-h-screen ml-16">
      <div>
        {/* Header Section */}
        <div className="bg-white mb-8 rounded-lg shadow-sm px-8 pt-5 pb-3">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <button
                onClick={() => router.push('/pages/blogs')}
                className="flex items-center gap-2 hover:text-gray-900"
              >
                <span><HugeiconsIcon icon={ArrowLeft02Icon} /></span>
                <span>Blog Management</span>
              </button>
              <span><HugeiconsIcon icon={ArrowRight01Icon} /></span>
              <span className="text-gray-900">Create Blog</span>
            </div>
          </div>

          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold">Create Blog</h1>
            <button
              onClick={handlePost}
              className="px-6 py-2 bg-[#C9A040] font-semibold rounded-lg hover:bg-[#B89030] transition"
            >
              Post
            </button>
          </div>
        </div>

        {/* Blog Form Section */}
        <div className="bg-white rounded-lg py-5 px-8">
          {/* Title */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter title"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#C9A040] focus:border-transparent"
            />
          </div>

          {/* Image Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Choose Image</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-2 font-semibold bg-[#C9A040] rounded-lg hover:bg-[#B89030] transition"
            >
              Select Image
            </button>
            {imagePreview && (
              <div className="mt-3">
                <img src={imagePreview} alt="Preview" className="max-w-xs rounded border" />
              </div>
            )}
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Description</label>
            <div className="bg-white border border-gray-300 rounded">
              <div ref={quillRef} className="min-h-[300px]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}