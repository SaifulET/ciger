'use client'
import React, { useState, useRef } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { ArrowLeft02Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import Link from 'next/link';

const InventoryAddItem = () => {
  const [formData, setFormData] = useState({
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

  const [openDropdown, setOpenDropdown] = useState(null);
  const fileInputRef = useRef(null);
  const editorRef = useRef(null);

  // Mock data for dropdowns
  const categories = ['Electronics', 'Clothing', 'Food', 'Books'];
  const subCategories = {
    Electronics: ['Phones', 'Laptops', 'Tablets'],
    Clothing: ['Men', 'Women', 'Kids'],
    Food: ['Snacks', 'Beverages', 'Dairy'],
    Books: ['Fiction', 'Non-Fiction', 'Educational'],
  };
  const brands = ['Samsung', 'Apple', 'Sony', 'LG', 'Generic'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDropdownSelect = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setOpenDropdown(null);
  };

  const handleProductState = (state) => {
    setFormData(prev => ({
      ...prev,
      productState: prev.productState === state ? null : state,
    }));
  };

  const handleImageSelect = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          selectedImage: {
            name: file.name,
            data: reader.result,
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
  };

  const getSubCategoryOptions = () => {
    if (!formData.category) return [];
    const options = subCategories[formData.category];
    return Array.isArray(options) ? options : [];
  };

  const handleCategorySelect = (cat) => {
    handleDropdownSelect('category', cat);
    setFormData(prev => ({ ...prev, subCategory: '' }));
  };

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const handleEditorChange = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      setFormData(prev => ({ ...prev, productDescription: html }));
    }
  };

  const insertListItem = (type) => {
    editorRef.current?.focus();
    
    if (type === 'bullet') {
      // Remove ordered list if exists
      if (document.queryCommandState('insertOrderedList')) {
        document.execCommand('insertOrderedList');
      }
      // Toggle bullet list
      document.execCommand('insertUnorderedList');
    } else {
      // Remove bullet list if exists
      if (document.queryCommandState('insertUnorderedList')) {
        document.execCommand('insertUnorderedList');
      }
      // Toggle ordered list
      document.execCommand('insertOrderedList');
    }
    
    handleEditorChange();
  };

  const isCommandActive = (command) => {
    return document.queryCommandState(command);
  };

  return (
    <div className="min-h-screen  ml-10">
      <div className="">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 py-6 rounded-lg bg-white">
          <div className="flex items-center gap-3 ">
           <Link href="/pages/inventory" className='flex pl-5'> <button className=" hover:text-gray-900">
             <HugeiconsIcon icon={ArrowLeft02Icon} />
            </button>
            <span className="">Inventory Management</span></Link>
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

          {/* Product Description */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Product Description <span className="text-red-500">*</span>
            </label>
            <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
              {/* Toolbar */}
              <div className="bg-gray-100 border-b border-gray-300 p-3 flex gap-2 flex-wrap items-center">
                {/* Text Formatting */}
                <div className="flex gap-1 items-center">
                  <button
                    onClick={() => execCommand('bold')}
                    className={`p-2 rounded transition text-sm font-bold ${
                      isCommandActive('bold') ? 'bg-[#C9A040] text-white' : 'hover:bg-gray-200'
                    }`}
                    title="Bold (Ctrl+B)"
                  >
                    B
                  </button>
                  <button
                    onClick={() => execCommand('italic')}
                    className={`p-2 rounded transition text-sm italic ${
                      isCommandActive('italic') ? 'bg-[#C9A040] text-white' : 'hover:bg-gray-200'
                    }`}
                    title="Italic (Ctrl+I)"
                  >
                    I
                  </button>
                  <button
                    onClick={() => execCommand('underline')}
                    className={`p-2 rounded transition text-sm underline ${
                      isCommandActive('underline') ? 'bg-[#C9A040] text-white' : 'hover:bg-gray-200'
                    }`}
                    title="Underline (Ctrl+U)"
                  >
                    U
                  </button>
                  <button
                    onClick={() => execCommand('strikethrough')}
                    className={`p-2 rounded transition text-sm line-through ${
                      isCommandActive('strikethrough') ? 'bg-[#C9A040] text-white' : 'hover:bg-gray-200'
                    }`}
                    title="Strikethrough"
                  >
                    S
                  </button>
                </div>

                <div className="w-px bg-gray-300 h-6"></div>

                {/* Lists */}
                <div className="flex gap-1 items-center">
                  <button
                    onClick={() => insertListItem('bullet')}
                    className={`p-2 rounded transition text-sm ${
                      isCommandActive('insertUnorderedList') ? 'bg-[#C9A040] text-white' : 'hover:bg-gray-200'
                    }`}
                    title="Bullet List"
                  >
                    • List
                  </button>
                  <button
                    onClick={() => insertListItem('ordered')}
                    className={`p-2 rounded transition text-sm ${
                      isCommandActive('insertOrderedList') ? 'bg-[#C9A040] text-white' : 'hover:bg-gray-200'
                    }`}
                    title="Numbered List"
                  >
                    1. List
                  </button>
                </div>

                <div className="w-px bg-gray-300 h-6"></div>

                {/* Alignment */}
                <div className="flex gap-1 items-center">
                  <button
                    onClick={() => execCommand('justifyLeft')}
                    className={`p-2 rounded transition text-sm ${
                      isCommandActive('justifyLeft') ? 'bg-[#C9A040] text-white' : 'hover:bg-gray-200'
                    }`}
                    title="Align Left"
                  >
                    ⬅
                  </button>
                  <button
                    onClick={() => execCommand('justifyCenter')}
                    className={`p-2 rounded transition text-sm ${
                      isCommandActive('justifyCenter') ? 'bg-[#C9A040] text-white' : 'hover:bg-gray-200'
                    }`}
                    title="Align Center"
                  >
                    ⬆⬇
                  </button>
                  <button
                    onClick={() => execCommand('justifyRight')}
                    className={`p-2 rounded transition text-sm ${
                      isCommandActive('justifyRight') ? 'bg-[#C9A040] text-white' : 'hover:bg-gray-200'
                    }`}
                    title="Align Right"
                  >
                    ➡
                  </button>
                </div>

                <div className="w-px bg-gray-300 h-6"></div>

                {/* Indentation */}
                <div className="flex gap-1 items-center">
                  <button
                    onClick={() => execCommand('outdent')}
                    className="p-2 rounded transition text-sm hover:bg-gray-200"
                    title="Decrease Indent"
                  >
                    ↤
                  </button>
                  <button
                    onClick={() => execCommand('indent')}
                    className="p-2 rounded transition text-sm hover:bg-gray-200"
                    title="Increase Indent"
                  >
                    ↦
                  </button>
                </div>

                <div className="w-px bg-gray-300 h-6"></div>

                {/* Clear */}
                <button
                  onClick={() => execCommand('removeFormat')}
                  className="p-2 rounded transition text-sm hover:bg-gray-200"
                  title="Clear Formatting"
                >
                  Clear
                </button>
              </div>
              {/* Editor */}
              <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                onInput={handleEditorChange}
                className="w-full h-32 p-4 text-gray-900 focus:outline-none resize-none focus:ring-2 focus:ring-inset focus:ring-[#C9A040] overflow-auto"
                style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
              >
                This is awesome!
              </div>
            </div>
          </div>

          {/* Choose Image */}
          <div className="mb-6">
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