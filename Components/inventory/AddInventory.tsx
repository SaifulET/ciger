'use client'
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { ArrowLeft02Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import 'quill/dist/quill.snow.css';
import { useQuill } from 'react-quilljs';

// Define types
interface ProductImage {
  name: string;
  data: string;
}

interface FormData {
  category: string;
  subCategory: string;
  brand: string;
  productName: string;
  productQuantity: string;
  productStock: string;
  productPrice: string;
  productSalePrice: string;
  productState: string | null;
  productDescription: string;
  selectedImage: ProductImage | null;
}

const InventoryAddItem = () => {
  const [formData, setFormData] = useState<FormData>({
    category: '',
    subCategory: '',
    brand: '',
    productName: '',
    productQuantity: '',
    productStock: '',
    productPrice: '',
    productSalePrice: '',
    productState: null,
    productDescription: '',
    selectedImage: null,
  });

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  
  // Quill editor configuration
  const { quill, quillRef } = useQuill({
    modules: {
      toolbar: {
        container: [
          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
          [{ 'size': ['small', false, 'large', 'huge'] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          [{ 'align': [] }],
          [{ 'color': [] }, { 'background': [] }],
          ['link', 'image'],
          ['clean']
        ]
      }
    },
    formats: [
      'header',
      'size',
      'bold', 
      'italic', 
      'underline', 
      'strike',
      'list',
      'align',
      'color', 
      'background',
      'link', 
      'image'
    ],
    theme: 'snow'
  });

  // Mock data for dropdowns
  const categories = ['Electronics', 'Clothing', 'Food', 'Books'];
  const subCategories: Record<string, string[]> = {
    Electronics: ['Phones', 'Laptops', 'Tablets'],
    Clothing: ['Men', 'Women', 'Kids'],
    Food: ['Snacks', 'Beverages', 'Dairy'],
    Books: ['Fiction', 'Non-Fiction', 'Educational'],
  };
  const brands = ['Samsung', 'Apple', 'Sony', 'LG', 'Generic'];

  // Initialize Quill editor
  useEffect(() => {
    if (quill) {
      // Force LTR direction at multiple levels
      const editor = quill.root;
      
      // Set CSS direction and alignment
      editor.style.direction = 'ltr';
      editor.style.textAlign = 'left';
      
      // Set Quill format for direction
      quill.format('direction', 'ltr');
      
      // Apply LTR to the entire editor container
      const container = document.querySelector('.ql-container');
      if (container) {
        (container as HTMLElement).style.direction = 'ltr';
        (container as HTMLElement).style.textAlign = 'left';
      }

      // Apply LTR to the editor content
      const editorContent = document.querySelector('.ql-editor');
      if (editorContent) {
        (editorContent as HTMLElement).style.direction = 'ltr';
        (editorContent as HTMLElement).style.textAlign = 'left';
      }

      // Set initial content
      quill.clipboard.dangerouslyPasteHTML(formData.productDescription || 'This is awesome!');
      
      // Ensure all content has LTR direction
      quill.formatText(0, quill.getLength(), 'direction', 'ltr');
      
      quill.on('text-change', () => {
        const html = quill.root.innerHTML;
        setFormData(prev => ({ ...prev, productDescription: html }));
        
        // Continuously enforce LTR direction
        quill.format('direction', 'ltr');
      });

      // Force LTR on selection change (when user clicks or types)
      quill.on('selection-change', () => {
        setTimeout(() => {
          quill.format('direction', 'ltr');
        }, 0);
      });
    }
  }, [quill]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDropdownSelect = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setOpenDropdown(null);
  };

  const handleProductState = (state: string) => {
    setFormData(prev => ({
      ...prev,
      productState: prev.productState === state ? null : state,
    }));
  };

  const handleImageSelect = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          selectedImage: {
            name: file.name,
            data: reader.result as string,
          },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const productObject = {
      ...formData,
      timestamp: new Date().toISOString(),
    };
    console.log('Product saved:', productObject);
    alert('Product saved! Check console for details.');
    router.push("/pages/inventory");
  };

  const handleCancel = () => {
    setFormData({
      category: '',
      subCategory: '',
      brand: '',
      productName: '',
      productQuantity: '',
      productStock: '',
      productPrice: '',
      productSalePrice: '',
      productState: null,
      productDescription: '',
      selectedImage: null,
    });
    
    // Reset Quill editor content
    if (quill) {
      quill.clipboard.dangerouslyPasteHTML('This is awesome!');
      quill.format('direction', 'ltr');
      quill.formatText(0, quill.getLength(), 'direction', 'ltr');
    }
    
    router.push("/pages/inventory");
  };

  const getSubCategoryOptions = () => {
    if (!formData.category) return [];
    const options = subCategories[formData.category];
    return Array.isArray(options) ? options : [];
  };

  const handleCategorySelect = (cat: string) => {
    handleDropdownSelect('category', cat);
    setFormData(prev => ({ ...prev, subCategory: '' }));
  };

  return (
    <div className="min-h-screen ml-10">
      <div className="">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 py-6 px-6 rounded-lg bg-white">
          <div className="flex items-center gap-3 ">
            <Link href="/pages/inventory" className='flex pl-5'>
              <button className="hover:text-gray-900">
                <HugeiconsIcon icon={ArrowLeft02Icon} />
              </button>
              <span className="">Inventory Management</span>
            </Link>
            <span className=""><HugeiconsIcon icon={ArrowRight01Icon} /></span>
            <span className="">Add Item</span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-[#C9A040] text-white rounded-lg font-medium hover:bg-[#8a6e2c] transition"
            >
              Save
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg p-6">
          <h1 className="text-3xl font-bold mb-8 text-gray-900">Inventory Management</h1>

          {/* Category */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <button
                onClick={() => setOpenDropdown(openDropdown === 'category' ? null : 'category')}
                className="w-full px-4 py-3 bg-gray-100 rounded-lg text-left text-gray-600 hover:bg-gray-200 transition flex justify-between items-center"
              >
                <span>{formData.category || 'Category Name'}</span>
                <ChevronDown className="w-5 h-5" />
              </button>
              {openDropdown === 'category' && (
                <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => handleCategorySelect(cat)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg transition"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sub Category */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Sub Category <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <button
                onClick={() => setOpenDropdown(openDropdown === 'subCategory' ? null : 'subCategory')}
                className="w-full px-4 py-3 bg-gray-100 rounded-lg text-left text-gray-600 hover:bg-gray-200 transition flex justify-between items-center"
                disabled={!formData.category}
              >
                <span>{formData.subCategory || 'Sub Category Name'}</span>
                <ChevronDown className="w-5 h-5" />
              </button>
              {openDropdown === 'subCategory' && formData.category && (
                <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {getSubCategoryOptions().length > 0 ? (
                    getSubCategoryOptions().map((subCat, idx) => (
                      <button
                        key={`${subCat}-${idx}`}
                        onClick={() => handleDropdownSelect('subCategory', subCat)}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 transition text-gray-900"
                      >
                        {subCat}
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-gray-500 text-sm">No subcategories available</div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Brand */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Brand <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <button
                onClick={() => setOpenDropdown(openDropdown === 'brand' ? null : 'brand')}
                className="w-full px-4 py-3 bg-gray-100 rounded-lg text-left text-gray-600 hover:bg-gray-200 transition flex justify-between items-center"
              >
                <span>{formData.brand || 'Brand Name'}</span>
                <ChevronDown className="w-5 h-5" />
              </button>
              {openDropdown === 'brand' && (
                <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                  {brands.map(brand => (
                    <button
                      key={brand}
                      onClick={() => handleDropdownSelect('brand', brand)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg transition"
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Product Name */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="productName"
              value={formData.productName}
              onChange={handleInputChange}
              placeholder="Name"
              className="w-full px-4 py-3 bg-gray-100 rounded-lg text-gray-900 placeholder-gray-500 hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-[#C9A040]"
            />
          </div>

          {/* Product Quantity and Stock */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Product Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="productQuantity"
                value={formData.productQuantity}
                onChange={handleInputChange}
                placeholder="Quantity"
                className="w-full px-4 py-3 bg-gray-100 rounded-lg text-gray-900 placeholder-gray-500 hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-[#C9A040]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Product Stock <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="productStock"
                value={formData.productStock}
                onChange={handleInputChange}
                placeholder="Stock"
                className="w-full px-4 py-3 bg-gray-100 rounded-lg text-gray-900 placeholder-gray-500 hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-[#C9A040]"
              />
            </div>
          </div>

          {/* Product Price and Sale Price */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Product Price <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="productPrice"
                value={formData.productPrice}
                onChange={handleInputChange}
                placeholder="Price"
                className="w-full px-4 py-3 bg-gray-100 rounded-lg text-gray-900 placeholder-gray-500 hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-[#C9A040]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Product Sale Price in discount % <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="productSalePrice"
                value={formData.productSalePrice}
                onChange={handleInputChange}
                placeholder="Sale Price"
                className="w-full px-4 py-3 bg-gray-100 rounded-lg text-gray-900 placeholder-gray-500 hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-[#C9A040]"
              />
            </div>
          </div>

          {/* Product State */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Product State <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => handleProductState('newArrivals')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  formData.productState === 'newArrivals'
                    ? 'bg-[#C9A040] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                New Arrivals
              </button>
              <button
                onClick={() => handleProductState('bestSeller')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  formData.productState === 'bestSeller'
                    ? 'bg-[#C9A040] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Best Seller
              </button>
            </div>
          </div>

          {/* Product Description (Quill Editor) */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Product Description <span className="text-red-500">*</span>
            </label>
            <div className="h-64" style={{ direction: 'ltr' }}>
              <div ref={quillRef} />
            </div>
          </div>

          {/* Choose Image */}
          <div className="mb-6  mt-16">
            <label className="block text-sm font-semibold text-gray-900 mb-2">Choose Image</label>
            <div className="flex items-center gap-3">
              <button
                onClick={handleImageSelect}
                className="px-4 py-2 bg-[#C9A040] text-white rounded-lg font-medium hover:bg-[#8b6f2c] transition"
              >
                Select image
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              {formData.selectedImage && (
                <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg">
                  <span className="text-sm text-gray-700">{formData.selectedImage.name}</span>
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, selectedImage: null }))}
                    className="text-gray-500 hover:text-red-500 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryAddItem;