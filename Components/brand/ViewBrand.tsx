'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PencilEdit02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useBrandStore } from '@/app/store/brandStore';

const BrandView: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { currentBrand, loading, error, fetchBrandById, deleteBrand } = useBrandStore();

  useEffect(() => {
    const id = params?.id as string;
    if (id) {
      fetchBrandById(id);
    }
  }, [params, fetchBrandById]);

  const handleDelete = async () => {
    if (!currentBrand) return;
    
    if (confirm('Are you sure you want to delete this brand?')) {
      await deleteBrand(currentBrand._id);
      if (!error) {
        router.push('/pages/brand');
      }
    }
  };

  const handleEdit = () => {
    if (!currentBrand) return;
    router.push(`/pages/brand/edit/${currentBrand._id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-2xl mx-auto">
          <p className="text-center text-gray-600">Loading brand...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-2xl mx-auto">
          <p className="text-center text-red-600">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!currentBrand) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-2xl mx-auto">
          <p className="text-center text-gray-600">Brand not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ml-8">
      <div className="">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 px-8 py-4 bg-white rounded-lg">
          <h1 className="text-3xl font-bold text-gray-900">Brand Management</h1>
          <div className="flex gap-3">
            <button
              onClick={handleDelete}
              className="bg-[#DD2C2C] hover:bg-red-700 flex items-center justify-center gap-2 px-6 py-3  text-gray-100 rounded-lg  transition-colors font-semibold text-[16px] leading-[24px] tracking-[0] "
            >
              Delete
            </button>
            <button
              onClick={handleEdit}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-[#C9A040] text-gray-800 rounded-lg hover:bg-[#9e7e33] transition-colors font-semibold text-[16px] leading-[24px] tracking-[0]"
            >
              <HugeiconsIcon icon={PencilEdit02Icon} />Edit
            </button>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Brand Name */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Brand Name
            </label>
            <input
              type="text"
              value={currentBrand.name}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
              placeholder="Enter name"
            />
          </div>

          {/* Display on Featured Section */}
          <div className="mb-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <span className="text-sm font-medium text-gray-700">
                Display Brand on featured section
              </span>
              <div className="relative inline-block w-11 h-6">
                <input 
                  type="checkbox" 
                  checked={currentBrand.feature} 
                  className="peer sr-only" 
                  disabled 
                />
                <div className={`w-11 h-6 rounded-full transition-colors ${
                  currentBrand.feature ? 'bg-blue-600' : 'bg-gray-300'
                }`}></div>
                <div className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  currentBrand.feature ? 'translate-x-5' : ''
                }`}></div>
              </div>
            </label>
          </div>

          {/* Choose Image */}
          <div className="mb-6">
            {currentBrand.image ? (
              <div className="relative">
                <img
                  src={currentBrand.image}
                  alt={currentBrand.name}
                  className="w-64 h-64  rounded-lg border border-gray-300"
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Choose Image
                </label>
                <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-lg mb-4 transition-colors">
                  Select Image
                </button>
                <div className="w-full h-64 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3 animate-pulse"></div>
                    <p className="text-gray-400 text-sm">No image available</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandView;