'use client';
import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft02Icon, ArrowRight01Icon, Delete02Icon } from '@hugeicons/core-free-icons';
import Link from 'next/link';
import { Edit } from 'lucide-react';
import { useInventoryStore } from '@/app/store/inverntoryStore';

const InventoryViewItem = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get('id');
  
  const { 
    currentProduct, 
    getProductById, 
    deleteProduct, 
    loading, 
    error, 
    clearError,
    clearCurrentProduct 
  } = useInventoryStore();

  // Fetch product data when component mounts
  useEffect(() => {
    if (productId) {
      getProductById(productId);
    }
  }, [productId, getProductById]);

  // Clear error and current product when component unmounts
  useEffect(() => {
    return () => {
      clearError();
      clearCurrentProduct();
    };
  }, [clearError, clearCurrentProduct]);

  const handleDelete = async () => {
    if (!productId || !currentProduct) return;
    
    const confirmDelete = confirm('Are you sure you want to delete this product?');
    if (confirmDelete) {
      const result = await deleteProduct(productId);
      if (result.success) {
        router.push('/pages/inventory');
      } else {
        alert(result.message || 'Failed to delete product');
      }
    }
  };

  const handleEdit = () => {
    if (productId) {
      router.push(`/pages/inventory/editItem?id=${productId}`);
    }
  };

  if (!productId) {
    return (
      <div className="min-h-screen ml-10 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h1>
          <p className="text-gray-600">No product ID provided.</p>
          <Link href="/pages/inventory" className="text-[#C9A040] hover:underline mt-4 inline-block">
            Back to Inventory
          </Link>
        </div>
      </div>
    );
  }

  if (loading && !currentProduct) {
    return (
      <div className="min-h-screen ml-10 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-600">Loading product details...</div>
        </div>
      </div>
    );
  }

  if (error && !currentProduct) {
    return (
      <div className="min-h-screen ml-10 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Error</h1>
          <p className="text-gray-600">{error}</p>
          <Link href="/pages/inventory" className="text-[#C9A040] hover:underline mt-4 inline-block">
            Back to Inventory
          </Link>
        </div>
      </div>
    );
  }

  if (!currentProduct) {
    return (
      <div className="min-h-screen ml-10 flex items-center justify-center text-gray-800">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h1>
          <p className="text-gray-600">The requested product could not be found.</p>
          <Link href="/pages/inventory" className="text-[#C9A040] hover:underline mt-4 inline-block">
            Back to Inventory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ml-10 text-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 py-6 rounded-lg bg-white">
        <div className="flex items-center gap-3">
          <Link href="/pages/inventory" className="flex pl-5">
            <button className="hover:text-gray-900">
              <HugeiconsIcon icon={ArrowLeft02Icon} />
            </button>
            <span>Inventory Management</span>
          </Link>
          <span><HugeiconsIcon icon={ArrowRight01Icon} /></span>
          <span>View Item</span>
        </div>

        <div className="flex gap-3 pr-5">
          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition flex items-center gap-2 disabled:opacity-50"
          >
            <HugeiconsIcon icon={Delete02Icon} /> {loading ? 'Deleting...' : 'Delete'}
          </button>
          <button
            onClick={handleEdit}
            className="px-6 py-2 bg-yellow-500 text-black rounded-lg font-medium hover:bg-yellow-600 transition flex items-center gap-2"
          >
            <Edit size={18} /> Edit
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Details */}
      <div className="bg-white rounded-lg p-6 text-gray-800">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Product Details</h1>

        {/* Product Name */}
        <Field label="Product Name" value={currentProduct.name} />
        
        {/* Category */}
        <Field label="Category" value={currentProduct.category || '—'} />
        <Field label="Sub Category" value={currentProduct.subCategory || '—'} />
        <Field label="Brand" value={currentProduct.brand || '—'} />

        {/* Stock Information */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <Field label="Quantity" value={currentProduct.quantity?.toString() || ''} />
          <Field label="Stock" value={currentProduct.available?.toString() || '0'} />
        </div>

        {/* Prices */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <Field label="Product Price" value={`$${currentProduct.price?.toFixed(2) || '0.00'}`} />
          <Field label="Discount (%)" value={`${currentProduct.discount || 0}%`} />
        </div>

        {/* Product State */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Product State
          </label>
          <div className="flex gap-3">
            {currentProduct.isNew && (
              <span className="px-4 py-2 bg-[#C9A040] text-white rounded-lg font-medium">
                New Arrivals
              </span>
            )}
            {currentProduct.isBest && (
              <span className="px-4 py-2 bg-[#C9A040] text-gray-900 rounded-lg font-medium">
                Best Seller
              </span>
            )}
            {!currentProduct.isNew && !currentProduct.isBest && (
              <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium">
                Regular
              </span>
            )}
          </div>
        </div>

        {/* Rating */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Average Rating
          </label>
          <div className="px-4 py-3 bg-gray-100 rounded-lg text-gray-800">
            {currentProduct.averageRating > 0 ? `${currentProduct.averageRating} / 5` : 'No ratings yet'}
          </div>
        </div>

        {/* Colors */}
        {currentProduct.colors && currentProduct.colors.length > 0 && (
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Available Colors
            </label>
            <div className="flex gap-2">
              {currentProduct.colors.map((color, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-800 rounded-lg text-sm"
                >
                  {color}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Product Description */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Product Description
          </label>
          <div
            className="border border-gray-300 rounded-lg p-4 bg-gray-50 text-gray-900 min-h-[100px]"
            dangerouslySetInnerHTML={{ __html: currentProduct.description || 'No description provided.' }}
          ></div>
        </div>

        {/* Image Preview */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Product Images
          </label>
          <div className="flex gap-4 flex-wrap">
            {currentProduct.images && currentProduct.images.length > 0 ? (
              currentProduct.images.map((image, index) => (
                <div key={index} className="w-48 h-48 border rounded-lg overflow-hidden">
                  <img
                    src={image}
                    alt={`${currentProduct.name} - Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))
            ) : (
              <div className="text-gray-500 italic">No images available</div>
            )}
          </div>
        </div>

        {/* Last Updated */}
        {currentProduct.updatedAt && (
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Last Updated
            </label>
            <div className="px-4 py-3 bg-gray-100 rounded-lg text-gray-800">
              {new Date(currentProduct.updatedAt).toLocaleString()}
            </div>
          </div>
        )}
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
