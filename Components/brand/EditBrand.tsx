'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { useBrandStore } from '@/app/store/brandStore';
import { Brand } from '../inventory/inventory';

const BrandEdit: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { currentBrand, loading, error, fetchBrandById, updateBrand } = useBrandStore();

  const [brandName, setBrandName] = useState('');
  const [brandImage, setBrandImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [feature, setFeature] = useState(false);
const [originalBrand, setOriginalBrand] = useState<Brand | null>(null);  const [hasEdited, setHasEdited] = useState(false);

  // 🔹 Load brand by URL param
  useEffect(() => {
    if (!params?.id) return;
    const id = params.id as string;
    fetchBrandById(id);
  }, [params, fetchBrandById]);

  // 🔹 Set form data when currentBrand is loaded
  useEffect(() => {
    if (currentBrand) {
      setOriginalBrand(currentBrand);
      setBrandName(currentBrand.name);
      setImagePreview(currentBrand.image || '');
      setFeature(currentBrand.feature);
    }
  }, [currentBrand]);

  // 🔹 Detect edits
  useEffect(() => {
    if (!originalBrand) return;
    const changed =
      brandName !== originalBrand.name ||
      brandImage !== null || // If new file is selected
      (brandImage === null && imagePreview !== (originalBrand.image || '')) || // If image was removed
      feature !== originalBrand.feature;
    setHasEdited(changed);
  }, [brandName, brandImage, imagePreview, feature, originalBrand]);

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

  const handleRemoveImage = () => {
    setBrandImage(null);
    setImagePreview('');
  };

  const handleSave = async () => {
    if (!hasEdited || !currentBrand) return;

    const updatedBrand = {
      name: brandName,
      feature: feature,
      image: brandImage || undefined, // Pass undefined if no new file
    };

    await updateBrand(currentBrand._id, updatedBrand);
    if (!error) {
      // Clean up preview URL
      if (imagePreview && brandImage) {
        URL.revokeObjectURL(imagePreview);
      }
      router.push('/pages/brand');
    }
  };

  const handleCancel = () => {
    // Clean up preview URL
    if (imagePreview && brandImage) {
      URL.revokeObjectURL(imagePreview);
    }
    router.push('/pages/brand');
  };

  // Clean up preview URLs on unmount
  useEffect(() => {
    return () => {
      if (imagePreview && brandImage) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview, brandImage]);

  if (loading && !currentBrand) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-gray-600">Loading brand...</p>
        </div>
      </div>
    );
  }

  if (!currentBrand && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-gray-600">Brand not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ml-8 text-gray-800">
      <div className="px-8 py-6">
        <div className="">
          <div className="bg-white  px-8 py-4 rounded-lg mb-8">
            {/* Breadcrumb */}
            <div >
              <div className=" flex items-center gap-2 text-sm mb-3">
                <button
                  onClick={() => router.push('/pages/brand')}
                  className="text-gray-600 hover:text-gray-900"
                >
                  ← Brand
                </button>
                <ChevronRight size={16} className="text-gray-400" />
                <span className="text-gray-900 font-medium">Edit Brand</span>
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
                  disabled={!hasEdited || loading}
                  className={`px-6 py-2.5 rounded-lg transition-colors ${
                    hasEdited && !loading
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
                Brand Name
              </label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Enter name"
              />
            </div>

            {/* Display on Featured Section */}
            <div className="mb-8">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <span className="text-sm font-semibold text-gray-900">
                  Display Brand on featured section
                </span>
                <div
                  className="relative inline-block w-11 h-6 transition-all duration-300"
                >
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
                Choose Image
              </label>

              <div className="flex gap-3 mb-4">
                <button
                  onClick={handleSelectImage}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2.5 rounded-lg transition-colors"
                >
                  {imagePreview ? 'Change Image' : 'Select Image'}
                </button>
                {imagePreview && (
                  <button
                    onClick={handleRemoveImage}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg transition-colors"
                  >
                    Remove Image
                  </button>
                )}
              </div>

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
                  New file: {brandImage.name}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandEdit;