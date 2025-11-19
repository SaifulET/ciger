'use client'
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { ArrowLeft02Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import 'quill/dist/quill.snow.css';
import { useQuill } from 'react-quilljs';
import { useInventoryStore } from '@/app/store/inverntoryStore';
import { categories, subCategories, ProductFormData, ProductImage } from'./inventory';

const InventoryAddItem = () => {
  const [formData, setFormData] = useState<ProductFormData>({
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
    selectedImages: [],
    existingImages: [],
  });

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  
  const { createProduct, getAllBrands, brands, loading, error, clearError } = useInventoryStore();

  // Quill editor configuration
  const { quill, quillRef } = useQuill({
    modules: {
      toolbar: [
        ['bold', 'italic', 'underline'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        ['link', 'image'],
        ['clean']
      ]
    },
    theme: 'snow'
  });

  // Fetch brands on component mount
  useEffect(() => {
    getAllBrands();
  }, [getAllBrands]);

  // Initialize Quill editor
  useEffect(() => {
    if (quill) {
      // Set initial content
      quill.clipboard.dangerouslyPasteHTML(formData.productDescription || '');
      
      const handler = () => {
        const html = quill.root.innerHTML;
        setFormData(prev => ({ ...prev, productDescription: html }));
      };

      quill.on('text-change', handler);

      return () => {
        quill.off('text-change', handler);
      };
    }
  }, [quill]);

  // Clear error on unmount
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDropdownSelect = (field: keyof ProductFormData, value: string) => {
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

  // Handle multiple image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newImages: ProductImage[] = [];
      const filesArray = Array.from(files);
      
      filesArray.forEach((file, index) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newImages.push({
            name: file.name,
            data: reader.result as string,
          });
          
          // When all files are processed, update state
          if (newImages.length === filesArray.length) {
            setFormData(prev => ({
              ...prev,
              selectedImages: [...prev.selectedImages, ...newImages]
            }));
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // Remove selected image
  const removeSelectedImage = (imageIndex: number) => {
    setFormData(prev => ({
      ...prev,
      selectedImages: prev.selectedImages.filter((_, index) => index !== imageIndex)
    }));
  };

  const handleSave = async () => {
    // Validate required fields
    if (!formData.category || !formData.subCategory || !formData.brand || !formData.productName) {
      alert('Please fill in all required fields');
      return;
    }

    // Validate numbers
    if (!formData.productStock || !formData.productPrice) {
      alert('Please fill in stock and price fields');
      return;
    }

    try {
      const result = await createProduct(formData);
      if (result.success) {
        alert('Product created successfully!');
        router.push("/pages/inventory");
      } else {
        alert(result.message || 'Failed to create product');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create product';
      alert(`Failed to create product: ${errorMessage}`);
    }
  };

  const handleCancel = () => {
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
          <div className="flex items-center gap-3">
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
              disabled={loading}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-6 py-2 bg-[#C9A040] text-white rounded-lg font-medium hover:bg-[#8a6e2c] transition disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-lg p-6">
          <h1 className="text-3xl font-bold mb-8 text-gray-900">Add New Product</h1>

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
              placeholder="Enter product name"
              className="w-full px-4 py-3 bg-gray-100 rounded-lg text-gray-900 placeholder-gray-500 hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-[#C9A040]"
            />
          </div>

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
                <span>{formData.category || 'Select Category'}</span>
                <ChevronDown className="w-5 h-5" />
              </button>
              {openDropdown === 'category' && (
                <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => handleCategorySelect(cat)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 transition"
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
                disabled={!formData.category}
                className="w-full px-4 py-3 bg-gray-100 rounded-lg text-left text-gray-600 hover:bg-gray-200 transition flex justify-between items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{formData.subCategory || 'Select Sub Category'}</span>
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
                <span>{formData.brand || 'Select Brand'}</span>
                <ChevronDown className="w-5 h-5" />
              </button>
              {openDropdown === 'brand' && (
                <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {brands.length > 0 ? (
                    brands.map(brand => (
                      <button
                        key={brand._id}
                        onClick={() => handleDropdownSelect('brand', brand.name)}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 transition"
                      >
                        {brand.name}
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-gray-500 text-sm">No brands available</div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Quantity and Stock */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="productQuantity"
                value={formData.productQuantity}
                onChange={handleInputChange}
                placeholder="Enter Quantity"
                className="w-full px-4 py-3 bg-gray-100 rounded-lg focus:ring-2 focus:ring-[#C9A040]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Stock <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="productStock"
                value={formData.productStock}
                onChange={handleInputChange}
                placeholder="Enter the Stock"
                className="w-full px-4 py-3 bg-gray-100 rounded-lg focus:ring-2 focus:ring-[#C9A040]"
              />
            </div>
          </div>

          {/* Price & Discount */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Product Price ($) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="productPrice"
                value={formData.productPrice}
                onChange={handleInputChange}
                placeholder="Enter price"
                className="w-full px-4 py-3 bg-gray-100 rounded-lg focus:ring-2 focus:ring-[#C9A040]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Discount (%) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="productSalePrice"
                value={formData.productSalePrice}
                onChange={handleInputChange}
                placeholder="Enter discount percentage"
                className="w-full px-4 py-3 bg-gray-100 rounded-lg focus:ring-2 focus:ring-[#C9A040]"
              />
            </div>
          </div>

          {/* Product State */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Product State
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
            <div className="h-64 border border-gray-300 rounded-lg" style={{ direction: 'ltr' }}>
              <div ref={quillRef} />
            </div>
          </div>

          {/* Add New Images */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Add New Images (Multiple)
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={handleImageSelect}
                className="px-4 py-2 bg-[#C9A040] text-white rounded-lg font-medium hover:bg-[#8b6f2c]"
              >
                Add Images
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
              {formData.selectedImages.length > 0 && (
                <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg">
                  <span className="text-sm text-gray-700">
                    {formData.selectedImages.length} image(s) selected
                  </span>
                </div>
              )}
            </div>
            
            {/* Show selected image previews */}
            {formData.selectedImages.length > 0 && (
              <div className="mt-3 flex gap-4 flex-wrap">
                {formData.selectedImages.map((image, index) => (
                  <div key={index} className="relative">
                    <img 
                      src={image.data} 
                      alt={`Preview ${index + 1}`} 
                      className="w-32 h-32 object-cover rounded-lg border"
                    />
                    <button
                      onClick={() => removeSelectedImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryAddItem;