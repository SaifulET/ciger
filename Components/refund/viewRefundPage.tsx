"use client";
import React, { useState } from "react";
import { ChevronLeft } from "lucide-react";
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
  refund: boolean; // ✅ Added refund field
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
  refund: false, // ✅ Initially not refunded
};

// ================= PAGE COMPONENT =================
const OrderDetailsPage: React.FC = () => {
  const [orderStatus, setOrderStatus] = useState<OrderStatus>("canceled");
  const [isRefunded, setIsRefunded] = useState(orderData.refund);

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

  const navigateToOrders = () => {
    window.location.href = "/pages/refunds";
  };

  const handleRefundToggle = () => {
    setIsRefunded((prev) => !prev);
    orderData.refund=isRefunded;
  };

  return (
    <div className="min-h-screen ml-8">
      {/* ===== HEADER ===== */}
      <div className="pt-3 pb-2 rounded-lg px-6 bg-white mb-8">
        <div className="flex items-center justify-start">
          <div className="flex items-center gap-3">
            <button
              onClick={navigateToOrders}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <HugeiconsIcon icon={ArrowLeft02Icon} />
              <span className="text-sm">Refund Management</span>
            </button>
            <ChevronLeft className="w-4 h-4 text-gray-400 rotate-180" />
            <span className="text-sm text-gray-500">View Canceled Order</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
        </div>
      </div>

      {/* ===== CONTACT DETAILS ===== */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
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

      {/* ===== REUSABLE COMPONENT ===== */}
      <div className={`relative ${orderStatus === "canceled" ? "pb-[60px] bg-white rounded-lg" : "pb-0"}`}>
        <OrderSummary
          orderData={orderData}
          orderStatus={orderStatus}
          statusConfig={statusConfig}
          
        />

        {/* ✅ Refund Button for canceled orders */}
        {orderStatus === "canceled" && (
          <div className="absolute bottom-3 right-6">
            <button
              onClick={handleRefundToggle}
              className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${
                isRefunded
                  ? "bg-[#F5F5F5] text-[#AEAEAE]"
                  : "bg-[#C9A040] text-black hover:opacity-90"
              }`}
            >
              {isRefunded ? "Refunded" : "Refund"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetailsPage;
