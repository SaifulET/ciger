'use client'
import { useState } from 'react';
import { Eye, Trash2 } from 'lucide-react';
import { PencilEdit02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useRouter } from 'next/navigation';

interface DiscountCode {
  id: string;
  code: string;
  percentage: number;
}

// Sample JSON data
const discountCodesData: DiscountCode[] = [
  { id: '1', code: 'ELFD0646', percentage: 5 },
  { id: '2', code: 'SUMMER2024', percentage: 10 },
  { id: '3', code: 'WELCOME15', percentage: 15 },
  { id: '4', code: 'SAVE20NOW', percentage: 20 },
  { id: '5', code: 'MEGA25', percentage: 25 },
  { id: '6', code: 'MEGA25', percentage: 25 },
  { id: '7', code: 'MEGA25', percentage: 25 },
  { id: '8', code: 'MEGA25', percentage: 25 },
  { id: '9', code: 'MEGA25', percentage: 25 },
];

export default function DiscountCodePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(discountCodesData.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = discountCodesData.slice(startIndex, endIndex);
  const router= useRouter()

  const handleCreateCode = () => {
    // Navigate to: /pages/discountCode/create
    console.log('Navigate to: /pages/discountCode/create');
    router.push("/pages/discountCode/create")
    
  };

  const handleEdit = (id: string) => {
    // Navigate to: /pages/discountCode/edit/{id}
    console.log(`Navigate to: /pages/discountCode/edit/${id}`);
        router.push(`/pages/discountCode/edit/${id}`);

  };

  const handleView = (id: string) => {
    // Navigate to: /pages/discountCode/view/{id}
    console.log(`Navigate to: /pages/discountCode/view/${id}`);
    router.push(`/pages/discountCode/view/${id}`);;
  };

  const handleDelete = (id: string) => {
    console.log('Delete discount code:', id);
    alert(`Delete discount code: ${id}`);
  };

  return (
    <div className="min-h-screen ml-8">
      <div className="">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 bg-white rounded-lg shadow-sm p-8">
          <h1 className="font-semibold text-[40px] leading-[48px] tracking-[0] text-gray-900">Discount Code</h1>
          <button 
            onClick={handleCreateCode}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#C9A040] text-gray-800 rounded-lg hover:bg-[#9e7e33] transition-colors font-semibold text-[16px] leading-[24px] tracking-[0]"
          >
            <HugeiconsIcon icon={PencilEdit02Icon} />
            Create Code
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg bg-white">
          <table className="w-full">
            <thead>
              <tr className="bg-[#E6D3A7]">
                <th className="text-left px-6 py-3.5 font-semibold text-gray-800 text-sm">No</th>
                <th className="text-left px-6 py-3.5 font-semibold text-gray-800 text-sm">Discount Code</th>
                <th className="text-left px-6 py-3.5 font-semibold text-gray-800 text-sm">Percentage</th>
                <th className="text-left px-6 py-3.5 font-semibold text-gray-800 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((item, index) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-700 text-sm">
                    {String(startIndex + index + 1).padStart(2, '0')}
                  </td>
                  <td className="px-6 py-4 text-gray-900 text-sm font-medium">{item.code}</td>
                  <td className="px-6 py-4 text-gray-900 text-sm">{item.percentage}%</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleEdit(item.id)}
                        className="text-cyan-500 hover:text-cyan-600 transition-colors text-[24px]"
                        title="Edit"
                      >
                        <HugeiconsIcon icon={PencilEdit02Icon} />
                      </button>
                      <button
                        onClick={() => handleView(item.id)}
                        className="text-gray-900 hover:text-gray-950 transition-colors"
                        title="View"
                      >
                        <Eye size={24} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-500 hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={24} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Footer with Pagination */}
          <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              No of Results <span className="font-medium">{endIndex<discountCodesData.length?endIndex:discountCodesData.length}</span> out of <span className="font-medium">{discountCodesData.length}</span>
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="w-9 h-9 flex items-center justify-center rounded-md border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-gray-700"
              >
                &lt;
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 flex items-center justify-center rounded-md border transition-colors text-sm font-medium ${
                    currentPage === page
                      ? 'text-[#C9A040] border-2 border-[#C9A040]'
                      : 'border-gray-300 bg-white hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="w-9 h-9 flex items-center justify-center rounded-md border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-gray-700"
              >
                &gt;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}