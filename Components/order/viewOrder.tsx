"use client";
import React, { useState } from "react";
import { ChevronLeft, ChevronDown, ChevronUp } from "lucide-react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft02Icon } from "@hugeicons/core-free-icons";
import OrderSummary from "@/Components/order/OrderSummary";

// ================= TYPES =================
type OrderStatus = "canceled" | "delivered" | "shipped" | "processing";

interface StatusConfig {
  bg: string;
  text: string;
  border: string;
  dotColor: string;
}

interface ContactDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface OrderItem {
  id: number;
  image: string;
  brand: string;
  product: string;
  unitPrice: number;
  quantity: number;
  total: number;
}

interface OrderData {
  orderId: string;
  trackingNo: string;
  placedOn: string;
  contact: ContactDetails;
  items: OrderItem[];
  tax: { label: string; amount: number };
  discount: { label: string; amount: number };
  shippingCost: number;
  subTotal: number;
  payment: { status: string; amount: number };
}

// ================= SAMPLE DATA =================
const orderData: OrderData = {
  orderId: "10234",
  trackingNo: "62862616",
  placedOn: "Sep 22, 2025",
  contact: {
    name: "John Doe",
    email: "example@gmail.com",
    phone: "+8801XXXXXXX",
    address: "43, Moskhali, 1234, Dhaka, Bangladesh",
  },
  items: [
    {
      id: 1,
      image: "/api/placeholder/50/50",
      brand: "Brand Name",
      product: "Good Stuff Red Pipe Tobacco - 16 oz. Bag",
      unitPrice: 126.66,
      quantity: 2,
      total: 253.32,
    },
    {
      id: 2,
      image: "/api/placeholder/50/50",
      brand: "Brand Name",
      product: "Good Stuff Red Pipe Tobacco - 16 oz. Bag",
      unitPrice: 126.66,
      quantity: 2,
      total: 253.32,
    },
  ],
  tax: { label: "5%", amount: 12.66 },
  discount: { label: "5%", amount: 6.33 },
  shippingCost: 15.0,
  subTotal: 500.65,
  payment: { status: "Paid", amount: 521.98 },
};

// ================= PAGE COMPONENT =================
const OrderDetailsPage: React.FC = () => {
  const [orderStatus, setOrderStatus] = useState<OrderStatus>("processing");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const statusConfig: Record<OrderStatus, StatusConfig> = {
    canceled: {
      bg: "bg-[#FCEAEA]",
      text: "text-[#DD2C2C]",
      border: "border-red-200",
      dotColor: "bg-[#DD2C2C]",
    },
    delivered: {
      bg: "bg-[#EAFAF3]",
      text: "text-[#29BB7D]",
      border: "border-green-200",
      dotColor: "bg-[#29BB7D]",
    },
    shipped: {
      bg: "bg-[#F5F5F5]",
      text: "text-[#B0B0B0]",
      border: "border-gray-200",
      dotColor: "bg-[#B0B0B0]",
    },
    processing: {
      bg: "bg-[#FFF7E8]",
      text: "text-[#B27B0E]",
      border: "border-yellow-200",
      dotColor: "bg-[#B27B0E]",
    },
  };

  const downloadInvoice = () => {
    window.location.href = `/invoice/${orderData.orderId}`;
  };

  const handleStatusChange = (status: OrderStatus) => {
    setOrderStatus(status);
    setIsDropdownOpen(false);
  };

  const navigateToOrders = () => {
    window.location.href = "/pages/order";
  };

  return (
    <div className="min-h-screen ml-8">
      <div className="pt-3 pb-2 rounded-lg px-6 bg-white mb-8">
        {/* ===== HEADER ===== */}
        <div className="flex items-center justify-start">
          <div className="flex items-center gap-3">
            <button
              onClick={navigateToOrders}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <HugeiconsIcon icon={ArrowLeft02Icon} />
              <span className="text-sm">Order Management</span>
            </button>
            <ChevronLeft className="w-4 h-4 text-gray-400 rotate-180" />
            <span className="text-sm text-gray-500">View Order</span>
          </div>
        </div>

        {/* ===== TITLE + STATUS DROPDOWN ===== */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
          <div className="relative">
            <label className="block text-sm text-gray-600 mb-2">
              Change the Order State
            </label>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full md:w-64 px-4 py-2 bg-white border border-gray-300 rounded-lg flex items-center justify-between hover:border-gray-400 transition-colors"
            >
              <span className="text-sm text-gray-700 capitalize">
                {orderStatus}
              </span>
              {isDropdownOpen ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
            {isDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                {(Object.keys(statusConfig) as OrderStatus[]).map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    className="w-full px-4 py-2 text-left text-sm capitalize hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                  >
                    {status}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===== CONTACT DETAILS ===== */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-4 ">
        <h2 className="font-semibold text-[28px] leading-[36px] tracking-[0] mb-4">
          Contact Details
        </h2>
        <div className="p-4 px-10 rounded-lg border border-amber-950">
          <div className="block md:flex items-center justify-between mb-6">
            <div>
              <label className="text-gray-500 text-sm font-semibold mb-1 block">
                Name
              </label>
              <p className="text-gray-900">{orderData.contact.name}</p>
            </div>
            <div>
              <label className="text-gray-500 text-sm font-semibold mb-1 block">
                Email
              </label>
              <p className="text-gray-900">{orderData.contact.email}</p>
            </div>
          </div>
          <div className="block md:flex items-center justify-between">
            <div>
              <label className="text-gray-500 text-sm font-semibold mb-1 block">
                Delivery Address
              </label>
              <p className="text-gray-900">{orderData.contact.address}</p>
            </div>
            <div>
              <label className="text-gray-500 text-sm font-semibold mb-1 block">
                Phone Number
              </label>
              <p className="text-gray-900">{orderData.contact.phone}</p>
            </div>
          </div>
        </div>
      </div>


{orderStatus === "processing" && (
  <div className="w-full mt-8 space-y-3 flex items-center justify-between px-8 py-4 bg-white rounded-lg mb-8 ">
    {/* Title */}
    <div className=" font-semibold text-[40px] leading-[48px] tracking-[0]  text-gray-800">
      Tracking Number
    </div>

    {/* Searchbar + Button */}
    <div className="flex flex-wrap items-center gap-2">
      <input
        type="text"
        placeholder="Enter tracking number..."
        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
      />
      <button
        type="button"
        className="px-4 py-2 bg-[#C9A040] text-black rounded-lg hover:bg-[#9e771b] transition-all font-semibold text-[16px] leading-[24px] tracking-[0]"
      >
        Send & Save
      </button>
    </div>
  </div>
)}

      {/* ===== REUSABLE COMPONENT ===== */}
      <OrderSummary
        orderData={orderData}
        orderStatus={orderStatus}
        statusConfig={statusConfig}
        onDownload={downloadInvoice}
      />
    </div>
  );
};

export default OrderDetailsPage;
