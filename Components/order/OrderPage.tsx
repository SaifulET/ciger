'use client'
import { useState, useMemo, useEffect } from 'react';
import { Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useOrderStore } from '@/app/store/useOrderStore';

interface Order {
  no: string;
  orderId: string;
  mobile: string;
  payment: string;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Canceled';
  _id: string; // Add _id to the interface
}

const OrderManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage: number = 8;

  const { orders, ordersLoading, ordersError, fetchAllOrders } = useOrderStore();
  const router = useRouter();

  useEffect(() => {
    fetchAllOrders();
  }, [fetchAllOrders]);

  // Map API status to component status
  const mapOrderStatus = (state: string): 'Processing' | 'Shipped' | 'Delivered' | 'Canceled' => {
    switch (state) {
      case 'processing': return 'Processing';
      case 'shipped': return 'Shipped';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Canceled';
      case 'refunded': return 'Canceled';
      default: return 'Processing';
    }
  };

  // Convert API orders to component format - INCLUDING _id
  const allOrders: Order[] = useMemo(() => {
    return orders.map((order, index) => ({
      no: (index + 1).toString().padStart(2, '0'),
      orderId: order.orderId,
      mobile: order.phone,
      payment: `$${order.total.toFixed(2)}`,
      status: mapOrderStatus(order.state),
      _id: order._id, // Include the MongoDB _id
    }));
  }, [orders]);

  const filteredOrders: Order[] = useMemo(() => {
    return allOrders.filter(order =>
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, allOrders]);

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
      case 'Canceled':
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
        return 'bg-[#29BB7D]'; // Fixed typo: was 'M' instead of 'D'
      case 'Canceled':
        return 'bg-[#DD2C2C]';
      default:
        return 'bg-gray-400';
    }
  };

  // FIXED: Use _id instead of orderId for redirect
  const handleViewOrder = (orderId: string): void => {
    router.push(`/pages/order/viewOrder/${orderId}`);
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
                  <td className="px-6 py-4 font-medium text-gray-900">{order.orderId}</td>
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

            {Array.from({ length: totalPages }, (_, i: number) => i + 1).map((page: number) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-10 h-10 rounded-lg font-medium transition-all ${
                  currentPage === page
                    ? ' text-[#C9A040] border-2 border-[#C9A040]'
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
      </div>
    </div>
  );
};

export default OrderManagement;