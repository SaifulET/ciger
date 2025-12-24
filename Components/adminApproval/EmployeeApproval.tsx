"use client";
import { useState, useMemo, useEffect } from "react";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import api from "@/lib/axios";
import { getEmail } from "@/app/utility/utility";
import {
  Cancel01FreeIcons,
  Cancel01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

// Define Employee type
interface Employee {
  _id: string;
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  approval: boolean;
  createdAt?: string;
}

export default function EmployeeManagement() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const itemsPerPage = 8;
  const searchParams = useSearchParams();
  const urlPage = searchParams.get("page");

  const [currentPage, setCurrentPage] = useState(
    urlPage ? parseInt(urlPage) : 1
  );

  // Show notification
  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // Fetch employees from API
  const fetchEmployees = async () => {
    try {
      setLoading(true);

      const token = Cookies.get("token");
      if (!token) {
        router.push("/auth/signin");
        return;
      }
      const email = getEmail();
      if (email !== "support@smokenza.com") {
        router.push("/pages/dashboard");
      }
      const response = await api.get("/employee/allEmployee", {});
      console.log(response.data, "data", response.data.data);
      if (!response.data) {
        throw new Error(`Failed to fetch employees: ${response.status}`);
      }

      const data = response.data.data;
      setEmployees(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load employees";
      setError(errorMessage);
      showNotification(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  // Update approval status
  const updateApproval = async (employeeId: string, newApproval: boolean) => {
    try {
      setUpdatingId(employeeId);
      const token = Cookies.get("token");
      if (!token) {
        router.push("/auth/signin");
        return;
      }
      const email = getEmail();
      if (email !== "support@smokenza.com") {
        router.push("/pages/dashboard");
      }
      const response = await api.post(`employee/updateApproval/${employeeId}`, {
        approval: newApproval,
      });
      console.log(response.data, "abc", response.data.data);
      if (!response.data) {
        throw new Error(`Failed to update approval: ${response.status}`);
      }

      // Update local state
      setEmployees((prev) =>
        prev.map((emp) =>
          emp._id === employeeId ? { ...emp, approval: newApproval } : emp
        )
      );

      showNotification(
        `Approval ${newApproval ? "granted" : "revoked"} successfully`,
        "success"
      );
    } catch (err) {
      showNotification("Failed to update approval status", "error");
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  // Toggle approval handler
  const handleToggleApproval = (employee: Employee) => {
    const newApproval = !employee.approval;
    updateApproval(employee._id, newApproval);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Update URL when page changes
  useEffect(() => {
    if (currentPage > 1) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", currentPage.toString());
      router.push(`?${params.toString()}`, { scroll: false });
    } else if (currentPage === 1 && urlPage) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("page");
      router.push(`?${params.toString()}`, { scroll: false });
    }
  }, [currentPage, router, searchParams, urlPage]);

  // Filter employees based on search query
  const filteredEmployees = useMemo(() => {
    return employees.filter(
      (employee) =>
        employee?.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee._id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, employees]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEmployees = filteredEmployees.slice(startIndex, endIndex);

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
        <div className="text-lg">Loading employees...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen ml-8 text-gray-800 flex items-center justify-center">
        <div className="text-lg text-red-500">Error: {error}</div>
        <button
          onClick={fetchEmployees}
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen ml-8 text-gray-800">
      {/* Notification Banner */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transition-all duration-300 ${
            notification.type === "success"
              ? "bg-green-50 border border-green-200 text-green-800"
              : "bg-red-50 border border-red-200 text-red-800"
          }`}
        >
          <div className="flex items-center">
            {notification.type === "success" ? (
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            <span className="font-medium">{notification.message}</span>
            <button
              onClick={() => setNotification(null)}
              className="ml-4 text-gray-500 hover:text-gray-700"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 px-8 py-4 bg-white rounded-lg">
          <h1 className="text-4xl font-bold text-gray-900">
            Employee Management
          </h1>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, email, or ID"
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
                <th className="px-6 py-4 text-left text-gray-900 font-semibold">
                  No
                </th>
                <th className="px-6 py-4 text-left text-gray-900 font-semibold">
                  Employee ID
                </th>
                <th className="px-6 py-4 text-left text-gray-900 font-semibold">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-gray-900 font-semibold">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-gray-900 font-semibold">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-gray-900 font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {currentEmployees.map((employee, index) => (
                <tr
                  key={employee._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-gray-900">
                    {startIndex + index + 1}
                  </td>
                  <td className="px-6 py-4 text-gray-900 font-medium">
                    {employee._id}
                  </td>
                  <td className="px-6 py-4 text-gray-900">
                    {employee?.firstName} {employee?.lastName}
                  </td>
                  <td className="px-6 py-4 text-gray-900">{employee.email}</td>
                  <td className="px-6 py-4 text-gray-900">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        employee.approval
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {employee.approval ? "Approved" : "Pending"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {/* Toggle Approval Button - Compact Size */}
                    <button
                      onClick={() => handleToggleApproval(employee)}
                      disabled={updatingId === employee._id}
                      className={`px-2 py-1 rounded text-[14px] font-medium transition-all ${
                        employee.approval
                          ? "bg-red-700 text-white hover:bg-red-600 border border-red-200"
                          : "bg-green-700 text-white hover:bg-green-600 border border-green-200"
                      } ${
                        updatingId === employee._id
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:shadow-sm"
                      }`}
                    >
                      {updatingId === employee._id ? (
                        <span className="flex items-center">Updating...</span>
                      ) : employee.approval ? (
                        <div className="flex items-center justify-around gap-2 pr-2">
                          <HugeiconsIcon icon={Cancel01Icon} /> Revoke
                        </div>
                      ) : (
                        <div className="flex items-center justify-around gap-2 pr-2">
                          <HugeiconsIcon icon={Tick02Icon} /> Grant
                        </div>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer with Results Count and Pagination */}
        <div className="mt-6 flex justify-between items-center">
          <p className="text-gray-600">
            Showing {startIndex + 1} to{" "}
            {Math.min(endIndex, filteredEmployees.length)} of{" "}
            {filteredEmployees.length} results
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
                    ? "border-[#C9A040] bg-white text-[#C9A040]"
                    : "border-gray-300 bg-white hover:bg-gray-50 text-gray-700"
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

        {/* Empty State */}
        {employees.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">No employees found</div>
            <button
              onClick={fetchEmployees}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Refresh
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
