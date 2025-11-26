'use client'
import { useState, useMemo, FC, useEffect } from 'react';
import { Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useOrderStore, ApiOrder } from '@/app/store/useOrderStore'; // Adjust import path as needed

interface Order {
  no: string;
  orderId: string;
  mobile: string;
  payment: string;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  _id: string;
}

const RefundManagement: FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage: number = 8;

  // Use store data
  const { 
    orders, 
    ordersLoading, 
    ordersError, 
    fetchAllOrders 
  } = useOrderStore();

  // Fetch orders on component mount
  useEffect(() => {
    fetchAllOrders();
  }, [fetchAllOrders]);

  // Transform store data to component format and filter only cancelled orders
  const allOrders: Order[] = useMemo(() => {
    if (!orders || orders.length === 0) return [];
    
    const cancelledOrders = orders.filter(order => order.state === 'cancelled');
    
    return cancelledOrders.map((order, index) => ({
      no: (index + 1).toString().padStart(2, '0'),
      orderId: `#${order.orderId}`,
      mobile: order.phone,
      payment: `$${order.total.toFixed(2)}`,
      status: 'Cancelled' as const,
      _id: order._id
    }));
  }, [orders]);

  // Filter by search term
  const filteredOrders: Order[] = useMemo(() => {
    return allOrders.filter(order =>
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allOrders, searchTerm]);

  const totalPages: number = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders: Order[] = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusColor = (status: Order['status']): string => {
    switch (status) {
      case 'Processing':
        return 'text-[#B27B0E] bg-[#FFF7E8]';
      case 'Shipped':
        return 'text-[#B0B0B0] bg-[#F5F5F5]';
      case 'Delivered':
        return 'text-[#29BB7D] bg-[#EAFAF3]';
      case 'Cancelled':
        return 'text-[#DD2C2C] bg-[#FCEAEA]';
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
        return 'bg-[#29BB7M]';
      case 'Cancelled':
        return 'bg-[#DD2C2C]';
      default:
        return 'bg-gray-400';
    }
  };

  const router = useRouter();

  const handleViewOrder = (orderId: string, _id: string): void => {
    router.push(`/pages/refunds/${_id}`);
  };

  const handleSearchChange = (value: string): void => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
  };

  // Loading state
  if (ordersLoading) {
    return (
      <div className="min-h-screen ml-8 flex items-center justify-center text-gray-800">
        <div className="text-center">
          <div className="text-lg font-semibold mb-4">Loading cancelled orders...</div>
          <div className="text-gray-500">Fetching refund management data</div>
        </div>
      </div>
    );
  }

  // Error state
  if (ordersError) {
    return (
      <div className="min-h-screen ml-8 flex items-center justify-center text-gray-800">
        <div className="text-center text-red-600">
          <div className="text-lg font-semibold mb-4">Error loading orders</div>
          <div className="mb-4">{ordersError}</div>
          <button 
            onClick={() => fetchAllOrders()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ml-8 text-gray-800">
      <div>
        {/* Header */}
        <div className="flex justify-between items-center mb-8 py-6 px-8 bg-white rounded-lg">
          <h1 className="text-4xl font-bold text-black">Refund Management</h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Search by Order ID"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 pr-4 py-4 bg-gray-100 rounded-lg text-sm text-gray-700 placeholder-gray-500 focus:outline-none"
            />
            <svg
              className="absolute left-3 top-4 w-6 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg bg-white">
          <table className="w-full">
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

            <tbody>
              {paginatedOrders.length > 0 ? (
                paginatedOrders.map((order: Order, idx: number) => (
                  <tr key={order._id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-700">{order.no}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{order._id}</td>
                    <td className="px-6 py-4 text-gray-700">{order.mobile}</td>
                    <td className="px-6 py-4 text-gray-700">{order.payment}</td>
                    <td className="px-6 py-4">
                      <div
                        className={`flex items-center gap-2 w-30 py-1 rounded-full ${getStatusColor(order.status)}`}
                      >
                        <span
                          className={`px-3 py-1 w-20 rounded-full font-semibold text-[12px] leading-[20px] tracking-[0] text-center ${getStatusColor(order.status)}`}
                        >
                          {order.status}
                        </span>
                        <span className={`w-2 h-2 rounded-full ${getStatusDot(order.status)}`}></span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleViewOrder(order.orderId, order._id)}
                        className="text-gray-600 hover:text-gray-900 transition-colors"
                        title="View"
                      >
                        <Eye size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    {orders.length === 0 ? 'No orders found' : allOrders.length === 0 ? 'No cancelled orders found' : 'No orders match your search'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {paginatedOrders.length > 0 && (
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

              {Array.from({ length: totalPages }, (_, i: number) => i + 1).map((page: number) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-10 h-10 rounded-lg font-medium transition-all ${
                    currentPage === page
                      ? 'bg-[#C9A040] text-gray-900 border-2 border-[#C9A040]'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
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
        )}
      </div>
    </div>
  );
};

export default RefundManagement;