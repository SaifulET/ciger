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
  productQuantity: number;
  productStock: number;
  productPrice: number;
  productSalePrice: number;
  productState: string | null;
  productDescription: string;
  selectedImage: ProductImage | null;
}

const InventoryEditItem = () => {
  // Example existing product (you can replace it with API data)
  const existingProduct: FormData = {
    category: 'Electronics',
    subCategory: 'Phones',
    brand: 'Samsung',
    productName: 'Galaxy S24 Ultra',
    productQuantity: 20,
    productStock: 10,
    productPrice: 999,
    productSalePrice: 15,
    productState: 'bestSeller',
    productDescription: '<p>Powerful smartphone with advanced AI features.</p>',
    selectedImage: { name: 'galaxy-s24.png', data: '' },
  };

  const [formData, setFormData] = useState<FormData>(existingProduct);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  // Quill editor configuration with font size and proper direction
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

  // Mock data
  const categories = ['Electronics', 'Clothing', 'Food', 'Books'];
  const subCategories: Record<string, string[]> = {
    Electronics: ['Phones', 'Laptops', 'Tablets'],
    Clothing: ['Men', 'Women', 'Kids'],
    Food: ['Snacks', 'Beverages', 'Dairy'],
    Books: ['Fiction', 'Non-Fiction', 'Educational'],
  };
  const brands = ['Samsung', 'Apple', 'Sony', 'LG', 'Generic'];
  const router = useRouter();

  // Initialize Quill editor with existing content
useEffect(() => {
  if (!quill) return;

  quill.root.style.direction = "ltr";
  quill.root.style.textAlign = "left";
  quill.format("direction", "ltr");
  quill.format("align", "left");

  quill.clipboard.dangerouslyPasteHTML(formData.productDescription);

  const handler = () => {
    setFormData(prev => ({
      ...prev,
      productDescription: quill.root.innerHTML
    }));
  };

  quill.on("text-change", handler);

  return () => {
    quill.off("text-change", handler);
  };
}, [quill]); // ✅ only initialize ONCE


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name.includes('Quantity') || name.includes('Stock') || name.includes('Price') || name.includes('SalePrice') 
        ? Number(value) 
        : value 
    }));
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

  const handleImageSelect = () => fileInputRef.current?.click();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          selectedImage: { name: file.name, data: reader.result as string },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const updatedProduct = {
      ...formData,
      updatedAt: new Date().toISOString(),
    };
    console.log('Product updated:', updatedProduct);
    router.push("/pages/inventory");
  };

  const handleCancel = () => {
    setFormData(existingProduct);
    if (quill) {
      quill.clipboard.dangerouslyPasteHTML(existingProduct.productDescription);
      // Reset formatting to LTR
      quill.format('direction', 'ltr');
      quill.format('align', 'left');
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
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-8 py-6 px-4 rounded-lg bg-white">
          <div className="flex items-center gap-3">
            <Link href="/pages/inventory" className="flex pl-5">
              <button className="hover:text-gray-900">
                <HugeiconsIcon icon={ArrowLeft02Icon} />
              </button>
              <span>Inventory Management</span>
            </Link>
            <span><HugeiconsIcon icon={ArrowRight01Icon} /></span>
            <span>Edit Item</span>
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
                className="w-full px-4 py-3 bg-gray-100 rounded-lg text-left text-gray-600 hover:bg-gray-200 transition flex justify-between items-center"
                disabled={!formData.category}
              >
                <span>{formData.subCategory || 'Sub Category Name'}</span>
                <ChevronDown className="w-5 h-5" />
              </button>
              {openDropdown === 'subCategory' && formData.category && (
                <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {getSubCategoryOptions().map((subCat, idx) => (
                    <button
                      key={`${subCat}-${idx}`}
                      onClick={() => handleDropdownSelect('subCategory', subCat)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 transition text-gray-900"
                    >
                      {subCat}
                    </button>
                  ))}
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
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 transition"
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
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
                className="w-full px-4 py-3 bg-gray-100 rounded-lg focus:ring-2 focus:ring-[#C9A040]"
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
                className="w-full px-4 py-3 bg-gray-100 rounded-lg focus:ring-2 focus:ring-[#C9A040]"
              />
            </div>
          </div>

          {/* Price & Sale */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Product Price
              </label>
              <input
                type="number"
                name="productPrice"
                value={formData.productPrice}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-100 rounded-lg focus:ring-2 focus:ring-[#C9A040]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Product Sale Price (%)
              </label>
              <input
                type="number"
                name="productSalePrice"
                value={formData.productSalePrice}
                onChange={handleInputChange}
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
            <div className="h-64 [direction:ltr]">
              <div ref={quillRef} className="[direction:ltr] [text-align:left]" />
            </div>
          </div>

          {/* Product Image */}
          <div className="mb-6 mt-16">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Product Image
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={handleImageSelect}
                className="px-4 py-2 bg-[#C9A040] text-white rounded-lg font-medium hover:bg-[#8b6f2c]"
              >
                Change Image
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
                    className="text-gray-500 hover:text-red-500"
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

export default InventoryEditItem;