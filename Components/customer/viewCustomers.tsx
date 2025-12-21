"use client";
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import OrderSummary from "@/Components/order/OrderSummary";
import Link from "next/link";
import { useCustomerStore } from '@/app/store/useCustomerStore';
import { useParams, useRouter, useSearchParams } from "next/navigation"; // Add useSearchParams

// Types (keep your existing types)
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

interface Brand {
  _id: string;
  name: string;
}

interface Product {
  _id: string;
  name: string;
  image?: string;
  images?: string;
  brandId: Brand;
}

interface CartItem {
  _id: string;
  productId: Product;
  quantity: number;
  unitPrice: number;
  total: number;
  // Legacy fields (might not be used)
  image?: string;
  brand?: string;
  product?: string;
}

interface ApiOrder {
  _id: string;
  name: string;
  address: string;
  email: string;
  phone: string;
  orderId: string;
  orderid?: string;
  transactionId?:string;
  trackingNo: string;
  state: OrderStatus;
  userId: string;
  isNextUsePayment: boolean;
  carts: CartItem[];
  date: string;
  tax: string;
  subtotal: number;
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
  orderId?: string;
  orderid?: string;
  transactionId?: string;
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
    bg: "bg-[#E8F1FF]",        // soft light blue background
    text: "text-[#1E60D4]",    // medium blue text
    border: "border-blue-200", // light blue border
    dotColor: "bg-[#1E60D4]",
  },
};

const CustomerManagement: React.FC = () => {
  // Get userId from URL params
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnPage = searchParams.get('page') || '1'; // Get the page parameter
  
  const userId = params.di as string;
  
  // State for filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("All Orders");

  const { 
    customerOrders, 
    ordersLoading, 
    ordersError, 
    fetchCustomerOrders,
    userProfile,
    profileLoading,
    profileError,
    fetchUserProfile,
    clearOrders,
    clearProfile
  } = useCustomerStore();

  // Handle back to customers list
  const handleBack = () => {
    router.push(`/pages/customers?page=${returnPage}`);
  };

  useEffect(() => {
    // console.log("🔄 Clearing store data for new user:", userId);
    clearOrders();
    clearProfile();
  }, [userId, clearOrders, clearProfile]);

  // Fetch orders when component mounts
  useEffect(() => {
    if (userId) {
      // console.log("Fetching orders for userId:", userId);
      fetchCustomerOrders(userId);
    }
  }, [userId, fetchCustomerOrders]);

  // Fetch profile if no orders are found
  useEffect(() => {
    if (userId && 
        Array.isArray(customerOrders) && 
        customerOrders.length === 0 && 
        !userProfile && 
        !ordersLoading && 
        !profileLoading) {
      // console.log("No orders found, fetching user profile...");
      fetchUserProfile(userId);
    }
  }, [userId, customerOrders, userProfile, ordersLoading, profileLoading, fetchUserProfile]);

  // CRITICAL FIX: Always ensure we're working with an array
  const safeCustomerOrders: ApiOrder[] = Array.isArray(customerOrders) ? customerOrders : [];

  // Get contact details from first order OR user profile OR use appropriate state
  const getContactDetails = (): ContactDetails => {
    // If we have orders, use the first order's contact info
    if (safeCustomerOrders.length > 0) {
      return {
        name: safeCustomerOrders[0].name,
        email: safeCustomerOrders[0].email,
        phone: safeCustomerOrders[0].phone,
        address: safeCustomerOrders[0].address,
      };
    }
    
    // If we have user profile data, use that
    if (userProfile) {
      return {
        name: userProfile.name || "Not provided",
        email: userProfile.email || "Not provided",
        phone: userProfile.phone || "Not provided",
        address: userProfile.address || "Not provided",
      };
    }
    
    // If we're still loading profile but have no orders
    if (profileLoading) {
      return {
        name: "Loading...",
        email: "Loading...",
        phone: "Loading...",
        address: "Loading...",
      };
    }
    
    // Default fallback
    return {
      name: "No data available",
      email: "No data available",
      phone: "No data available",
      address: "No data available",
    };
  };

  const contactDetails = getContactDetails();

  // Filter orders based on search and status - USING SAFE ARRAY
  const filteredOrders = safeCustomerOrders.filter((order: ApiOrder) => {
    const matchesSearch = order.orderId
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      selectedStatus === "All Orders" ||
      order.state === selectedStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  // Calculate tax amount from tax value (could be string, number, or percentage)
  const calculateTaxAmount = (taxValue: unknown, subTotal: number): number => {
    // Handle different possible tax value types
    if (typeof taxValue === 'string') {
      // If it's a string like "5%" or "5"
      const cleanString = taxValue.replace('%', '');
      const taxPercentage = parseFloat(cleanString) || 0;
      return (subTotal * taxPercentage) / 100;
    } else if (typeof taxValue === 'number') {
      // If it's already a number (could be percentage or fixed amount)
      // Assuming it's a percentage like 5 for 5%
      return (subTotal * taxValue) / 100;
    } else {
      // Fallback for undefined, null, or other types
      return 0;
    }
  };

  // Calculate discount (you can modify this based on your business logic)
  const calculateDiscount = (subTotal: number): number => {
    return subTotal * 0.05;
  };

  // Convert API order to component order format
  const convertToOrderData = (order: ApiOrder): OrderData & { status: OrderStatus } => {
    console.log(order,"256")
    const taxAmount = calculateTaxAmount(order.tax, order.subtotal);
    const discountAmount = calculateDiscount(order.subtotal);

    // Get tax label based on the tax value type
    const getTaxLabel = (taxValue: unknown): string => {
      if (typeof taxValue === 'string') {
        return taxValue.includes('%') ? taxValue : `${taxValue}%`;
      } else if (typeof taxValue === 'number') {
        return `${taxValue}%`;
      } else {
        return "0%";
      }
    };

    return {
      orderid: order.orderid || "",
      transactionId: order.transactionId || "",
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
      items: order.carts.map((cart: CartItem, index: number) => {
        // Extract product details from productId and brandId
        const productName = cart.productId?.name || cart.product || "Product Name";
        const brandName = cart.productId?.brandId?.name || cart.brand || "Brand Name";
        const productImage = cart.productId?.images || cart.image || "/api/placeholder/50/50";
        
        return {
          id: index + 1,
          image: productImage,
          brand: brandName,
          product: productName,
          unitPrice: cart.unitPrice || 0,
          quantity: cart.quantity || 1,
          total: cart.total || 0,
        };
      }),
      tax: { 
        label: getTaxLabel(order.tax), 
        amount: taxAmount
      },
      discount: { 
        label: "5%", 
        amount: discountAmount
      },
      shippingCost: order.shippingCost || 0,
      subTotal: order.subtotal || 0,
      
      payment: { 
        status: order.state === "refunded" ? "Refunded" : 
                order.state === "delivered" ? "Paid" : "Pending", 
        amount: order.total || 0 
      },
    };
  };

  // Show loading state for both orders and profile
  if (ordersLoading || (safeCustomerOrders.length === 0 && profileLoading)) {
    return (
      <div className="min-h-screen ml-8 text-gray-800 flex items-center justify-center">
        <div className="text-lg">Loading customer data...</div>
      </div>
    );
  }

  if (ordersError) {
    return (
      <div className="min-h-screen ml-8 text-gray-800 flex items-center justify-center">
        <div className="text-lg text-red-500">Error loading orders: {ordersError}</div>
        <button
          onClick={handleBack}
          className="mt-4 px-6 py-2 bg-[#C9A040] text-white rounded-lg hover:bg-[#9e7e33] transition"
        >
          Back to Customers
        </button>
      </div>
    );
  }

  if (profileError) {
    console.log("Profile error occurred:", profileError);
  }

  return (
    <div className="min-h-screen ml-8 text-gray-800">
      <div className=" ">
        {/* Breadcrumb Navigation */}
        <div className="bg-white px-8 py-2 pt-4 rounded-lg mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
            <button
              onClick={handleBack}
              className="flex items-center gap-1 hover:text-gray-900"
            >
              <ChevronLeft className="w-4 h-4" />
              Customer Management
            </button>
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

        {/* Orders List - USING FILTERED ORDERS FROM SAFE ARRAY */}
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
              {safeCustomerOrders.length === 0 ? "No orders found for this customer" : "No orders found matching your filters"}
            </p>
            <button
              onClick={handleBack}
              className="mt-4 px-6 py-2 bg-[#C9A040] text-white rounded-lg hover:bg-[#9e7e33] transition"
            >
              Back to Customers
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerManagement;