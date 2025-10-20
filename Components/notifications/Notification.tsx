"use client";

import { DeliveryTruck01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Clock, Check, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";

type Notification = {
  id: string;
  
  user: string;
  message: string;
  orderId: string;
  createdAt: Date; // store timestamp
  type: "placed" | "delivered" | "cancelled" |"shipped";
};

// 🕓 Helper — format “x minutes ago”
const formatTimeAgo = (date: Date) => {
  const now = new Date().getTime();
  const diff = Math.floor((now - date.getTime()) / 1000); // in seconds

  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  if (diff < 172800) return "yesterday";
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function NotificationsPage() {
  // 🧩 Notification Data (no more manual “10 min ago”)
  const [orderStatus, setOrderStatus] = useState<Notification[]>([
   {
    id: "1",
    user: "John Doe",
    message: "Order has been placed",
    orderId: "TP-123",
    createdAt: new Date(Date.now() - 5 * 60 * 1000), // 5 min ago
    type: "placed",
  },
  {
    id: "2",
    user: "John Doe",
    message: "Order has been delivered",
    orderId: "TP-123",
    createdAt: new Date(Date.now() - 10 * 60 * 1000), // 10 min ago
    type: "delivered",
  },
  {
    id: "3",
    user: "John Doe",
    message: "Order has been shipped",
    orderId: "TP-123",
    createdAt: new Date(Date.now() - 20 * 60 * 1000), // 20 min ago
    type: "shipped",
  },
  {
    id: "4",
    user: "John Doe",
    message: "Order has been cancelled",
    orderId: "TP-123",
    createdAt: new Date(Date.now() - 40 * 60 * 1000), // 40 min ago
    type: "cancelled",
  },
  {
    id: "5",
    user: "John Doe",
    message: "Refund request is being processed",
    orderId: "TP-123",
    createdAt: new Date(Date.now() - 60 * 60 * 1000), // 1 hr ago
    type: "shipped", // (If you want a new type like "refund_processing", tell me)
  },
  {
    id: "6",
    user: "John Doe",
    message: "Oefund has been processed",
    orderId: "TP-123",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hr ago
    type: "delivered", // (Same here, can rename to "refund_done")
  }
  ]);

  // Refresh time every minute to stay accurate
  const [, forceUpdate] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => forceUpdate((n) => n + 1), 60000);
    return () => clearInterval(interval);
  }, []);

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "delivered":
        return (
          <div className=" w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
            <Check className="w-4 h-4 text-white" />
          </div>
        );
      case "cancelled":
        return (
          <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center">
            <AlertCircle className="w-4 h-4 text-white" />
          </div>
        );
        case "shipped":
            return (
          <div className="w-8 h-8 rounded-full bg-yellow-600 flex items-center justify-center">
            <HugeiconsIcon icon={DeliveryTruck01Icon} className="w-4 h-4 text-white" />
          </div>
        );
      case "placed":
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-yellow-600 flex items-center justify-center">
            <Clock className="w-4 h-4 text-white" />
          </div>
        );
    }
  };

  return (
    <div className="p-6 ml-10 rounded-lg bg-white min-h-screen text-[#212121]">
      <h1 className="text-2xl font-semibold mb-6">Notifications</h1>

      <div className="flex flex-col gap-4">
        {orderStatus.map((notif) => (
          <div
            key={notif.id}
            className="flex items-start gap-4 border border-gray-200 rounded-lg p-4 hover:shadow-sm transition"
          >
            {/* Icon */}
            {getIcon(notif.type)}

            {/* Text */}
            <div className="flex flex-col">
              <p className="font-semibold text-sm md:text-base">
                 
                {notif.message && ` ${notif.message}`}
              </p>
              <p className="text-gray-500 text-sm mt-1">
                Order ID: {notif.orderId}
              </p>
              <p className="text-gray-400 text-xs mt-1">
                {formatTimeAgo(notif.createdAt)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}