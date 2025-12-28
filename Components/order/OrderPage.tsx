'use client'
import { useState, useMemo, useEffect } from 'react';
import { Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useOrderStore } from '@/app/store/useOrderStore';

interface Order {
  no: string;
  orderId: string;
  mobile: string;
  orderid: string;
  payment: string;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Canceled' | 'Refunded';
  _id: string;
}

const OrderManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const itemsPerPage: number = 8;
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlPage = searchParams.get('page');
  
  const [currentPage, setCurrentPage] = useState<number>(
    urlPage ? parseInt(urlPage) : 1
  );

  const { orders, ordersLoading, ordersError, fetchAllOrders } = useOrderStore();

  useEffect(() => {
    fetchAllOrders();
  }, [fetchAllOrders]);

  useEffect(() => {
    if (currentPage > 1) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', currentPage.toString());
      router.push(`?${params.toString()}`, { scroll: false });
    } else if (currentPage === 1 && urlPage) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete('page');
      router.push(`?${params.toString()}`, { scroll: false });
    }
  }, [currentPage, router, searchParams, urlPage]);

  const mapOrderStatus = (state: string): 'Processing' | 'Shipped' | 'Delivered' | 'Canceled' | 'Refunded' => {
    switch (state) {
      case 'processing': return 'Processing';
      case 'shipped': return 'Shipped';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Canceled';
      case 'refunded': return 'Refunded';
      default: return 'Processing';
    }
  };

  const allOrders: Order[] = useMemo(() => {
    return orders.map((order, index) => ({
      no: (index + 1).toString().padStart(2, '0'),
      orderId: order.orderId,
      orderid: order.orderid,
      mobile: order.phone,
      payment: `$${order.total.toFixed(2)}`,
      status: mapOrderStatus(order.state),
      _id: order._id,
    }));
  }, [orders]);

  const filteredOrders: Order[] = useMemo(() => {
    return allOrders.filter(order =>
      order.orderid.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, allOrders]);

  const totalPages: number = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders: Order[] = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Function to generate page numbers with ellipsis
  const getPageNumbers = (): (number | string)[] => {
    const maxVisiblePages = 3;
    const pages: (number | string)[] = [];
    
    if (totalPages <= maxVisiblePages + 2) {
      // Show all pages if total pages are small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      // Calculate start and end of visible page range
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust if we're at the beginning
      if (currentPage <= 2) {
        endPage = 3;
      }
      
      // Adjust if we're at the end
      if (currentPage >= totalPages - 1) {
        startPage = totalPages - 2;
      }
      
      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pages.push('...');
      }
      
      // Add visible page range
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pages.push('...');
      }
      
      // Always show last page
      pages.push(totalPages);
    }
    
    return pages;
  };

  const getStatusColor = (status: Order['status']): string => {
    switch (status) {
      case 'Processing':
        return 'text-[#B27B0E] bg-[#FFF7E8]';
      case 'Shipped':
        return 'text-[#B0B0B0] bg-[#F5F5F5]';
      case 'Delivered':
        return 'text-[#29BB7D] bg-[#EAFAF3]';
      case 'Canceled':
        return 'text-[#DD2C2C] bg-[#FCEAEA]';
      case 'Refunded':
        return 'text-[#1E60D4] bg-[#E8F1FF]';
      default:
        return 'text-gray-500 bg-gray-50';
    }
  };

  const getStatusDot = (status: Order['status']): string => {
    switch (status) {
      case 'Processing':
        return 'bg-[#B27B0E]';
      case 'Shipped':
        return 'bg-[#B0B0B0]';
      case 'Delivered':
        return 'bg-[#29BB7D]';
      case 'Canceled':
        return 'bg-[#DD2C2C]';
      case 'Refunded':
        return 'bg-[#1E60D4]';
      default:
        return 'bg-gray-400';
    }
  };

  const handleViewOrder = (orderId: string): void => {
    router.push(`/pages/order/viewOrder/${orderId}?page=${currentPage}`);
  };

  const handleSearchChange = (value: string): void => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
  };

  if (ordersLoading) {
    return (
      <div className="min-h-screen ml-8 text-gray-800 flex items-center justify-center">
        <div className="text-lg">Loading orders...</div>
      </div>
    );
  }

  if (ordersError) {
    return (
      <div className="min-h-screen ml-8 text-gray-800 flex items-center justify-center">
        <div className="text-lg text-red-500">Error: {ordersError}</div>
      </div>
    );
  }

  const pageNumbers = getPageNumbers();

  return (
    <div className="min-h-screen ml-8 text-gray-800">
      <div className="">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 py-6 px-8 bg-white rounded-lg">
          <h1 className="text-4xl font-bold text-black">Order Management</h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Search by Order ID"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 pr-4 py-4 bg-gray-100 rounded-lg text-sm text-gray-700 placeholder-gray-500 focus:outline-none"
            />
            <svg className="absolute left-3 top-4 w-6 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg bg-white ">
          <table className="w-full">
            {/* Header */}
            <thead>
              <tr className="bg-[#E6D3A7]">
                <th className="px-6 py-4 text-left font-semibold text-gray-900">No</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">Order ID</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">Mobile</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">Payment</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {paginatedOrders.map((order: Order, idx: number) => (
                <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-700">{order.no}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{order.orderid}</td>
                  <td className="px-6 py-4 text-gray-700">{order.mobile}</td>
                  <td className="px-6 py-4 text-gray-700">{order.payment}</td>
                  <td className="px-6 py-4">
                    <div className={`flex items-center gap-2 w-30 py-1 rounded-full  ${getStatusColor(order.status)} `} >
                      <span className={`px-3 py-1 w-20 rounded-full font-semibold text-[12px] leading-[20px] tracking-[0] text-center  ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                      <span className={`w-2 h-2 rounded-full ${getStatusDot(order.status)}`}></span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleViewOrder(order._id)}
                      className="text-gray-600 hover:text-gray-900 transition-colors"
                      title="View"
                    >
                      <Eye size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-8">
          <p className="text-sm text-gray-600">
            No of Results {paginatedOrders.length} out of {filteredOrders.length}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={20} />
            </button>

            {pageNumbers.map((page, index) => (
              page === '...' ? (
                <span
                  key={`ellipsis-${index}`}
                  className="w-10 h-10 flex items-center justify-center text-gray-500"
                >
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => handlePageChange(page as number)}
                  className={`w-10 h-10 rounded-lg font-medium transition-all ${
                    currentPage === page
                      ? ' text-[#C9A040] border-2 border-[#C9A040]'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              )
            ))}

            <button
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;