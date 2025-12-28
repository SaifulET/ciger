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
  orderid?: string;
  trackingNo: string;
  transactionId?: string;
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
  const [isRefunding, setIsRefunding] = useState(false);
  const [refundError, setRefundError] = useState<string | null>(null);
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
      // Update orderStatus based on currentOrder state
      const statusMap: Record<string, OrderStatus> = {
        'cancelled': 'cancelled',
        'refunded': 'refunded',
        'delivered': 'delivered',
        'shipped': 'shipped',
        'processing': 'processing'
      };

      const status = statusMap[currentOrder.state] || 'processing';
      setOrderStatus(status);

      const transformedData: OrderData = {
        orderId: currentOrder._id,
        orderid: currentOrder.orderid,
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
        refund: currentOrder.state === 'refunded',
        total: currentOrder.total,
        transactionId: currentOrder.transactionId
      };

      setOrderData(transformedData);
      setRefundError(null); // Reset error when order data changes
    }
  }, [currentOrder]);

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
      bg: "bg-[#EAFAF3]",
      text: "text-[#29BB7D]",
      border: "border-green-200",
      dotColor: "bg-[#29BB7D]",
    },
  };

  const navigateToOrders = () => {
    router.push("/pages/refunds");
  };

  const id = orderId;

  const handleRefundToggle = async () => {
    // Prevent refund if already refunded
    if (orderStatus === 'refunded') {
      setRefundError('This order has already been refunded.');
      return;
    }

    if (!orderData?.transactionId) {
      setRefundError('Transaction ID is required for refund.');
      return;
    }

    setIsRefunding(true);
    setRefundError(null);

    try {
      console.log('Starting refund process...');
      
      // Step 1: Process payment refund
      console.log('Calling payment refund API...');
      const refundResponse = await api.post("/payment/refund", {
        transactionId: orderData.transactionId,
        amount: orderData.total
      });

      
      if (!refundResponse.data.success) {
        throw new Error(refundResponse.data.error || 'Payment refund failed');
      }

      // Step 2: Update order status to refunded
      console.log('Updating order status to refunded...');
      const updateResponse = await api.put(`/order/updateOrderById/${id}`, {
        state: "refunded"
      });


      if (updateResponse.data.success) {
        // Step 3: Send refund confirmation email
        console.log('Sending refund confirmation email...');
        try {
          const refundMail = await api.post("/mail/refundConfirmation", {
            email: orderData.contact.email,
            orderId: orderData.orderid,
            transactionId: orderData.transactionId,
            Amount: orderData.total,
            status: "refunded"
          });
        } catch (emailError) {
          console.warn('Email sending failed (proceeding anyway):', emailError);
          // Continue even if email fails
        }

        // Update local state
        setOrderStatus("refunded");
        if (orderData) {
          setOrderData({
            ...orderData,
            refund: true
          });
        }

        // Refresh order data
        await fetchOrderById(orderId);
        
        // Show success message
      } else {
        throw new Error('Failed to update order status');
      }
    } catch (error: unknown) {
  console.error('Refund error:', error);
  
  // Type assertion - tell TypeScript what shape the error has
  const err = error as {
    response?: {
      data?: {
        details?: string;
        error?: string;
        message?: string;
      };
    };
    message?: string;
  };
  
  setRefundError(
    err.response?.data?.details || 
    err.response?.data?.error || 
    err.response?.data?.message || 
    err.message || 
    'Refund failed. Please try again.'
  );
}
      
      // Don't update state if refund failed
     
     finally {
      setIsRefunding(false);
    }
  };

  // Loading state
  if (orderLoading || !orderData) {
    return (
      <div className="min-h-screen ml-8 flex items-center justify-center text-gray-800">
        <div className="text-center">
          <div className="text-lg font-semibold mb-4">Loading order details...</div>
          <div className="text-gray-500">Fetching order information</div>
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
            <span className="text-sm text-gray-500">View Order</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
          {orderStatus === 'refunded' && (
            <div className={`px-4 py-2 rounded-lg ${statusConfig.refunded.bg} ${statusConfig.refunded.text} border ${statusConfig.refunded.border}`}>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${statusConfig.refunded.dotColor}`}></div>
                <span className="font-medium">Refunded</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ===== REFUND ERROR ===== */}
      {refundError && (
        <div className="mb-4 mx-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>{refundError}</span>
          </div>
        </div>
      )}

      {/* ===== CONTACT DETAILS ===== */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-4 mx-6">
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
      <div className={`relative mx-6 ${orderStatus === "cancelled" ? "pb-[60px] bg-white rounded-lg" : "pb-0"}`}>
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
              disabled={isRefunding}
              className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${
                isRefunding
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[#C9A040] text-black hover:opacity-90"
              }`}
            >
              {isRefunding ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : "Refund"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetailsPage;