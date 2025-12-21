'use client'
import React, { useState, useEffect } from 'react';
import { Pencil, Eye, Trash2 } from 'lucide-react';
import { PencilEdit02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useBrandStore } from '@/app/store/brandStore';
import { useRouter, useSearchParams } from 'next/navigation'; // Add useSearchParams
import Cookies from "js-cookie";
const BrandManagement: React.FC = () => {
  const { brands, loading, error, fetchBrands, deleteBrand } = useBrandStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlPage = searchParams.get('page');
 useEffect(()=>{
      Cookies.get("token")?"":router.push("/auth/signin")
    },[Cookies.get("token")])
  
  // Initialize currentPage from URL or default to 1
  const [currentPage, setCurrentPage] = useState(
    urlPage ? parseInt(urlPage) : 1
  );
  const itemsPerPage = 8;

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  // Update URL when page changes
  useEffect(() => {
    if (currentPage > 1) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', currentPage.toString());
      router.push(`?${params.toString()}`, { scroll: false });
    } else if (currentPage === 1 && urlPage) {
      // Remove page param if it's page 1
      const params = new URLSearchParams(searchParams.toString());
      params.delete('page');
      router.push(`?${params.toString()}`, { scroll: false });
    }
  }, [currentPage, router, searchParams, urlPage]);

  // Calculate pagination
  const totalPages = Math.ceil(brands.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBrands = brands.slice(startIndex, endIndex);

  // Generate visible page numbers (max 4 at a time)
  const getVisiblePages = () => {
    const visiblePages = 4;
    let startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2));
    let endPage = startPage + visiblePages - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - visiblePages + 1);
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  const visiblePages = getVisiblePages();

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this brand?')) {
      await deleteBrand(id);
      // Adjust current page if needed
      if (currentBrands.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const handleAddBrand = () => {
    // Pass current page when navigating to create brand
    router.push(`/pages/brand/create?page=${currentPage}`);
  };

  const handleView = (id: string) => {
    // Pass current page when navigating to view brand
    router.push(`/pages/brand/view/${id}?page=${currentPage}`);
  };

  const handleEdit = (id: string) => {
    // Pass current page when navigating to edit brand
    router.push(`/pages/brand/edit/${id}?page=${currentPage}`);
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="min-h-screen ml-8 flex items-center justify-center">
        <div className="text-gray-600">Loading brands...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen ml-8 flex items-center justify-center">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ml-8 text-gray-800">
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
                key={brand._id}
                className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50 transition-colors"
              >
                <div className="col-span-3 text-gray-700 flex">
                  {startIndex + index + 1 < 10 ? <div>0</div>:""}{startIndex + index + 1}
                </div>
                <div className="col-span-3">
                  {brand.image ? (
                    <img
                      src={brand.image}
                      alt={brand.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-gray-500 text-sm">No Image</span>
                    </div>
                  )}
                </div>
                <div className="col-span-3 text-gray-800 font-medium">
                  {brand.name}
                </div>
                <div className="col-span-3 flex gap-2">
                  <button
                    onClick={() => handleEdit(brand._id)}
                    className="p-2 text-[#14A5E4] hover:bg-blue-50 rounded transition-colors"
                    title="Edit"
                  >
                   <HugeiconsIcon icon={PencilEdit02Icon} />
                  </button>
                  <button
                    onClick={() => handleView(brand._id)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                    title="View"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(brand._id)}
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
            
            {/* Show first page if not in visible range */}
            {visiblePages[0] > 1 && (
              <>
                <button
                  onClick={() => goToPage(1)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentPage === 1
                      ? 'text-[#C9A040] border border-[#C9A040]'
                      : 'border border-gray-500 hover:bg-gray-50'
                  }`}
                >
                  1
                </button>
                {visiblePages[0] > 2 && <span className="px-2 py-2">...</span>}
              </>
            )}

            {/* Visible pages */}
            {visiblePages.map((page) => (
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

            {/* Show last page if not in visible range */}
            {visiblePages[visiblePages.length - 1] < totalPages && (
              <>
                {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
                  <span className="px-2 py-2">...</span>
                )}
                <button
                  onClick={() => goToPage(totalPages)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentPage === totalPages
                      ? 'text-[#C9A040] border border-[#C9A040]'
                      : 'border border-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {totalPages}
                </button>
              </>
            )}
            
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