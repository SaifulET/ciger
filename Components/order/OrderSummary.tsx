"use client";
import React from "react";
import { Check } from "lucide-react";

// Type definitions
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
  items: OrderItem[];
  tax: { label: string; amount: number };
  discount: { label: string; amount: number };
  shippingCost: number;
  subTotal: number;
  payment: { status: string; amount: number };
}

type OrderStatus = "canceled" | "delivered" | "shipped" | "processing";

interface StatusConfig {
  bg: string;
  text: string;
  border: string;
  dotColor: string;
}

interface Props {
  orderData: OrderData;
  orderStatus: OrderStatus;
  statusConfig: Record<OrderStatus, StatusConfig>;
  onDownload?: () => void;
  
}

const OrderSummary: React.FC<Props> = ({
  orderData,
  orderStatus,
  statusConfig,
  onDownload,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* 🧾 Order Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h2 className="font-semibold text-[28px] leading-[36px] tracking-[0]">
            Order #{orderData.orderId}
          </h2>
          <p className="font-normal text-[16px] leading-[24px] tracking-[0] text-gray-500">
            Placed on {orderData.placedOn}
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-col items-start md:items-end gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig[orderStatus].bg} ${statusConfig[orderStatus].text} border ${statusConfig[orderStatus].border} capitalize flex items-center gap-2`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${statusConfig[orderStatus].dotColor}`}
            ></span>
            {orderStatus === "canceled" ? "Canceled " : orderStatus}
          </span>
          <p className="font-semibold text-[16px] leading-[24px] tracking-[0] text-gray-900">
            Tracking no: {orderData.trackingNo}
          </p>
        </div>
      </div>

      {/* 🧺 Order Items Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 text-xs font-medium text-gray-500">
                Image
              </th>
              <th className="text-left py-3 text-xs font-medium text-gray-500">
                Product
              </th>
              <th className="text-right py-3 text-xs font-medium text-gray-500">
                Unit Price
              </th>
              <th className="text-right py-3 text-xs font-medium text-gray-500">
                Quantity
              </th>
              <th className="text-right py-3 text-xs font-medium text-gray-500">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {orderData.items.map((item) => (
              <tr key={item.id} className="border-b border-gray-100">
                <td className="py-4">
                  <img
                    src={item.image}
                    alt={item.product}
                    className="w-12 h-12 rounded object-cover"
                  />
                </td>
                <td className="py-4">
                  <p className=" text-[16px] leading-[24px] tracking-[0] font-medium text-gray-900">
                    {item.brand}
                  </p>
                  <p className="font-semibold text-[16px] leading-[24px] tracking-[0] text-gray-500">
                    {item.product}
                  </p>
                </td>
                <td className="text-right py-4 font-semibold text-[16px] leading-[24px] tracking-[0] text-gray-900">
                  ${item.unitPrice.toFixed(2)}
                </td>
                <td className="text-right py-4 font-semibold text-[16px] leading-[24px] tracking-[0] text-gray-900">
                  {item.quantity}
                </td>
                <td className="text-right py-4 font-semibold text-[16px] leading-[24px] tracking-[0] text-gray-900">
                  ${item.total.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 💰 Totals */}
      <div className="mt-6 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-semibold text-[16px] leading-[24px] tracking-[0] text-gray-700">
            Tax
          </span>
          <div className="flex gap-8">
            <span className="text-gray-500 font-semibold text-[16px] leading-[24px] tracking-[0] ">
              {orderData.tax.label}
            </span>
            <span className="text-gray-900 w-20 text-right font-semibold text-[16px] leading-[24px] tracking-[0]">
              ${orderData.tax.amount.toFixed(2)}
            </span>
          </div>
        </div>
        <div className="flex justify-between text-sm">
          <span className="font-semibold text-[16px] leading-[24px] tracking-[0] text-gray-700">
            Discount
          </span>
          <div className="flex gap-8">
            <span className="text-gray-500 font-semibold text-[16px] leading-[24px] tracking-[0]">
              {orderData.discount.label}
            </span>
            <span className="text-gray-900 w-20 text-right font-semibold text-[16px] leading-[24px] tracking-[0]">
              ${orderData.discount.amount.toFixed(2)}
            </span>
          </div>
        </div>
        <div className="flex justify-between text-sm">
          <span className="font-semibold text-[16px] leading-[24px] tracking-[0] text-gray-700">
            Shipping Cost
          </span>
          <span className="text-gray-900 w-20 text-right font-semibold text-[16px] leading-[24px] tracking-[0]">
            ${orderData.shippingCost.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between text-sm font-medium pt-2">
          <span className="font-semibold text-[16px] leading-[24px] tracking-[0] text-gray-700">
            Sub Total
          </span>
          <span className="text-gray-900 w-20 text-right font-semibold text-[16px] leading-[24px] tracking-[0]">
            ${orderData.subTotal.toFixed(2)}
          </span>
        </div>
      </div>

      {/* 💳 Payment Section */}
      <div className="mt-6 pt-8 ">
        <div className="bg-[#F5F5F5] rounded-lg p-8">
          <h3 className="text-sm font-semibold mb-3">Payment</h3>
          <div className="bg-white p-4 border border-gray-700 rounded-lg">
            <div className="flex items-center justify-between pb-4">
              <span className="text-sm text-gray-600">{orderData.payment.status}</span>
              <Check className="w-6 h-6 text-white p-1 rounded-full bg-green-500" />
            </div>
            <div className="flex items-center justify-between ">
              <span className="text-sm text-gray-600">Amount</span>
              <span className="text-sm font-medium text-gray-900">
                ${orderData.payment.amount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 📥 Download Button */}
      {onDownload &&(
         <button
        onClick={onDownload}
        className="w-full mt-6 py-3 bg-white border border-gray-300 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
      >
        <span className="text-sm font-medium">Download Invoice</span>
      </button>
      )}
     
    </div>
  );
};

export default OrderSummary;
