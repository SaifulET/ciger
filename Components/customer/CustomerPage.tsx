'use client'
import { useState, useMemo } from 'react';
import { Search, Eye } from 'lucide-react';
import Link from 'next/link';

interface Customer {
  id: number;
  name: string;
  email: string;
  mobile: string;
}

// Sample customer data
const customersData: Customer[] = [
  { id: 1, name: "Guy Hawkins", email: "example@gmail.com", mobile: "878954529" },
  { id: 2, name: "Guy Hawkins", email: "example@gmail.com", mobile: "878954529" },
  { id: 3, name: "Jane Cooper", email: "jane.cooper@gmail.com", mobile: "878954530" },
  { id: 4, name: "Wade Warren", email: "wade.warren@gmail.com", mobile: "878954531" },
  { id: 5, name: "Esther Howard", email: "esther.howard@gmail.com", mobile: "878954532" },
  { id: 6, name: "Cameron Williamson", email: "cameron.w@gmail.com", mobile: "878954533" },
  { id: 7, name: "Brooklyn Simmons", email: "brooklyn.s@gmail.com", mobile: "878954534" },
  { id: 8, name: "Savannah Nguyen", email: "savannah.n@gmail.com", mobile: "878954535" },
  { id: 9, name: "Leslie Alexander", email: "leslie.a@gmail.com", mobile: "878954536" },
  { id: 10, name: "Jenny Wilson", email: "jenny.w@gmail.com", mobile: "878954537" },
];

export default function CustomerManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter customers based on search query
  const filteredCustomers = useMemo(() => {
    return customersData.filter(customer =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCustomers = filteredCustomers.slice(startIndex, endIndex);

  // Handle search input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="min-h-screen   ml-8">
      <div className="">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 px-8 py-4 bg-white rounded-lg">
          <h1 className="text-4xl font-bold text-gray-900">Customer Management</h1>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for Users"
              value={searchQuery}
              onChange={handleSearch}
              className="pl-12 pr-4 py-3 w-80 bg-white border-0 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-200 text-gray-700"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden pb-5">
          <table className="w-full">
            <thead>
              <tr className="bg-[#E6D3A7]">
                <th className="px-6 py-4 text-left text-gray-900 font-semibold">No</th>
                <th className="px-6 py-4 text-left text-gray-900 font-semibold">Customer Name</th>
                <th className="px-6 py-4 text-left text-gray-900 font-semibold">Email</th>
                <th className="px-6 py-4 text-left text-gray-900 font-semibold">Mobile</th>
                <th className="px-6 py-4 text-left text-gray-900 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {currentCustomers.map((customer, index) => (
                <tr key={customer.id} className=" ">
                  <td className="px-6 py-4 text-gray-900">{startIndex + index + 1}</td>
                  <td className="px-6 py-4 text-gray-900">{customer.name}</td>
                  <td className="px-6 py-4 text-gray-900">{customer.email}</td>
                  <td className="px-6 py-4 text-gray-900">{customer.mobile}</td>
                  <td className="px-6 py-4">
                    <Link href="/pages/customers/234">
                    <button className="text-gray-600 text-right  pl-5 hover:text-gray-900 transition-colors">
                      <Eye className="w-5 h-5" />
                    </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer with Results Count and Pagination */}
        <div className="mt-6 flex justify-between items-center">
          <p className="text-gray-600">
            No of Results {filteredCustomers.length} out of {customersData.length}
          </p>
          
          {/* Pagination */}
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="w-10 h-10 rounded-lg border border-gray-300 bg-white flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              ‹
            </button>
            
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`w-10 h-10 rounded-lg border flex items-center justify-center transition-colors ${
                  currentPage === i + 1
                    ? 'border-[#C9A040] bg-white text-[#C9A040]'
                    : 'border-gray-300 bg-white hover:bg-gray-50 text-gray-700'
                }`}
              >
                {i + 1}
              </button>
            ))}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="w-10 h-10 rounded-lg border border-gray-300 bg-white flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}