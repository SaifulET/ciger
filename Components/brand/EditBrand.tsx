'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';

interface Brand {
  id: number;
  name: string;
  image: string;
  featured?: boolean;
}

const brandData: Brand[] = [
  { id: 1, name: "Brand Name", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop", featured: false },
  { id: 2, name: "Tech Brand", image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=200&h=200&fit=crop", featured: true },
  { id: 3, name: "Fashion Co", image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=200&h=200&fit=crop", featured: false },
  { id: 4, name: "Luxury Items", image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=200&h=200&fit=crop", featured: false },
  { id: 5, name: "Sport Gear", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop", featured: true },
  { id: 6, name: "Home Decor", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=200&fit=crop", featured: false },
  { id: 7, name: "Beauty Pro", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&h=200&fit=crop", featured: false },
  { id: 8, name: "Food & Bev", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop", featured: false },
  { id: 9, name: "Electronics", image: "", featured: false },
  { id: 10, name: "Automotive", image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=200&h=200&fit=crop", featured: true },
];

const BrandEdit: React.FC = () => {
  const params = useParams();
  const router = useRouter();

  const [brandId, setBrandId] = useState<number | null>(null);
  const [brandName, setBrandName] = useState('');
  const [brandImage, setBrandImage] = useState('');
  const [featured, setFeatured] = useState(false);
  const [originalBrand, setOriginalBrand] = useState<Brand | null>(null);
  const [hasEdited, setHasEdited] = useState(false);

  // 🔹 Load brand by URL param
  useEffect(() => {
    if (!params?.id) return;
    const id = Number(params.id);
    setBrandId(id);

    const foundBrand = brandData.find(b => b.id === id);
    if (foundBrand) {
      setOriginalBrand(foundBrand);
      setBrandName(foundBrand.name);
      setBrandImage(foundBrand.image);
      setFeatured(foundBrand.featured || false);
    }
  }, [params]);

  // 🔹 Detect edits
  useEffect(() => {
    if (!originalBrand) return;
    const changed =
      brandName !== originalBrand.name ||
      brandImage !== originalBrand.image ||
      featured !== originalBrand.featured;
    setHasEdited(changed);
  }, [brandName, brandImage, featured, originalBrand]);

  const handleSelectImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        setBrandImage(imageUrl);
      }
    };
    input.click();
  };

  const handleSave = () => {
    if (!hasEdited || !brandId) return;

    const updatedBrand = {
      id: brandId,
      name: brandName,
      image: brandImage,
      featured: featured,
    };

    console.log('✅ Updated Brand:', updatedBrand);
    router.push('/pages/brand');
  };

  const handleCancel = () => {
    router.push('/pages/brand');
  };

  if (!originalBrand) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-gray-600">Brand not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ml-8 ">
      

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
                disabled={!hasEdited}
                className={`px-6 py-2.5 rounded-lg transition-colors ${
                  hasEdited
                    ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                    : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                }`}
              >
                Save
              </button>
            </div>
          </div>
          </div>
         

          {/* Form Container */}
          <div className="bg-white rounded-lg shadow-sm p-8">
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
                    checked={featured}
                    onChange={() => setFeatured(!featured)}
                    className="peer sr-only"
                  />
                  <div
                    className={`w-11 h-6 rounded-full transition-colors duration-300 ${
                      featured ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  ></div>
                  <div
                    className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 ${
                      featured ? 'translate-x-5' : ''
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

              <button
                onClick={handleSelectImage}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2.5 rounded-lg mb-4 transition-colors"
              >
                Select Image
              </button>

              {brandImage ? (
                <div className="w-48 h-48 border-2 border-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={brandImage}
                    alt={brandName}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandEdit;
