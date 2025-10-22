"use client";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import OrderSummary from "@/Components/order/OrderSummary"; // Import your existing OrderSummary component
import Link from "next/link";

// Types
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

interface CustomerData {
  contactDetails: ContactDetails;
  orders: Array<OrderData & { status: OrderStatus }>;
}

// ================= SAMPLE DATA =================
const customerData: CustomerData = {
  contactDetails: {
    name: "John Doe",
    email: "example@gmail.com",
    phone: "+8801XXXXXXX",
    address: "43, Moskhali, 1234, Dhaka, Bangladesh",
  },
  orders: [
    {
      orderId: "10234",
      trackingNo: "62862616",
      placedOn: "Sep 22, 2025",
      status: "delivered",
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
        {
          id: 3,
          image: "/api/placeholder/50/50",
          brand: "Brand Name",
          product: "Good Stuff Red Pipe Tobacco - 16 oz. Bag",
          unitPrice: 126.66,
          quantity: 1,
          total: 126.66,
        },
      ],
      tax: { label: "5%", amount: 31.66 },
      discount: { label: "5%", amount: 15.83 },
      shippingCost: 15.0,
      subTotal: 633.3,
      payment: { status: "Paid", amount: 663.13 },
    },
    {
      orderId: "10235",
      trackingNo: "62862617",
      placedOn: "Sep 25, 2025",
      status: "processing",
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
          product: "Premium Quality Tobacco Mix - 8 oz. Pack",
          unitPrice: 89.99,
          quantity: 1,
          total: 89.99,
        },
        {
          id: 2,
          image: "/api/placeholder/50/50",
          brand: "Brand Name",
          product: "Classic Pipe Tobacco - 12 oz. Bag",
          unitPrice: 110.5,
          quantity: 3,
          total: 331.5,
        },
      ],
      tax: { label: "5%", amount: 21.07 },
      discount: { label: "5%", amount: 10.54 },
      shippingCost: 12.0,
      subTotal: 421.49,
      payment: { status: "Pending", amount: 444.02 },
    },
    {
      orderId: "10236",
      trackingNo: "62862618",
      placedOn: "Oct 01, 2025",
      status: "shipped",
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
          product: "Smooth Blend Tobacco - 20 oz. Bag",
          unitPrice: 145.0,
          quantity: 2,
          total: 290.0,
        },
      ],
      tax: { label: "5%", amount: 14.5 },
      discount: { label: "5%", amount: 7.25 },
      shippingCost: 18.0,
      subTotal: 290.0,
      payment: { status: "Paid", amount: 315.25 },
    },
    {
      orderId: "10237",
      trackingNo: "62862619",
      placedOn: "Oct 05, 2025",
      status: "canceled",
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
          product: "Aromatic Tobacco Blend - 10 oz. Pack",
          unitPrice: 95.0,
          quantity: 1,
          total: 95.0,
        },
        {
          id: 2,
          image: "/api/placeholder/50/50",
          brand: "Brand Name",
          product: "Fine Cut Tobacco - 14 oz. Bag",
          unitPrice: 118.75,
          quantity: 2,
          total: 237.5,
        },
      ],
      tax: { label: "5%", amount: 16.63 },
      discount: { label: "5%", amount: 8.31 },
      shippingCost: 10.0,
      subTotal: 332.5,
      payment: { status: "Refunded", amount: 350.82 },
    },
    {
      orderId: "10238",
      trackingNo: "62862620",
      placedOn: "Oct 10, 2025",
      status: "processing",
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
          product: "Royal Blend Pipe Tobacco - 18 oz. Bag",
          unitPrice: 135.0,
          quantity: 4,
          total: 540.0,
        },
      ],
      tax: { label: "5%", amount: 27.0 },
      discount: { label: "5%", amount: 13.5 },
      shippingCost: 20.0,
      subTotal: 540.0,
      payment: { status: "Pending", amount: 573.5 },
    },
  ],
};

// Status Configuration
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

// ================= PAGE COMPONENT =================
const CustomerManagement: React.FC = () => {
  // State for filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("All Orders");

  // Filter orders based on search and status
  const filteredOrders = customerData.orders.filter((order) => {
    const matchesSearch = order.orderId
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      selectedStatus === "All Orders" ||
      order.status === selectedStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen ml-8">
      <div className=" ">
        {/* Breadcrumb Navigation */}
        <div className="bg-white px-8 py-2 pt-4 rounded-lg mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
            <Link href="/pages/customers">
              <button className="flex items-center gap-1 hover:text-gray-900">
                <ChevronLeft className="w-4 h-4" />
                Customer Management
              </button>
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900">View History</span>
          </div>

          {/* Page Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Customer Management
          </h1>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-8">
          <div className="flex gap-4">
            {/* Search by Order ID */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by Order ID"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E6D3A7] bg-[#F5F5F5]"
              />
            </div>

            {/* Filter by Status */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E6D3A7] bg-[#F5F5F5]capitalize"
            >
              <option>All Orders</option>
              <option>Processing</option>
              <option>Delivered</option>
              <option>Canceled</option>
              <option>Shipped</option>
            </select>
          </div>
        </div>

        {/* Contact Details Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Contact Details
          </h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Name</label>
              <p className="text-sm text-gray-900">
                {customerData.contactDetails.name}
              </p>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Email</label>
              <p className="text-sm text-gray-900">
                {customerData.contactDetails.email}
              </p>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">
                Address
              </label>
              <p className="text-sm text-gray-900">
                {customerData.contactDetails.address}
              </p>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">
                Phone Number
              </label>
              <p className="text-sm text-gray-900">
                {customerData.contactDetails.phone}
              </p>
            </div>
          </div>
        </div>

        {/* Orders List - Pass data to your existing OrderSummary component */}
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div key={order.orderId} className="mb-8">
              <OrderSummary
                orderData={order}
                orderStatus={order.status}
                statusConfig={statusConfig}
              />
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <p className="text-gray-500">
              No orders found matching your filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerManagement;
