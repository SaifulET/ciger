"use client";
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronDown, ChevronUp } from "lucide-react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft02Icon } from "@hugeicons/core-free-icons";
import OrderSummary from "@/Components/order/OrderSummary";
import { useParams, useRouter } from "next/navigation";
import { useOrderStore } from "@/app/store/useOrderStore";
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
  placedOn: string;
  contact: ContactDetails;
  items: OrderItem[];
  tax: { label: string; amount: number };
  discount: { label: string; amount: number };
  shippingCost: number;
  subTotal: number;
  payment: { status: string; amount: number };
}

// ================= PAGE COMPONENT =================
const OrderDetailsPage: React.FC = () => {
  const [orderStatus, setOrderStatus] = useState<OrderStatus>("processing");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");

  const params = useParams();
  const orderId = params.id as string;
  const router = useRouter();

  const { 
    currentOrder, 
    orderLoading, 
    orderError, 
    updateLoading,
    updateError,
    fetchOrderById, 
    updateOrder 
  } = useOrderStore();

  useEffect(() => {
    if (orderId) {
      fetchOrderById(orderId);
    }
  }, [orderId, fetchOrderById]);

  useEffect(() => {
    if (currentOrder) {
      setOrderStatus(currentOrder.state as OrderStatus);
      setTrackingNumber(currentOrder.trackingNo || "");
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
  bg: "bg-[#E8F1FF]",        // soft light blue background
  text: "text-[#1E60D4]",    // medium blue text
  border: "border-blue-200", // light blue border
  dotColor: "bg-[#1E60D4]",  // matching blue dot
},
  };

  // Convert API order to OrderSummary format
  const convertToOrderData = (): OrderData => {
    if (!currentOrder) {
      return {
        orderId: "",
        orderid:"",
        trackingNo: "",
        placedOn: "",
        contact: { name: "", email: "", phone: "", address: "" },
        items: [],
        tax: { label: "0%", amount: 0 },
        discount: { label: "0%", amount: 0 },
        shippingCost: 0,
        subTotal: 0,
        payment: { status: "Pending", amount: 0 },
      };
    }

    // Calculate tax amount
    const calculateTaxAmount = (tax: number, subTotal: number): number => {
      return (subTotal * tax) / 100;
    };

    const taxAmount = calculateTaxAmount(currentOrder.tax, currentOrder.subtotal);
    const discountAmount = (currentOrder.subtotal * currentOrder.discount) / 100;

    return {
      orderId: currentOrder._id,
      trackingNo: currentOrder.trackingNo,
      placedOn: currentOrder.date,
      contact: {
        name: currentOrder.name,
        email: currentOrder.email,
        phone: currentOrder.phone,
        address: currentOrder.address,
      },
      items: currentOrder.carts.map((cart, index) => ({
        id: index + 1,
        image: cart.productId.images[0] || "/api/placeholder/50/50",
        brand: cart.productId.brandId.name,
        product: cart.productId.name,
        unitPrice: cart.productId.price,
        quantity: cart.quantity,
        total: cart.total,
      })),
      tax: { 
        label: `${currentOrder.tax}%`, 
        amount: taxAmount 
      },
      discount: { 
        label: `${currentOrder.discount}%`, 
        amount: discountAmount 
      },
      orderid:currentOrder.orderid,
      shippingCost: currentOrder.shippingCost,
      subTotal: currentOrder.subtotal,
      payment: { 
        status: mapPaymentStatus(currentOrder.state), 
        amount: currentOrder.total 
      },
    };
  };

  const mapPaymentStatus = (state: string): string => {
    switch (state) {
      case "delivered": return "Paid";
      case "refunded": return "Refunded";
      case "cancelled": return "Cancelled";
      default: return "Pending";
    }
  };

  const downloadInvoice = () => {
    if (currentOrder) {
      window.location.href = `/invoice/${currentOrder._id}`;
    }
  };

  const handleStatusChange = async (status: OrderStatus) => {
    const statusChange= await api.post("/mail/refundConfirmation", {
          email:currentOrder?.email,
          orderId: currentOrder?.orderid,
          transactionId: currentOrder?.transactionId,
          Amount: currentOrder?.total,
          status:status,
        });
        console.log(currentOrder,statusChange,"185")

    setOrderStatus(status);
    setIsDropdownOpen(false);
    
    if (orderId) {
      await updateOrder(orderId, { state: status });
    }
  };

  const handleTrackingSave = async () => {
    if (orderId && trackingNumber) {
      await updateOrder(orderId, { trackingNo: trackingNumber });
    }
  };

  const navigateToOrders = () => {
    router.push("/pages/order");
  };

  if (orderLoading) {
    return (
      <div className="min-h-screen ml-8 text-gray-800 flex items-center justify-center">
        <div className="text-lg">Loading order details...</div>
      </div>
    );
  }

  if (orderError) {
    return (
      <div className="min-h-screen ml-8 text-gray-800 flex items-center justify-center">
        <div className="text-lg text-red-500">Error: {orderError}</div>
      </div>
    );
  }

  if (!currentOrder) {
    return (
      <div className="min-h-screen ml-8 text-gray-800 flex items-center justify-center">
        <div className="text-lg">Order not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ml-8 text-gray-800">
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
              disabled={updateLoading}
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
              <p className="text-gray-900">{currentOrder.name}</p>
            </div>
            <div>
              <label className="text-gray-500 text-sm font-semibold mb-1 block">
                Email
              </label>
              <p className="text-gray-900">{currentOrder.email}</p>
            </div>
          </div>
          <div className="block md:flex items-center justify-between">
            <div>
              <label className="text-gray-500 text-sm font-semibold mb-1 block">
                Delivery Address
              </label>
              <p className="text-gray-900">{currentOrder.address}</p>
            </div>
            <div>
              <label className="text-gray-500 text-sm font-semibold mb-1 block">
                Phone Number
              </label>
              <p className="text-gray-900">{currentOrder.phone}</p>
            </div>
          </div>
        </div>
      </div>

      {orderStatus === "processing" && (
        <div className="w-full mt-8 space-y-3 flex items-center justify-between px-8 py-4 bg-white rounded-lg mb-8 ">
          {/* Title */}
          <div className="font-semibold text-[40px] leading-[48px] tracking-[0] text-gray-800">
            Tracking Number
          </div>

          {/* Searchbar + Button */}
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              placeholder="Enter tracking number..."
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
            <button
              type="button"
              onClick={handleTrackingSave}
              disabled={updateLoading || !trackingNumber}
              className="px-4 py-2 bg-[#C9A040] text-black rounded-lg hover:bg-[#9e771b] transition-all font-semibold text-[16px] leading-[24px] tracking-[0] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updateLoading ? "Saving..." : "Send & Save"}
            </button>
          </div>
        </div>
      )}

      {/* ===== REUSABLE COMPONENT ===== */}
      <OrderSummary
        orderData={convertToOrderData()}
        orderStatus={orderStatus}
        statusConfig={statusConfig}
        onDownload={downloadInvoice}
      />

      {/* Error Display */}
      {updateError && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">Update Error: {updateError}</p>
        </div>
      )}
    </div>
  );
};

export default OrderDetailsPage;