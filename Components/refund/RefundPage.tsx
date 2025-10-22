'use client'
import { useState, useMemo, FC } from 'react';
import { Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

interface Order {
  no: string;
  orderId: string;
  mobile: string;
  payment: string;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Canceled';
}

const RefundManagement: FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage: number = 8;

  const allOrders: Order[] = [
    { no: '01', orderId: '#10234', mobile: '87895654529', payment: '$223.22', status: 'Processing' },
    { no: '02', orderId: '#10235', mobile: '87895654530', payment: '$150.00', status: 'Processing' },
    { no: '03', orderId: '#10236', mobile: '87895654531', payment: '$299.99', status: 'Canceled' },
    { no: '04', orderId: '#10237', mobile: '87895654532', payment: '$75.50', status: 'Shipped' },
    { no: '05', orderId: '#10238', mobile: '87895654533', payment: '$189.99', status: 'Canceled' },
    { no: '06', orderId: '#10239', mobile: '87895654534', payment: '$120.00', status: 'Delivered' },
    { no: '07', orderId: '#10240', mobile: '87895654535', payment: '$500.00', status: 'Canceled' },
    { no: '08', orderId: '#10241', mobile: '87895654536', payment: '$89.50', status: 'Processing' },
  ];

  // ✅ Only Canceled orders will show
  const filteredOrders: Order[] = useMemo(() => {
    return allOrders
      .filter(order =>
        order.orderId.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter(order => order.status === 'Canceled');
  }, [searchTerm]);

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
        return 'bg-[#29BB7D]';
      case 'Canceled':
        return 'bg-[#DD2C2C]';
      default:
        return 'bg-gray-400';
    }
  };

  const router = useRouter();

  const handleViewOrder = (orderId: string): void => {
    router.push(`/pages/refunds/${orderId.slice(1, 6)}`);
  };

  const handleSearchChange = (value: string): void => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen ml-8">
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
              {paginatedOrders.map((order: Order, idx: number) => (
                <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-700">{order.no}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{order.orderId}</td>
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
                      onClick={() => handleViewOrder(order.orderId)}
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
      </div>
    </div>
  );
};

export default RefundManagement;
