'use client'
import { useState, useMemo, useEffect } from 'react';
import { Search, Eye } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation'; // Add useSearchParams
import { useCustomerStore } from '@/app/store/useCustomerStore';
import Cookies from "js-cookie";
export default function CustomerManagement() {

   const router = useRouter();
  useEffect(()=>{
      Cookies.get("token")?"":router.push("/auth/signin")
    },[Cookies.get("token")])
  const [searchQuery, setSearchQuery] = useState('');
  const itemsPerPage = 8;
  
  // Use URL search params to get and set page
  const searchParams = useSearchParams();
  
  const urlPage = searchParams.get('page');
  
  // Initialize currentPage from URL or default to 1
  const [currentPage, setCurrentPage] = useState(
    urlPage ? parseInt(urlPage) : 1
  );

  const { customers, loading, error, fetchCustomers } = useCustomerStore();

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

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

  // Filter customers based on search query
  const filteredCustomers = useMemo(() => {
    return customers.filter(customer =>
      customer.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, customers]);

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

  if (loading) {
    return (
      <div className="min-h-screen ml-8 text-gray-800 flex items-center justify-center">
        <div className="text-lg">Loading customers...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen ml-8 text-gray-800 flex items-center justify-center">
        <div className="text-lg text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ml-8 text-gray-800">
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
                <th className="px-6 py-4 text-left text-gray-900 font-semibold">Customer Email</th>
                <th className="px-6 py-4 text-left text-gray-900 font-semibold">Member Since</th>
                <th className="px-6 py-4 text-left text-gray-900 font-semibold">Status</th>
                <th className="px-6 py-4 text-left text-gray-900 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {currentCustomers.map((customer, index) => (
                <tr key={customer._id} className=" ">
                  <td className="px-6 py-4 text-gray-900">{startIndex + index + 1}</td>
                  <td className="px-6 py-4 text-gray-900">{customer.email}</td>
                  <td className="px-6 py-4 text-gray-900">
                    {new Date(customer.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-gray-900">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      customer.isSignin 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {customer.isSignin ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/pages/customers/${customer._id}?page=${currentPage}`}> {/* Pass current page */}
                      <button className="text-gray-600 text-right pl-5 hover:text-gray-900 transition-colors">
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
            No of Results {filteredCustomers.length} out of {customers.length}
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