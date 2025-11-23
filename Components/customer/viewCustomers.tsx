"use client";
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import OrderSummary from "@/Components/order/OrderSummary";
import Link from "next/link";
import { useCustomerStore } from '@/app/store/useCustomerStore';
import { useParams } from "next/navigation";

// Types
type OrderStatus = "cancelled" | "delivered" | "shipped" | "processing" | "refunded";

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

interface CartItem {
  _id: string;
  image: string;
  brand: string;
  product: string;
  unitPrice: number;
  quantity: number;
  total: number;
}

interface ApiOrder {
  _id: string;
  name: string;
  address: string;
  email: string;
  phone: string;
  orderId: string;
  trackingNo: string;
  state: OrderStatus;
  userId: string;
  isNextUsePayment: boolean;
  carts: CartItem[];
  date: string;
  tax: string;
  subTotal: number;
  total: number;
  shippingCost: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
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

// Status Configuration
const statusConfig: Record<OrderStatus, StatusConfig> = {
  cancelled: {
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
  refunded: {
    bg: "bg-[#FCEAEA]",
    text: "text-[#DD2C2C]",
    border: "border-red-200",
    dotColor: "bg-[#DD2C2C]",
  },
};

const CustomerManagement: React.FC = () => {
  // Get userId from URL params
  const params = useParams();
  console.log(params)
  const userId = params.di as string;
  console.log(userId)
  
  // State for filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("All Orders");

  const { customerOrders, ordersLoading, ordersError, fetchCustomerOrders } = useCustomerStore();

  console.log("User ID from params:", userId);

  useEffect(() => {
    if (userId) {
      fetchCustomerOrders(userId);
    }
  }, [userId, fetchCustomerOrders]);

  // Get contact details from first order or use default
  const contactDetails: ContactDetails = customerOrders.length > 0 
    ? {
        name: customerOrders[0].name,
        email: customerOrders[0].email,
        phone: customerOrders[0].phone,
        address: customerOrders[0].address,
      }
    : {
        name: "N/A",
        email: "N/A",
        phone: "N/A",
        address: "N/A",
      };

  // Filter orders based on search and status
  const filteredOrders = customerOrders.filter((order: ApiOrder) => {
    const matchesSearch = order.orderId
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      selectedStatus === "All Orders" ||
      order.state === selectedStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  // Calculate tax amount from percentage string
  const calculateTaxAmount = (taxString: string, subTotal: number): number => {
    const taxPercentage = parseFloat(taxString.replace('%', '')) || 0;
    return (subTotal * taxPercentage) / 100;
  };

  // Calculate discount (you can modify this based on your business logic)
  const calculateDiscount = (subTotal: number): number => {
    // Default 5% discount for example - adjust based on your needs
    return subTotal * 0.05;
  };

  // Convert API order to component order format
  const convertToOrderData = (order: ApiOrder): OrderData & { status: OrderStatus } => {
    const taxAmount = calculateTaxAmount(order.tax, order.subTotal);
    const discountAmount = calculateDiscount(order.subTotal);

    return {
      orderId: order.orderId,
      trackingNo: order.trackingNo,
      placedOn: new Date(order.date).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }),
      status: order.state,
      contact: {
        name: order.name,
        email: order.email,
        phone: order.phone,
        address: order.address,
      },
      items: order.carts.map((cart: CartItem, index: number) => ({
        id: index + 1,
        image: cart.image || "/api/placeholder/50/50",
        brand: cart.brand || "Brand Name",
        product: cart.product || "Product Name",
        unitPrice: cart.unitPrice || 0,
        quantity: cart.quantity || 1,
        total: cart.total || 0,
      })),
      tax: { 
        label: order.tax || "0%", 
        amount: taxAmount
      },
      discount: { 
        label: "5%", 
        amount: discountAmount
      },
      shippingCost: order.shippingCost || 0,
      subTotal: order.subTotal || 0,
      payment: { 
        status: order.state === "refunded" ? "Refunded" : 
                order.state === "delivered" ? "Paid" : "Pending", 
        amount: order.total || 0 
      },
    };
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
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E6D3A7] bg-[#F5F5F5] capitalize"
            >
              <option>All Orders</option>
              <option>Processing</option>
              <option>Delivered</option>
              <option>Cancelled</option>
              <option>Shipped</option>
              <option>Refunded</option>
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
              <p className="text-sm text-gray-900">{contactDetails.name}</p>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Email</label>
              <p className="text-sm text-gray-900">{contactDetails.email}</p>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Address</label>
              <p className="text-sm text-gray-900">{contactDetails.address}</p>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Phone Number</label>
              <p className="text-sm text-gray-900">{contactDetails.phone}</p>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order: ApiOrder) => (
            <div key={order._id} className="mb-8">
              <OrderSummary
                orderData={convertToOrderData(order)}
                orderStatus={order.state}
                statusConfig={statusConfig}
              />
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <p className="text-gray-500">
              {customerOrders.length === 0 ? "No orders found for this customer" : "No orders found matching your filters"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerManagement;