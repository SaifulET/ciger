'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { useBrandStore } from '@/app/store/brandStore';

const BrandCreate: React.FC = () => {
  const router = useRouter();
  const { createBrand, loading, error } = useBrandStore();

  const [brandName, setBrandName] = useState('');
  const [brandImage, setBrandImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [feature, setFeature] = useState(true);
  const [canSave, setCanSave] = useState(false);

  // 🔹 Enable save only if brandName is filled
  useEffect(() => {
    setCanSave(brandName.trim().length > 0);
  }, [brandName]);

  const handleSelectImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        setBrandImage(file);
        // Create preview URL
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
      }
    };
    input.click();
  };

  const handleSave = async () => {
    if (!canSave) return;

    const newBrand = {
      name: brandName,
      feature: feature,
      image: brandImage || undefined,
    };

    await createBrand(newBrand);
    if (!error) {
      // Clean up preview URL
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      router.push('/pages/brand');
    }
  };

  const handleCancel = () => {
    // Clean up preview URL
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    router.push('/pages/brand');
  };

  // Clean up preview URLs on unmount
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  return (
    <div className="min-h-screen ml-8 text-gray-800">
      <div className="">
        <div >
          <div className=" bg-white px-8 py-6 mb-8">
            {/* Breadcrumb */}
            <div className="mb-3">
              <div className=" flex items-center gap-2 text-sm">
                <button
                  onClick={() => router.push('/pages/brand')}
                  className="text-gray-600 hover:text-gray-900"
                >
                  ← Brand
                </button>
                <ChevronRight size={16} className="text-gray-400" />
                <span className="text-gray-900 font-medium">Create Brand</span>
              </div>
            </div>
            
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900">Brand Management</h1>
              <div className="flex gap-3">
                <button
                  onClick={handleCancel}
                  className="bg-white hover:bg-gray-50 text-gray-700 px-6 py-2.5 rounded-lg border border-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={!canSave || loading}
                  className={`px-6 py-2.5 rounded-lg transition-colors ${
                    canSave && !loading
                      ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                      : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  }`}
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
              </div>
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
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Brand Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Enter brand name"
              />
            </div>

            {/* Display on Featured Section */}
            <div className="mb-8">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <span className="text-sm font-semibold text-gray-900">
                  Display Brand on featured section
                </span>
                <div className="relative inline-block w-11 h-6 transition-all duration-300">
                  <input
                    type="checkbox"
                    checked={feature}
                    onChange={() => setFeature(!feature)}
                    className="peer sr-only"
                  />
                  <div
                    className={`w-11 h-6 rounded-full transition-colors duration-300 ${
                      feature ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  ></div>
                  <div
                    className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 ${
                      feature ? 'translate-x-5' : ''
                    }`}
                  ></div>
                </div>
              </label>
            </div>

            {/* Choose Image */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Choose Image (optional)
              </label>

              <button
                onClick={handleSelectImage}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2.5 rounded-lg mb-4 transition-colors"
              >
                Select Image
              </button>

              {imagePreview ? (
                <div className="w-48 h-48 border-2 border-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-48 h-48 bg-gray-100 border-2 border-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3"></div>
                    <p className="text-gray-400 text-sm">No image selected</p>
                  </div>
                </div>
              )}
              {brandImage && (
                <p className="text-sm text-gray-600 mt-2">
                  Selected file: {brandImage.name}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandCreate;