'use client'
import React, { useState, useMemo, useEffect } from 'react';
import { Search, Edit, Eye, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { AddSquareIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useInventoryStore } from '@/app/store/inverntoryStore';
import { useRouter, useSearchParams } from 'next/navigation'; // Add useSearchParams
import useUserStore from "@/app/store/userStore"
import Cookies from "js-cookie";

export default function InventoryManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 8;
  
  // Use URL search params to get and set page
  const searchParams = useSearchParams();
  const urlPage = searchParams.get('page');
  
  // Initialize currentPage from URL or default to 1
  const [currentPage, setCurrentPage] = useState(
    urlPage ? parseInt(urlPage) : 1
  );
  
  const { products, getAllProducts, deleteProduct, loading, error } = useInventoryStore();
  const router = useRouter();
  const {user, isLogin} = useUserStore();

  // Fetch products on component mount
  useEffect(() => {
    getAllProducts();
  }, [getAllProducts]);

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

  // Filter data based on search
  const filteredData = useMemo(() => {
    return products.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    useEffect(()=>{
      Cookies.get("token")?"":router.push("/auth/signin")
    },[Cookies.get("token")])

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      const result = await deleteProduct(id);
      if (!result.success) {
        alert(result.message || 'Failed to delete product');
      }
      if (paginatedData.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleAddItem = () => {
    // Pass current page when navigating to add item
    router.push(`/pages/inventory/addItem?page=${currentPage}`);
  };

  const handleViewItem = (id: string) => {
    // Pass current page when navigating to view item
    router.push(`/pages/inventory/viewItem?id=${id}&page=${currentPage}`);
  };

  const handleEditItem = (id: string) => {
    // Pass current page when navigating to edit item
    router.push(`/pages/inventory/editItem?id=${id}&page=${currentPage}`);
  };

  const getPaginationButtons = (): number[] => {
    const buttons: number[] = [];
    const maxButtons = 5;
    let startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + maxButtons - 1);

    if (endPage - startPage < maxButtons - 1) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(i);
    }
    return buttons;
  };

  return (
    <div className="px-6 text-gray-800">
      <div>
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 p-6 bg-white rounded-lg">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Inventory Management</h1>
          <button
            onClick={handleAddItem}
            className="w-full md:w-auto px-6 py-3 bg-[#C9A040] hover:bg-[#967730] text-gray-800 font-semibold rounded-lg transition duration-200 flex items-center justify-center"
          >
            <HugeiconsIcon icon={AddSquareIcon} /> &nbsp; Add Item
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Search Bar */}
        <div className="flex flex-col md:flex-row gap-3 mb-8 bg-white p-4 rounded-lg">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search your product"
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A040]"
            />
          </div>
          <button className="px-6 py-2 bg-[#C9A040] hover:bg-[#a38234] text-gray-800 font-semibold rounded-lg transition duration-200 whitespace-nowrap">
            Search
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-lg p-8 text-center">
            <div className="text-gray-600">Loading products...</div>
          </div>
        )}

        {/* Table */}
        {!loading && (
          <div className="bg-white rounded-lg overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#E6D3A7] text-gray-800">
                    <th className="px-4 md:px-6 py-3 text-left font-semibold text-sm md:text-base">No</th>
                    <th className="px-4 md:px-6 py-3 text-left font-semibold text-sm md:text-base">Image</th>
                    <th className="px-4 md:px-6 py-3 text-left font-semibold text-sm md:text-base">Name</th>
                    <th className="px-4 md:px-6 py-3 text-left font-semibold text-sm md:text-base">Price</th>
                    <th className="px-4 md:px-6 py-3 text-left font-semibold text-sm md:text-base">Stock</th>
                    <th className="px-4 md:px-6 py-3 text-left font-semibold text-sm md:text-base">Status</th>
                    <th className="px-4 md:px-6 py-3 text-left font-semibold text-sm md:text-base">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.length > 0 ? (
                    paginatedData.map((item, index) => (
                      <tr key={item._id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                        <td className="px-4 md:px-6 py-4 text-sm md:text-base text-gray-800 font-medium">
                          {String(startIndex + index + 1).padStart(2, '0')}
                        </td>
                        <td className="px-4 md:px-6 py-4">
                          {item.images && item.images.length > 0 ? (
                            <img 
                              src={item.images[0]} 
                              alt={item.name}
                              className="w-10 h-10 md:w-12 md:h-12 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-xs">
                              No Image
                            </div>
                          )}
                        </td>
                        <td className="px-4 md:px-6 py-4 text-sm md:text-base text-gray-800 font-medium">
                          {item.name}
                        </td>
                        <td className="px-4 md:px-6 py-4 text-sm md:text-base text-gray-800 font-semibold">
                          ${item.price?.toFixed(2) || '0.00'}
                        </td>
                        <td className="px-4 md:px-6 py-4 text-sm md:text-base text-gray-800">
                          {item.available || 0}
                        </td>
                        <td className="px-4 md:px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.isInStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {item.isInStock ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </td>
                        <td className="px-4 md:px-6 py-4 flex gap-2 md:gap-3">
                          <button
                            onClick={() => handleViewItem(item._id!)}
                            className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded transition"
                            title="View"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => handleEditItem(item._id!)}
                            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition"
                            title="Edit"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(item._id!)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                        {products.length === 0 ? 'No products found. Add your first product!' : 'No items match your search.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        {!loading && filteredData.length > 0 && (
          <div className="mt-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600">
              Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredData.length)} of {filteredData.length} results
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft size={18} />
              </button>

              {getPaginationButtons().map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg font-semibold transition ${currentPage === page ? 'bg-[#C9A040] text-white' : 'border border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}