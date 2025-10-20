'use client'
import React, { useState, useMemo } from 'react';
import { Search, Edit, Eye, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { AddSquareIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

// Sample JSON data
const inventoryData = [
  { id: 1, name: 'Beverage Cola', price: 223.22, stock: 25, image: '🥤' },
  { id: 2, name: 'Apple Juice', price: 150.00, stock: 18, image: '🧃' },
  { id: 3, name: 'Orange Juice', price: 160.50, stock: 22, image: '🧃' },
  { id: 4, name: 'Milk Carton', price: 120.00, stock: 30, image: '🥛' },
  { id: 5, name: 'Almond Beverage', price: 180.75, stock: 15, image: '🥤' },
  { id: 6, name: 'Coffee Premium', price: 280.00, stock: 12, image: '☕' },
  { id: 7, name: 'Tea Green', price: 95.50, stock: 40, image: '🍵' },
  { id: 8, name: 'Iced Tea', price: 130.25, stock: 28, image: '🧋' },
  { id: 9, name: 'Smoothie Mix', price: 190.00, stock: 20, image: '🥤' },
  { id: 10, name: 'Athletic Sports Drink', price: 140.00, stock: 35, image: '🥤' },
  { id: 11, name: 'Coconut Water', price: 175.50, stock: 16, image: '🥥' },
  { id: 12, name: 'Avocado Smoothie', price: 220.00, stock: 11, image: '🥑' },
  { id: 13, name: 'Berry Blast', price: 165.75, stock: 24, image: '🫐' },
  { id: 14, name: 'Banana Shake', price: 145.50, stock: 19, image: '🍌' },
  { id: 15, name: 'Pineapple Punch', price: 155.00, stock: 26, image: '🍍' },
  { id: 16, name: 'Watermelon Refresh', price: 135.25, stock: 32, image: '🍉' },
];

export default function InventoryManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter data based on search
  const filteredData = useMemo(() => {
    return inventoryData.filter(item =>
      item.name.toLowerCase().startsWith(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this item?')) {
      // Delete logic would go here
      console.log('Deleted item:', id);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const getPaginationButtons = () => {
    const buttons = [];
    const maxButtons = 5;
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);

    if (endPage - startPage < maxButtons - 1) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(i);
    }
    return buttons;
  };

  return (
    <div className=" px-6">
      <div className="">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 p-6 bg-white rounded-lg">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Inventory Management</h1>
          <button
            onClick={() => window.location.href = '/pages/inventory/addItem'}
            className="w-full md:w-auto px-6 py-3 bg-[#C9A040] hover:bg-[#967730] text-gray-800 font-semibold rounded-lg transition duration-200 flex"
          >
            <HugeiconsIcon icon={AddSquareIcon} /> &nbsp; Add Item
          </button>
        </div>

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

        {/* Table */}
        <div className="bg-white rounded-lg overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              {/* Table Header */}
              <thead>
                <tr className="bg-[#E6D3A7] text-gray-800">
                  <th className="px-4 md:px-6 py-3 text-left font-semibold text-sm md:text-base">No</th>
                  <th className="px-4 md:px-6 py-3 text-left font-semibold text-sm md:text-base">Image</th>
                  <th className="px-4 md:px-6 py-3 text-left font-semibold text-sm md:text-base">Name</th>
                  <th className="px-4 md:px-6 py-3 text-left font-semibold text-sm md:text-base">Price</th>
                  <th className="px-4 md:px-6 py-3 text-left font-semibold text-sm md:text-base">Stock</th>
                  <th className="px-4 md:px-6 py-3 text-left font-semibold text-sm md:text-base">Actions</th>
                </tr>
              </thead>
              {/* Table Body */}
              <tbody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((item, index) => (
                    <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                      <td className="px-4 md:px-6 py-4 text-sm md:text-base text-gray-800 font-medium">
                        {String(startIndex + index + 1).padStart(2, '0')}
                      </td>
                      <td className="px-4 md:px-6 py-4 text-2xl md:text-3xl">{item.image}</td>
                      <td className="px-4 md:px-6 py-4 text-sm md:text-base text-gray-800">{item.name}</td>
                      <td className="px-4 md:px-6 py-4 text-sm md:text-base text-gray-800 font-semibold">
                        ${item.price.toFixed(2)}
                      </td>
                      <td className="px-4 md:px-6 py-4 text-sm md:text-base text-gray-800">{item.stock}</td>
                      <td className="px-4 md:px-6 py-4 flex gap-2 md:gap-3">
                        <button
                          onClick={() => window.location.href = `/pages/inventory/viewItem?id=${item.id}`}
                          className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded transition"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => window.location.href = `/pages/inventory/editItem?id=${item.id}`}
                          className="p-2 text-black hover:text-[#332c2c] hover:bg-[#9b9696] rounded transition"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      No items found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-600">
            No of Results {Math.min(startIndex + itemsPerPage, filteredData.length)} out of {filteredData.length}
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
                className={`w-8 h-8 rounded-lg font-semibold transition ${
                  currentPage === page
                    ? 'bg-[#C9A040] text-white'
                    : 'border border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
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
      </div>
    </div>
  );
}