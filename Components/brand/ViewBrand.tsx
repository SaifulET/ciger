'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PencilEdit02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

interface Brand {
  id: number;
  name: string;
  image: string;
}

const brandData: Brand[] = [
  { id: 1, name: "Brand Name", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop" },
  { id: 2, name: "Tech Brand", image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=200&h=200&fit=crop" },
  { id: 3, name: "Fashion Co", image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=200&h=200&fit=crop" },
  { id: 4, name: "Luxury Items", image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=200&h=200&fit=crop" },
  { id: 5, name: "Sport Gear", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop" },
  { id: 6, name: "Home Decor", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=200&fit=crop" },
  { id: 7, name: "Beauty Pro", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&h=200&fit=crop" },
  { id: 8, name: "Food & Bev", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop" },
  { id: 9, name: "Electronics", image: "" },
  { id: 10, name: "Automotive", image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=200&h=200&fit=crop" },
];

const BrandView: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const [brand, setBrand] = useState<Brand | null>(null);

  useEffect(() => {
    const id = Number(params?.id);
    if (isNaN(id)) return;

    const foundBrand = brandData.find(b => b.id === id);
    setBrand(foundBrand || null);
  }, [params]);

  const handleDelete = () => {
    if (!brand) return;
    console.log(`Brand with ID ${brand.id} has been deleted`);
    router.push('/pages/brand');
  };

  const handleEdit = () => {
    if (!brand) return;
    router.push(`/pages/brand/edit/${brand.id}`);
  };

  if (!brand) {
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
          {/* Brand Name */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Brand Name
            </label>
            <input
              type="text"
              value={brand.name}
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
                <input type="checkbox" className="peer sr-only" disabled />
                <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-600 transition-colors"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
              </div>
            </label>
          </div>

          {/* Choose Image */}
          <div className="mb-6">
            {brand.image ? (
              <div className="relative">
                <img
                  src={brand.image}
                  alt={brand.name}
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
