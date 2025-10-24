'use client'
import React, { useState } from 'react';
import { Pencil, Eye, Trash2 } from 'lucide-react';
import { PencilEdit02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

interface Brand {
  id: number;
  name: string;
  image: string;
}

// Sample JSON data
const brandData: Brand[] = [
  { id: 1, name: "Brand Name", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop" },
  { id: 2, name: "Tech Brand", image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=200&h=200&fit=crop" },
  { id: 3, name: "Fashion Co", image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=200&h=200&fit=crop" },
  { id: 4, name: "Luxury Items", image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=200&h=200&fit=crop" },
  { id: 5, name: "Sport Gear", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop" },
  { id: 6, name: "Home Decor", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=200&fit=crop" },
  { id: 7, name: "Beauty Pro", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&h=200&fit=crop" },
  { id: 8, name: "Food & Bev", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop" },
  { id: 9, name: "Electronics", image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=200&h=200&fit=crop" },
  { id: 10, name: "Automotive", image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=200&h=200&fit=crop" },
];

const BrandManagement: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>(brandData);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Calculate pagination
  const totalPages = Math.ceil(brands.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBrands = brands.slice(startIndex, endIndex);

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this brand?')) {
      setBrands(brands.filter(brand => brand.id !== id));
      // Adjust current page if needed
      if (currentBrands.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const handleAddBrand = () => {
    window.location.href = '/pages/brand/create';
  };

  const handleView = (id: number) => {
    window.location.href = `/pages/brand/view/${id}`;
  };

  const handleEdit = (id: number) => {
    window.location.href = `/pages/brand/edit/${id}`;
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen ml-8">
      <div className="">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 bg-white px-8 py-6 rounded-lg">
          <h1 className="text-3xl font-bold text-gray-900">Brand Management</h1>
          <button
            onClick={handleAddBrand}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#C9A040] text-gray-800 rounded-lg hover:bg-[#9e7e33] transition-colors font-semibold text-[16px] leading-[24px] tracking-[0]"
          >
            <HugeiconsIcon icon={PencilEdit02Icon} />
            Add Brand
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 bg-[#E6D3A7] px-6 py-4 font-semibold text-gray-800">
            <div className="col-span-3">No</div>
            <div className="col-span-3">Image</div>
            <div className="col-span-3">Name</div>
            <div className="col-span-3">Actions</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-200">
            {currentBrands.map((brand, index) => (
              <div
                key={brand.id}
                className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50 transition-colors"
              >
                <div className="col-span-3 text-gray-700 flex">
                  {startIndex + index + 1 < 10 ? <div>0</div>:""}{startIndex + index + 1}
                </div>
                <div className="col-span-3">
                  <img
                    src={brand.image}
                    alt={brand.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                </div>
                <div className="col-span-3 text-gray-800 font-medium">
                  {brand.name}
                </div>
                <div className="col-span-3 flex gap-2">
                  <button
                    onClick={() => handleEdit(brand.id)}
                    className="p-2 text-[#14A5E4] hover:bg-blue-50 rounded transition-colors"
                    title="Edit"
                  >
                   <HugeiconsIcon icon={PencilEdit02Icon} />
                  </button>
                  <button
                    onClick={() => handleView(brand.id)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                    title="View"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(brand.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
        {/* Pagination */}
<div className="flex justify-between items-center mt-6">
  <div className="text-gray-600">
    No of Results: {Math.min(currentPage * itemsPerPage, brands.length)} of {brands.length}
  </div>
  <div className="flex gap-2">
    <button
      onClick={() => goToPage(Math.max(1, currentPage - 1))}
      disabled={currentPage === 1}
      className="px-4 py-2 border border-gray-600 rounded-full hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      &lt;
    </button>
    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
      <button
        key={page}
        onClick={() => goToPage(page)}
        className={`px-4 py-2 rounded-lg transition-colors ${
          currentPage === page
            ? 'text-[#C9A040] border border-[#C9A040]'
            : 'border border-gray-500 hover:bg-gray-50'
        }`}
      >
        {page}
      </button>
    ))}
    <button
      onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
      disabled={currentPage === totalPages}
      className="px-4 py-2 border border-gray-600 rounded-full hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      &gt;
    </button>
  </div>
</div>

      </div>
    </div>
  );
};

export default BrandManagement;