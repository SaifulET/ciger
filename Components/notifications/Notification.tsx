"use client";

import api from "@/lib/axios";
import { DeliveryTruck01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Clock, Check, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
type Notification = {
  id: string;
  userId: string;
  userName: string;
  message: string;
  orderId?: string;
  orderid?: string;
  timestamp: string; // API provides formatted timestamp
  status: "placed" | "delivered" | "cancelled" | "shipped";
};

// 🕓 Helper — format “x minutes ago” for real-time updates
const formatTimeAgo = (timestamp: string) => {
  // If the API already provides formatted time like "10 days ago", 
  // we can use it directly, or parse if needed
  return timestamp;
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
const router = useRouter()


  // 🎯 Fetch notifications from backend API
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get("/notification/getAllNotifications");
     console.log('45',response.data,"38")
      if (!response.data) {
        // router.push("/auth/signin")
        throw new Error(`Failed to fetch notifications: ${response.status}`);
        
      }
      
      const result = await response.data;
      
      if (result.success && Array.isArray(result.data)) {
        setNotifications(result.data);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {

      setError(err instanceof Error ? err.message : "Failed to load notifications");
      //  router.push("/auth/signin")
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  // 📥 Load notifications on component mount
  useEffect(() => {
    
    fetchNotifications();
    console.log("hellow")
  }, []);

  // Refresh data every minute to stay updated
  useEffect(() => {
    const interval = setInterval(() => {
      fetchNotifications();
    }, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const getIcon = (status: Notification["status"]) => {
    switch (status) {
      case "delivered":
        return (
          <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
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

  if (loading) {
    return (
      <div className="p-6 ml-10 rounded-lg bg-white min-h-screen text-[#212121]">
        <h1 className="text-2xl font-semibold mb-6">Notifications</h1>
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-500">Loading notifications...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 ml-10 rounded-lg bg-white min-h-screen text-[#212121]">
        <h1 className="text-2xl font-semibold mb-6">Notifications</h1>
        <div className="flex flex-col items-center justify-center py-8">
          <div className="text-red-500 mb-4">Error: {error}</div>
          <button
            onClick={fetchNotifications}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 ml-10 rounded-lg bg-white min-h-screen text-[#212121]">
      <h1 className="text-2xl font-semibold mb-6">Notifications</h1>

      {notifications.length === 0 ? (
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-500">No notifications found</div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {notifications.map((notif) => (
            
            <div
              key={notif.id}
              className="flex items-start gap-4 border border-gray-200 rounded-lg p-4 hover:shadow-sm transition"
            >
              {/* Icon */}
              {getIcon(notif.status)}

              {/* Text */}
              <div className="flex flex-col">
                <p className="font-semibold text-sm md:text-base">
                  {notif.userName}s {notif.message}
                </p>
                {notif.orderid && (
                  <p className="text-gray-500 text-sm mt-1">
                    Order ID: {notif.orderid}
                  </p>
                )}
                <p className="text-gray-400 text-xs mt-1">
                  {formatTimeAgo(notif.timestamp)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}