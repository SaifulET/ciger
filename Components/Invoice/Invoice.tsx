"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import logo from "@/public/logo.svg";
import { useOrderStore, ApiOrder } from '@/app/store/useOrderStore'; // Adjust import path as needed

// Use the real jsPDF type for correct typing (no `any`)
type JsPDFConstructor = typeof import("jspdf").jsPDF;

// Types derived from ApiOrder
interface InvoiceItem {
  id: number;
  product: string;
  unitPrice: number;
  quantity: number;
  price: number;
}

interface InvoiceData {
  orderId: string;
  trackingNo: string;
  placedOn: string;
  companyPhone: string;
  companyEmail: string;
  contact: {
    name: string;
    email: string;
    phone: string;
  };
  deliveryAddress: string;
  items: InvoiceItem[];
  subTotal: number;
  shippingCost: number;
  salesTax: {
    percentage: string;
    amount: number;
  };
  discountCode: {
    percentage: string;
    amount: number;
  };
  total: number;
}

// Helper function to transform ApiOrder to InvoiceData
const transformOrderToInvoiceData = (order: ApiOrder): InvoiceData => {
  // Calculate sales tax percentage
  const taxPercentage = order.subtotal > 0 ? `${((order.tax / order.subtotal) * 100).toFixed(1)}%` : "0%";
  
  // Calculate discount percentage
  const discountPercentage = order.subtotal > 0 ? `${((order.discount / order.subtotal) * 100).toFixed(1)}%` : "0%";
  
  // Transform cart items to invoice items
  const items: InvoiceItem[] = order.carts.map((cartItem, index) => ({
    id: index + 1,
    product: cartItem.productId.name,
    unitPrice: cartItem.productId.price,
    quantity: cartItem.quantity,
    price: cartItem.total
  }));

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return {
    orderId: order.orderId,
    trackingNo: order.trackingNo,
    placedOn: formatDate(order.createdAt),
    companyPhone: "689296744", // Static company info
    companyEmail: "admin@tele-portes.com", // Static company info
    contact: {
      name: order.name,
      email: order.email,
      phone: order.phone
    },
    deliveryAddress: order.address,
    items,
    subTotal: order.subtotal,
    shippingCost: order.shippingCost,
    salesTax: {
      percentage: taxPercentage,
      amount: order.tax
    },
    discountCode: {
      percentage: discountPercentage,
      amount: order.discount
    },
    total: order.total
  };
};

const InvoicePage: React.FC = () => {
  const router = useRouter();
  const { 
    currentOrder, 
    orderLoading, 
    orderError, 
    fetchOrderById,
    clearCurrentOrder 
  } = useOrderStore();

  // useParams returns a record of route params in app router - be defensive with typing
  const params = useParams() as Record<string, string | string[] | undefined> | undefined;

  // Resolve an `id` param
  const resolvedId: string =
    typeof params?.id === "string"
      ? params.id
      : Array.isArray(params?.id)
      ? params.id[0] ?? ""
      : "";

  // Fetch order data when component mounts or id changes
  useEffect(() => {
    if (resolvedId) {
      fetchOrderById(resolvedId);
    }
  }, [resolvedId, fetchOrderById]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      clearCurrentOrder();
    };
  }, [clearCurrentOrder]);

  useEffect(() => {
    // Only proceed if we have order data and no loading/error
    if (!currentOrder || orderLoading || orderError) return;

    let cancelled = false;

    (async () => {
      try {
        // Transform API data to invoice format
        const invoiceData = transformOrderToInvoiceData(currentOrder);

        // Dynamically import jspdf on client only (keeps bundle small until needed)
        const mod = await import("jspdf");
        const jsPDFCtor = mod.jsPDF as JsPDFConstructor;

        if (cancelled) return;

        // Generate and save PDF
        const doc = new jsPDFCtor();
        const pageWidth = doc.internal.pageSize.width;
        const margin = 20;

        // ---------------- Header ----------------
        let yPos = 20;
        doc.setFontSize(24);
        doc.setFont("helvetica", "bold");
        doc.text("SMOKENZA", margin, yPos);

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(invoiceData.companyPhone, pageWidth - margin, yPos, { align: "right" });
        doc.text(invoiceData.companyEmail, pageWidth - margin, yPos + 5, { align: "right" });

        // ---------------- Details Section (Rounded) ----------------
        yPos += 25;
        const detailsHeight = 40;
        try {
          doc.setDrawColor(229, 231, 235);
          (doc as unknown as { roundedRect?: (...args: unknown[]) => void }).roundedRect?.(
            margin,
            yPos,
            pageWidth - 2 * margin,
            detailsHeight,
            3,
            3,
            "S"
          );
        } catch {
          doc.rect(margin, yPos, pageWidth - 2 * margin, detailsHeight, "S");
        }

        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Details", margin + 5, yPos + 10);

        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text(`Order ID: ${invoiceData.orderId}`, pageWidth - margin - 50, yPos + 10);
        doc.setFont("helvetica", "normal");
        doc.text(`Tracking No: ${invoiceData.trackingNo}`, margin + 5, yPos + 20);
        doc.text(`Placed on ${invoiceData.placedOn}`, pageWidth - margin - 50, yPos + 20);

        // ---------------- Contact Details (Rounded Table) ----------------
        const contactY = yPos + detailsHeight + 5;
        const contactHeight = 20;
        try {
          (doc as unknown as { roundedRect?: (...args: unknown[]) => void }).roundedRect?.(
            margin,
            contactY,
            pageWidth - 2 * margin,
            contactHeight,
            3,
            3,
            "S"
          );
        } catch {
          doc.rect(margin, contactY, pageWidth - 2 * margin, contactHeight, "S");
        }

        doc.setFont("helvetica", "bold");
        doc.text("Contact Details", margin + 5, contactY + 7);

        doc.setFontSize(8);
        doc.setTextColor(107, 114, 128);
        doc.text("Name", margin + 5, contactY + 12);
        doc.text("Email", margin + 65, contactY + 12);
        doc.text("Phone Number", margin + 125, contactY + 12);

        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.setFont("helvetica", "normal");
        doc.text(invoiceData.contact.name, margin + 5, contactY + 17);
        doc.text(invoiceData.contact.email, margin + 65, contactY + 17);
        doc.text(invoiceData.contact.phone, margin + 125, contactY + 17);

        // ---------------- Delivery Address (Rounded) ----------------
        const addressY = contactY + contactHeight + 5;
        const addressLines = doc.splitTextToSize(invoiceData.deliveryAddress, pageWidth - 2 * margin - 10);
        const addressHeight = 15 + addressLines.length * 5;
        try {
          (doc as unknown as { roundedRect?: (...args: unknown[]) => void }).roundedRect?.(
            margin,
            addressY,
            pageWidth - 2 * margin,
            addressHeight,
            3,
            3,
            "S"
          );
        } catch {
          doc.rect(margin, addressY, pageWidth - 2 * margin, addressHeight, "S");
        }

        doc.setFont("helvetica", "bold");
        doc.text("Delivery Address", margin + 5, addressY + 7);

        doc.setFontSize(8);
        doc.setTextColor(107, 114, 128);
        doc.text("Address", margin + 5, addressY + 12);

        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.setFont("helvetica", "normal");
        doc.text(addressLines, margin + 5, addressY + 17);

        // ---------------- Order Summary (Rounded Table) ----------------
        const summaryY = addressY + addressHeight + 5;
        const tableHeaderHeight = 8;
        const rowHeight = 6;
        const summaryHeight = tableHeaderHeight + invoiceData.items.length * rowHeight + 35; // includes totals
        try {
          (doc as unknown as { roundedRect?: (...args: unknown[]) => void }).roundedRect?.(
            margin,
            summaryY,
            pageWidth - 2 * margin,
            summaryHeight,
            3,
            3,
            "S"
          );
        } catch {
          doc.rect(margin, summaryY, pageWidth - 2 * margin, summaryHeight, "S");
        }

        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Order Summary", margin + 5, summaryY + 10);

        const tableY = summaryY + 15;
        doc.setFontSize(9);
        doc.setTextColor(107, 114, 128);
        doc.setFont("helvetica", "bold");
        doc.text("Product", margin + 2, tableY + 6);
        doc.text("Unit Price", pageWidth - margin - 90, tableY + 6, { align: "right" });
        doc.text("Quantity", pageWidth - margin - 50, tableY + 6, { align: "right" });
        doc.text("Price", pageWidth - margin - 3, tableY + 6, { align: "right" });

        let rowY = tableY + 12;
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0, 0, 0);

        invoiceData.items.forEach((item) => {
          const productLines = doc.splitTextToSize(item.product, 80);
          doc.text(productLines, margin + 2, rowY);
          doc.text(`$${item.unitPrice.toFixed(2)}`, pageWidth - margin - 90, rowY, { align: "right" });
          doc.text(item.quantity.toString(), pageWidth - margin - 50, rowY, { align: "right" });
          doc.text(`$${item.price.toFixed(2)}`, pageWidth - margin - 3, rowY, { align: "right" });
          rowY += productLines.length * 5 + 6;
        });

        // Totals
        rowY += 8;
        const labelX = margin + 3;
        const priceX = pageWidth - margin - 3;

        const addTotalRow = (label: string, value: string, isBold = false) => {
          doc.setFont("helvetica", isBold ? "bold" : "normal");
          doc.text(label, labelX, rowY);
          doc.text(value, priceX, rowY, { align: "right" });
          rowY += 7;
        };

        addTotalRow("Sub Total", `$${invoiceData.subTotal.toFixed(2)}`);
        addTotalRow("Shipping Cost", `$${invoiceData.shippingCost.toFixed(2)}`);
        addTotalRow(`Sales Tax (${invoiceData.salesTax.amount}%)`, `$${((invoiceData.salesTax.amount/100)*invoiceData.subTotal).toFixed(2)}`);
        addTotalRow(`Discount CODE (${invoiceData.discountCode.amount}%)`, `$${((invoiceData.discountCode.amount/100)*invoiceData.subTotal).toFixed(2)}`);
        addTotalRow("Total", `$${invoiceData.total.toFixed(2)}`, true);

        // ---------------- Big Rounded Border for Details + Contact + Delivery + Summary + Totals ----------------
        const bigBorderY = 20 - 2; // original yPos start was 20
        const bigBorderHeight = rowY - 20 + 2; // cover till totals
        doc.setDrawColor(200, 200, 200);
        try {
          (doc as unknown as { roundedRect?: (...args: unknown[]) => void }).roundedRect?.(
            margin - 2,
            bigBorderY,
            pageWidth - 2 * margin + 4,
            bigBorderHeight,
            5,
            5,
            "S"
          );
        } catch {
          doc.rect(margin - 2, bigBorderY, pageWidth - 2 * margin + 4, bigBorderHeight, "S");
        }

        // Save the PDF
        doc.save(`invoice-${invoiceData.orderId}.pdf`);

        // Redirect once PDF has been saved/generated
        setTimeout(() => {
          const destination = `/pages/order/viewOrder/${resolvedId}`;
          router.push(destination);
        }, 50);
      } catch (err) {
        console.error("Failed to generate invoice PDF:", err);
        // still attempt to navigate even if PDF generation fails
        router.push(`/pages/order/viewOrder/${resolvedId}`);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [currentOrder, orderLoading, orderError, resolvedId, router]);

  // Show loading state
  if (orderLoading) {
    return (
      <div className="min-h-screen bg-white p-8 max-w-4xl mx-auto flex items-center justify-center text-gray-800">
        <div className="text-center">
          <div className="text-lg font-semibold mb-4">Loading order data...</div>
          <div className="text-gray-500">Preparing your invoice</div>
        </div>
      </div>
    );
  }

  // Show error state
  if (orderError) {
    return (
      <div className="min-h-screen bg-white p-8 max-w-4xl mx-auto flex items-center justify-center">
        <div className="text-center text-red-600">
          <div className="text-lg font-semibold mb-4">Error loading order</div>
          <div className="mb-4">{orderError}</div>
          <button 
            onClick={() => router.push(`/pages/order/viewOrder/${resolvedId}`)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Order
          </button>
        </div>
      </div>
    );
  }

  // Show invoice preview while generating PDF (only shown briefly)
  const invoiceData = currentOrder ? transformOrderToInvoiceData(currentOrder) : null;

  if (!invoiceData) {
    return null;
  }
  console.log(invoiceData,"398")

  return (
    <div className="min-h-screen bg-white p-8 max-w-4xl mx-auto text-gray-800">
      {/* Header */}
      <div className="flex justify-between items-start mb-12">
        <div className="">
          <Image src={logo} alt="logo" width={150} height={150} />
        </div>
        <div />
        <div className="text-right text-sm">
          <div>{invoiceData.companyPhone}</div>
          <div>{invoiceData.companyEmail}</div>
        </div>
      </div>

      {/* Details Section */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Details</h2>
        <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
          {/* Order Info */}
          <div className="flex justify-between mb-4">
            <div>
              <span className="font-semibold">Order ID:</span> {invoiceData.orderId}
            </div>
            <div>
              <span className="font-semibold">Placed on</span> {invoiceData.placedOn}
            </div>
          </div>

          <div className="mb-6">
            <span className="font-semibold">Tracking No:</span> {invoiceData.trackingNo}
          </div>

          {/* Contact Details */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Contact Details</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-gray-500 mb-1">Name</div>
                <div className="text-sm">{invoiceData.contact.name}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Email</div>
                <div className="text-sm">{invoiceData.contact.email}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Phone Number</div>
                <div className="text-sm">{invoiceData.contact.phone}</div>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div>
            <h3 className="font-semibold mb-3">Delivery Address</h3>
            <div className="border border-gray-200 rounded-lg p-4 bg-white">
              <div className="text-xs text-gray-500 mb-1">Address</div>
              <div className="text-sm">{invoiceData.deliveryAddress}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div>
        <h2 className="text-lg font-semibold mb-4 mt-20">Order Summary</h2>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Product</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-gray-500">Unit Price</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-gray-500">Quantity</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-gray-500">Price</th>
              </tr>
            </thead>
            <tbody>
              {invoiceData.items.map((item) => (
                <tr key={item.id} className="border-t border-gray-100">
                  <td className="py-3 px-4 text-sm">{item.product}</td>
                  <td className="text-right py-3 px-4 text-sm">${item.unitPrice.toFixed(2)}</td>
                  <td className="text-right py-3 px-4 text-sm">{item.quantity}</td>
                  <td className="text-right py-3 px-4 text-sm">${item.price.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <div className="flex justify-between text-sm py-2">
              <span>Sub Total</span>
              <span className="font-semibold">${invoiceData.subTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm py-2">
              <span>Shipping Cost</span>
              <span>${invoiceData.shippingCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm py-2">
              <span>Sales Tax</span>
              <div className="flex gap-8">
                <span className="text-gray-500">{invoiceData.salesTax.amount}%</span>
                <span>${((invoiceData.salesTax.amount/100)*(invoiceData.subTotal)).toFixed(2)}</span>
              </div>
            </div>
            <div className="flex justify-between text-sm py-2">
              <span>Discount CODE</span>
              <div className="flex gap-8">
                <span className="text-gray-500">{invoiceData.discountCode.amount}%</span>
                <span>${((invoiceData.discountCode.amount/100)*invoiceData.subTotal).toFixed(2)}</span>
              </div>
            </div>
            <div className="flex justify-between text-base font-bold py-2 border-t border-gray-300 mt-2 pt-3">
              <span>Total</span>
              <span>${invoiceData.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Loading indicator */}
      <div className="text-center mt-8 text-gray-500 text-sm">Generating invoice and redirecting...</div>
    </div>
  );
};

export default InvoicePage;