"use client";
import React, { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft02Icon } from "@hugeicons/core-free-icons";
import OrderSummary from "@/Components/order/OrderSummary";
import { useOrderStore, ApiOrder } from '@/app/store/useOrderStore';
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";

// ================= TYPES =================
type OrderStatus = "cancelled" | "delivered" | "shipped" | "processing"|"refunded";

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
  refund: boolean;
  total: number;
}

// ================= PAGE COMPONENT =================
const OrderDetailsPage: React.FC = () => {
  const [orderStatus, setOrderStatus] = useState<OrderStatus>("cancelled");
  const [isRefunded, setIsRefunded] = useState(false);
  const [orderData, setOrderData] = useState<OrderData | null>(null);

  const { currentOrder, orderLoading, orderError, fetchOrderById } = useOrderStore();
  const params = useParams();
  const router = useRouter();

  // Get order ID from URL params
  const orderId = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';

  // Fetch order data when component mounts
  useEffect(() => {
    if (orderId) {
      fetchOrderById(orderId);
    }
  }, [orderId, fetchOrderById]);

  // Transform store data to component format
  useEffect(() => {
    if (currentOrder) {
      // Ensure we only show cancelled orders
      if (currentOrder.state !== 'cancelled') {
        router.push('/pages/refunds');
        return;
      }

      const transformedData: OrderData = {
        orderId: currentOrder._id,
        trackingNo: currentOrder.trackingNo,
        placedOn: new Date(currentOrder.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }),
        contact: {
          name: currentOrder.name,
          email: currentOrder.email,
          phone: currentOrder.phone,
          address: currentOrder.address
        },
        items: currentOrder.carts.map((cartItem, index) => ({
          id: index + 1,
          image: cartItem.productId.images?.[0] || "/api/placeholder/50/50",
          brand: cartItem.productId.brandId?.name || "Brand Name",
          product: cartItem.productId.name,
          unitPrice: cartItem.productId.price,
          quantity: cartItem.quantity,
          total: cartItem.total
        })),
        tax: { 
          label: `${((currentOrder.tax / currentOrder.subtotal) * 100).toFixed(1)}%`, 
          amount: currentOrder.tax 
        },
        discount: { 
          label: `${((currentOrder.discount / currentOrder.subtotal) * 100).toFixed(1)}%`, 
          amount: currentOrder.discount 
        },
        shippingCost: currentOrder.shippingCost,
        subTotal: currentOrder.subtotal,
        payment: { 
          status: "Paid", 
          amount: currentOrder.total 
        },
        refund: false,
        total: currentOrder.total
      };

      setOrderData(transformedData);
    }
  }, [currentOrder, router]);

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

  const navigateToOrders = () => {
    router.push("/pages/refunds");
  };
 const param = useParams();
const id = param.id as string;

const handleRefundToggle = async () => {
  setIsRefunded((prev) => !prev);

  const data = {
    state: "refunded",
  };

  try {
    const refunds = await api.put(`/order/updateOrderById/${id}`, data);
    console.log(refunds, "169");
  } catch (error) {
    console.error(error);
  }
};

  // Loading state
  if (orderLoading || !orderData) {
    return (
      <div className="min-h-screen ml-8 flex items-center justify-center text-gray-800">
        <div className="text-center">
          <div className="text-lg font-semibold mb-4">Loading order details...</div>
          <div className="text-gray-500">Fetching cancelled order information</div>
        </div>
      </div>
    );
  }

  // Error state
  if (orderError) {
    return (
      <div className="min-h-screen ml-8 flex items-center justify-center text-gray-800">
        <div className="text-center text-red-600">
          <div className="text-lg font-semibold mb-4">Error loading order</div>
          <div className="mb-4">{orderError}</div>
          <button 
            onClick={() => navigateToOrders()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Refunds
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ml-8 text-gray-800">
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
            <span className="text-sm text-gray-500">View Cancelled Order</span>
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
      <div className={`relative ${orderStatus === "cancelled" ? "pb-[60px] bg-white rounded-lg" : "pb-0"}`}>
        <OrderSummary
          orderData={orderData}
          orderStatus={orderStatus}
          statusConfig={statusConfig}
        />

        {/* ✅ Refund Button for cancelled orders */}
        {orderStatus === "cancelled" && (
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