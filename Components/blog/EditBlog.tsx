'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft02Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

// ✅ Import React QuillJS
import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.snow.css';

// Initial blog data object
const initialBlogData = {
  title: 'This is awesome',
  image: 'sample-image.jpg',
  imagePreview: 'https://via.placeholder.com/400x300',
  description: '<p>This is awesome content with <strong>rich text</strong> formatting.</p>',
  createdAt: '2025-01-15T10:30:00.000Z',
};

export default function EditBlog() {
  const router = useRouter();
  const [title, setTitle] = useState(initialBlogData.title);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(initialBlogData.imagePreview);
  const [description, setDescription] = useState(initialBlogData.description);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [quillInitialized, setQuillInitialized] = useState(false);

  // Define toolbar options separately for better organization
  const toolbarOptions = [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{ 'font': ['sans-serif', 'serif', 'monospace', 'arial', 'courier', 'georgia', 'helvetica', 'times-new-roman', 'verdana'] }],
    [{ 'size': ['small', false, 'large', 'huge'] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'align': [] }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ['link', 'image'],
    [{ 'color': [] }, { 'background': [] }],
    ['clean']
  ];

  // Initialize Quill editor
  const { quill, quillRef, Quill } = useQuill({
    theme: 'snow',
    modules: {
      toolbar: toolbarOptions
    },
    formats: [
      'header', 'font', 'size',
      'bold', 'italic', 'underline', 'strike',
      'align', 'list',
      'link', 'image',
      'color', 'background',
      'clean'
    ]
  });

  // Initialize Quill with proper configuration
  useEffect(() => {
    if (Quill && !quillInitialized) {
      try {
        // Register font and size formats
        const FontAttributor = Quill.import('attributors/class/font');
        FontAttributor.whitelist = [
          'sans-serif', 'serif', 'monospace', 
          'arial', 'courier', 'georgia', 
          'helvetica', 'times-new-roman', 'verdana'
        ];
        Quill.register(FontAttributor, true);

        const SizeStyle = Quill.import('attributors/style/size');
        SizeStyle.whitelist = [
          'small', false, 'large', 'huge',
          '10px', '12px', '14px', '16px', '18px', '20px', 
          '24px', '28px', '32px', '36px', '48px', '64px'
        ];
        Quill.register(SizeStyle, true);

        setQuillInitialized(true);
      } catch (err) {
        console.error('Quill registration error:', err);
      }
    }
  }, [Quill, quillInitialized]);

  // Set initial content when quill is ready
  useEffect(() => {
    if (quill && quillInitialized) {
      // Set initial content
      quill.clipboard.dangerouslyPasteHTML(initialBlogData.description);
      
      // Set up text change handler
      const handler = () => {
        setDescription(quill.root.innerHTML);
      };
      
      quill.on('text-change', handler);
      
      // Cleanup
      return () => {
        quill.off('text-change', handler);
      };
    }
  }, [quill, quillInitialized]);

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

  const handleSave = () => {
    const updatedBlogData = {
      title,
      image: image?.name || initialBlogData.image,
      imagePreview,
      description,
      updatedAt: new Date().toISOString(),
    };
    console.log('Updated Blog Data:', updatedBlogData);
  };

  const handleCancel = () => {
    router.push('/pages/blogs');
  };

  return (
    <>
      <style jsx global>{`
        /* Global Quill Editor Styles */
        .ql-editor {
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          line-height: 1.6;
          min-height: 300px;
        }

        /* Font Family Styles */
        .ql-font-sans-serif { 
          font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important; 
        }
        .ql-font-serif { 
          font-family: 'Georgia', 'Times New Roman', serif !important; 
        }
        .ql-font-monospace { 
          font-family: 'Courier New', 'Monaco', 'Menlo', monospace !important; 
        }
        .ql-font-arial { 
          font-family: 'Arial', 'Helvetica', sans-serif !important; 
        }
        .ql-font-courier { 
          font-family: 'Courier New', 'Courier', monospace !important; 
        }
        .ql-font-georgia { 
          font-family: 'Georgia', serif !important; 
        }
        .ql-font-helvetica { 
          font-family: 'Helvetica', 'Arial', sans-serif !important; 
        }
        .ql-font-times-new-roman { 
          font-family: 'Times New Roman', 'Times', serif !important; 
        }
        .ql-font-verdana { 
          font-family: 'Verdana', 'Geneva', sans-serif !important; 
        }

        /* Font Size Styles */
        .ql-size-small { font-size: 12px !important; }
        .ql-size-large { font-size: 18px !important; }
        .ql-size-huge { font-size: 24px !important; }

        /* Additional pixel sizes */
        .ql-size-10px { font-size: 10px !important; }
        .ql-size-12px { font-size: 12px !important; }
        .ql-size-14px { font-size: 14px !important; }
        .ql-size-16px { font-size: 16px !important; }
        .ql-size-18px { font-size: 18px !important; }
        .ql-size-20px { font-size: 20px !important; }
        .ql-size-24px { font-size: 24px !important; }
        .ql-size-28px { font-size: 28px !important; }
        .ql-size-32px { font-size: 32px !important; }
        .ql-size-36px { font-size: 36px !important; }
        .ql-size-48px { font-size: 48px !important; }
        .ql-size-64px { font-size: 64px !important; }

        /* Toolbar Picker Labels */
        .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="sans-serif"]::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="sans-serif"]::before {
          content: 'Sans Serif';
          font-family: 'Inter', sans-serif;
        }
        .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="serif"]::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="serif"]::before {
          content: 'Serif';
          font-family: 'Georgia', serif;
        }
        .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="monospace"]::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="monospace"]::before {
          content: 'Monospace';
          font-family: 'Courier New', monospace;
        }
        .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="arial"]::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="arial"]::before {
          content: 'Arial';
          font-family: Arial, sans-serif;
        }
        .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="courier"]::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="courier"]::before {
          content: 'Courier';
          font-family: 'Courier New', monospace;
        }
        .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="georgia"]::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="georgia"]::before {
          content: 'Georgia';
          font-family: Georgia, serif;
        }
        .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="helvetica"]::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="helvetica"]::before {
          content: 'Helvetica';
          font-family: Helvetica, sans-serif;
        }
        .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="times-new-roman"]::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="times-new-roman"]::before {
          content: 'Times New Roman';
          font-family: 'Times New Roman', serif;
        }
        .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="verdana"]::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="verdana"]::before {
          content: 'Verdana';
          font-family: Verdana, sans-serif;
        }

        /* Size Picker Labels */
        .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="small"]::before,
        .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="small"]::before {
          content: 'Small';
          font-size: 12px;
        }
        .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="large"]::before,
        .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="large"]::before {
          content: 'Large';
          font-size: 18px;
        }
        .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="huge"]::before,
        .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="huge"]::before {
          content: 'Huge';
          font-size: 24px;
        }
      `}</style>

      <div className="ml-16">
        <div>
          {/* Header Section */}
          <div className="bg-white mb-6 shadow-sm px-8 py-6 rounded-lg">
            {/* Breadcrumb */}
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

            {/* Title and Actions */}
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
                  className="px-8 py-3 bg-[#C9A040] text-white font-semibold rounded-lg hover:bg-[#B89030] transition"
                >
                  Save
                </button>
              </div>
            </div>
          </div>

          {/* Blog Form Section */}
          <div className="bg-white rounded-lg shadow-sm py-6 px-8">
            {/* Title */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-2">Title</label>
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
              <label className="block text-sm font-semibold text-gray-900 mb-2">Choose Image</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-8 py-3 font-semibold bg-[#C9A040] text-white rounded-lg hover:bg-[#B89030] transition"
              >
                Select Image
              </button>
              {imagePreview && (
                <div className="mt-4">
                  <img src={imagePreview} alt="Preview" className="max-w-sm rounded-lg border border-gray-200 shadow-sm" />
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-2">Description</label>
              <div className="bg-gray-50 border border-gray-300 rounded-lg overflow-hidden">
                <div ref={quillRef} className="min-h-[300px] bg-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}