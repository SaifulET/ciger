'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft02Icon, ArrowRight01Icon, Delete02Icon } from '@hugeicons/core-free-icons';
import Link from 'next/link';
import { Edit } from 'lucide-react';

// Mock product data (you can replace this with fetched data or props)
const mockProduct = {
  id: '123',
  category: 'Electronics',
  subCategory: 'Phones',
  brand: 'Apple',
  productName: 'iPhone 15 Pro Max',
  productQuantity: '50',
  productStock: '45',
  productPrice: '1200',
  productSalePrice: '10',
  productState: 'bestSeller',
  productDescription:
    '<p><b>iPhone 15 Pro Max</b> — The ultimate smartphone experience with powerful A17 chip and titanium body.</p>',
  selectedImage: {
    name: 'iphone15promax.jpg',
    data: '/sample-iphone.jpg', // or base64 string if stored that way
  },
};

const InventoryViewItem = () => {
  const router = useRouter();
  const product = mockProduct;

  const handleDelete = () => {
    const confirmDelete = confirm('Are you sure you want to delete this product?');
    if (confirmDelete) {
      console.log('Deleted:', product.id);
      router.push('/pages/inventory');
    }
  };

  const handleEdit = () => {
    // router.push(`/pages/inventory/editItem/${product.id}`);
    router.push(`/pages/inventory/editItem`);
  };

  return (
    <div className="min-h-screen ml-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 py-6 rounded-lg bg-white">
        <div className="flex items-center gap-3">
          <Link href="/pages/inventory" className="flex pl-5">
            <button className="hover:text-gray-900">
              <HugeiconsIcon icon={ArrowLeft02Icon} />
            </button>
            <span className="">Inventory Management</span>
          </Link>
          <span className="">
            <HugeiconsIcon icon={ArrowRight01Icon} />
          </span>
          <span className="">View Item</span>
        </div>

        <div className="flex gap-3 pr-5">
          <button
            onClick={handleDelete}
            className="px-6 py-2  bg-red-600  text-white rounded-lg font-medium   transition flex"
          >
           <HugeiconsIcon icon={Delete02Icon} /> Delete
          </button>
          <button
            onClick={handleEdit}
            className="px-6 py-2 bg-yellow-500 text-black rounded-lg font-medium hover:bg-yellow-600 transition flex "
          >
           <Edit size={24} /> Edit
          </button>
        </div>
      </div>

      {/* Details */}
      <div className="bg-white rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Product Details</h1>

        {/* Category */}
        <Field label="Category" value={product.category} />
        <Field label="Sub Category" value={product.subCategory} />
        <Field label="Brand" value={product.brand} />
        <Field label="Product Name" value={product.productName} />

        {/* Quantity & Stock */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <Field label="Product Quantity" value={product.productQuantity} />
          <Field label="Product Stock" value={product.productStock} />
        </div>

        {/* Prices */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <Field label="Product Price" value={`$${product.productPrice}`} />
          <Field label="Discount (%)" value={`${product.productSalePrice}%`} />
        </div>

        {/* Product State */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Product State
          </label>
          <div className="flex gap-3">
            <span
              className={`px-4 py-2 rounded-lg font-medium ${
                product.productState === 'newArrivals'
                  ? 'bg-[#C9A040] text-white'
                  : product.productState === 'bestSeller'
                  ? 'bg-[#C9A040] text-gray-900'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {product.productState === 'newArrivals'
                ? 'New Arrivals'
                : product.productState === 'bestSeller'
                ? 'Best Seller'
                : 'N/A'}
            </span>
          </div>
        </div>

        {/* Product Description */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Product Description
          </label>
          <div
            className="border border-gray-300 rounded-lg p-4 bg-gray-50 text-gray-900 min-h-[100px]"
            dangerouslySetInnerHTML={{ __html: product.productDescription || 'No description provided.' }}
          ></div>
        </div>

        {/* Image Preview */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Product Image
          </label>
          {product.selectedImage?.data ? (
            <div className="w-48 h-48 border rounded-lg overflow-hidden">
              <img
                src={product.selectedImage.data}
                alt={product.selectedImage.name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="text-gray-500 italic">No image available</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryViewItem;

// Reusable field component
const Field = ({ label, value }: { label: string; value: string | number }) => (
  <div className="mb-6">
    <label className="block text-sm font-semibold text-gray-900 mb-1">{label}</label>
    <div className="px-4 py-3 bg-gray-100 rounded-lg text-gray-800">{value || '—'}</div>
  </div>
);
