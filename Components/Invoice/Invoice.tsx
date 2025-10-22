"use client"
import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

// Types
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
  items: Array<{
    id: number;
    product: string;
    unitPrice: number;
    quantity: number;
    price: number;
  }>;
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

// Sample data - Replace with actual data from API or props
const invoiceData: InvoiceData = {
  orderId: "TP-123",
  trackingNo: "TP-123",
  placedOn: "Sep 20, 2025",
  companyPhone: "689296744",
  companyEmail: "admin@tele-portes.com",
  contact: {
    name: "John Doe",
    email: "example@gmail.com",
    phone: "+8801XXXXXXX"
  },
  deliveryAddress: "43, Moskhali 1232, Dhaka, Bangladesh",
  items: [
    {
      id: 1,
      product: "Good Stuff Red Pipe Tobacco ",
      unitPrice: 24.50,
      quantity: 3,
      price: 24.50
    },
    {
      id: 2,
      product: "Good Stuff Red Pipe Tobacco ",
      unitPrice: 24.50,
      quantity: 3,
      price: 24.50
    },
    {
      id: 3,
      product: "Good Stuff Red Pipe Tobacco ",
      unitPrice: 24.50,
      quantity: 3,
      price: 24.50
    },
    {
      id: 4,
      product: "Good Stuff Red Pipe Tobacco ",
      unitPrice: 24.50,
      quantity: 3,
      price: 24.50
    }
  ],
  subTotal: 171.50,
  shippingCost: 24.50,
  salesTax: {
    percentage: "5%",
    amount: 24.50
  },
  discountCode: {
    percentage: "5%",
    amount: 24.50
  },
  total: 171.50
};

const InvoicePage: React.FC = () => {
  const router = useRouter();
  const id = useParams()

  useEffect(() => {
    // Load jsPDF from CDN and generate PDF
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    script.onload = () => {
      generateAndDownloadPDF();
      // Redirect after 1 millisecond
      setTimeout(() => {
        router.push(`/pages/order/viewOrder/${id || invoiceData.orderId}`);
      }, 1);
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [id, router]);

//   const generateAndDownloadPDF = (): void => {
//     const { jsPDF } = (window as any).jspdf;
//     const doc = new jsPDF();
    
//     const pageWidth = doc.internal.pageSize.width;
//     const margin = 20;
//     let yPos = 20;

//     // Header - Logo and Contact
//     doc.setFontSize(24);
//     doc.setFont('helvetica', 'bold');
//     doc.text('Logo', margin, yPos);
    
//     doc.setFontSize(10);
//     doc.setFont('helvetica', 'normal');
//     doc.text(invoiceData.companyPhone, pageWidth - margin, yPos, { align: 'right' });
//     doc.text(invoiceData.companyEmail, pageWidth - margin, yPos + 5, { align: 'right' });
    
//     yPos += 25;

//     // Details Section
//     doc.setFontSize(14);
//     doc.setFont('helvetica', 'bold');
//     doc.text('Details', margin, yPos);
//     yPos += 8;

//     // Box background
//     doc.setFillColor(250, 250, 250);
//     doc.rect(margin, yPos, pageWidth - 2 * margin, 80, 'F');
//     doc.setDrawColor(229, 231, 235);
//     doc.rect(margin, yPos, pageWidth - 2 * margin, 80, 'S');

//     yPos += 8;

//     // Order ID and Date
//     doc.setFontSize(10);
//     doc.setFont('helvetica', 'bold');
//     doc.text('Order ID:', margin + 5, yPos);
//     doc.setFont('helvetica', 'normal');
//     doc.text(invoiceData.orderId, margin + 30, yPos);

//     doc.setFont('helvetica', 'bold');
//     doc.text('Placed on', pageWidth - margin - 60, yPos);
//     doc.setFont('helvetica', 'normal');
//     doc.text(invoiceData.placedOn, pageWidth - margin - 35, yPos);

//     yPos += 8;

//     // Tracking No
//     doc.setFont('helvetica', 'bold');
//     doc.text('Tracking No:', margin + 5, yPos);
//     doc.setFont('helvetica', 'normal');
//     doc.text(invoiceData.trackingNo, margin + 35, yPos);

//     yPos += 10;

//     // Contact Details
//     doc.setFontSize(11);
//     doc.setFont('helvetica', 'bold');
//     doc.text('Contact Details', margin + 5, yPos);
//     yPos += 8;

//     // Name, Email, Phone in 3 columns
//     doc.setFontSize(8);
//     doc.setTextColor(107, 114, 128);
//     doc.text('Name', margin + 5, yPos);
//     doc.text('Email', margin + 65, yPos);
//     doc.text('Phone Number', margin + 125, yPos);
//     yPos += 5;

//     doc.setFontSize(10);
//     doc.setTextColor(0, 0, 0);
//     doc.setFont('helvetica', 'normal');
//     doc.text(invoiceData.contact.name, margin + 5, yPos);
//     doc.text(invoiceData.contact.email, margin + 65, yPos);
//     doc.text(invoiceData.contact.phone, margin + 125, yPos);

//     yPos += 10;

//     // Delivery Address
//     doc.setFontSize(11);
//     doc.setFont('helvetica', 'bold');
//     doc.text('Delivery Address', margin + 5, yPos);
//     yPos += 8;

//     doc.setFontSize(8);
//     doc.setTextColor(107, 114, 128);
//     doc.text('Address', margin + 5, yPos);
//     yPos += 5;

//     doc.setFontSize(10);
//     doc.setTextColor(0, 0, 0);
//     doc.setFont('helvetica', 'normal');
//     const addressLines = doc.splitTextToSize(invoiceData.deliveryAddress, pageWidth - 2 * margin - 10);
//     doc.text(addressLines, margin + 5, yPos);

//     yPos += 20;

//     // Order Summary
//     doc.setFontSize(14);
//     doc.setFont('helvetica', 'bold');
//     doc.text('Order Summary', margin-2, yPos+10);
//     yPos += 8;

//     // Table Header
//     doc.setFillColor(249, 250, 251);
//     doc.rect(margin, yPos+30, pageWidth - 2 * margin, 8, 'F');
    
//     doc.setFontSize(9);
//     doc.setTextColor(107, 114, 128);
//     doc.setFont('helvetica', 'bold');
//     doc.text('Product', margin + 10, yPos + 30);
//     doc.text('Unit Price', pageWidth - margin - 90, yPos + 30, { align: 'right' });
//     doc.text('Quantity', pageWidth - margin - 50, yPos + 30, { align: 'right' });
//     doc.text('Price', pageWidth - margin - 3, yPos + 30, { align: 'right' });

//     yPos += 10;

//     // Table Rows
//     doc.setFontSize(9);
//     doc.setTextColor(0, 0, 0);
//     doc.setFont('helvetica', 'normal');
    
//     invoiceData.items.forEach((item, index) => {
//       const productLines = doc.splitTextToSize(item.product, 80);
//       doc.text(productLines, margin + 3, yPos);
//       doc.text(`$${item.unitPrice.toFixed(2)}`, pageWidth - margin - 90, yPos+30, { align: 'right' });
//       doc.text(item.quantity.toString(), pageWidth - margin - 50, yPos+30, { align: 'right' });
//       doc.text(`$${item.price.toFixed(2)}`, pageWidth - margin - 3, yPos+30, { align: 'right' });
      
//       yPos += 10;
      
//       if (index < invoiceData.items.length - 1) {
//         doc.setDrawColor(243, 244, 246);
//         doc.line(margin, yPos - 2, pageWidth - margin, yPos - 2);
//       }
//     });

//     yPos += 5;

//     // Totals Section (right-aligned)
//     const totalsX = pageWidth - margin - 60;
    
//     doc.setFontSize(9);
//     doc.setFont('helvetica', 'normal');
    
//     // Sub Total
//     doc.text('Sub Total', totalsX - 40, yPos+30);
//     doc.setFont('helvetica', 'bold');
//     doc.text(`$${invoiceData.subTotal.toFixed(2)}`,  margin - 3, yPos+30, { align: 'right' });
//     yPos += 7;

//     // Shipping Cost
//     doc.setFont('helvetica', 'normal');
//     doc.text('Shipping Cost', totalsX - 40, yPos);
//     doc.text(`$${invoiceData.shippingCost.toFixed(2)}`,  margin - 3, yPos+30, { align: 'right' });
//     yPos += 7;

//     // Sales Tax
//     doc.text(`Sales Tax (${invoiceData.salesTax.percentage})`, totalsX - 40, yPos);
//     doc.text(`$${invoiceData.salesTax.amount.toFixed(2)}`, pageWidth - margin - 3, yPos, { align: 'right' });
//     yPos += 7;

//     // Discount
//     doc.text(`Discount CODE (${invoiceData.discountCode.percentage})`, totalsX - 40, yPos);
//     doc.text(`$${invoiceData.discountCode.amount.toFixed(2)}`, pageWidth - margin - 3, yPos, { align: 'right' });
//     yPos += 10;

//     // Total
//     doc.setFont('helvetica', 'bold');
//     doc.setFontSize(11);
//     doc.text('Total', totalsX - 40, yPos);
//     doc.text(`$${invoiceData.total.toFixed(2)}`, pageWidth - margin - 3, yPos, { align: 'right' });

//     // Save the PDF
//     doc.save(`invoice-${invoiceData.orderId}.pdf`);
//   };
const generateAndDownloadPDF = (): void => {
  const { jsPDF } = (window as any).jspdf;
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;

  // ---------------- Header ----------------
  let yPos = 20;
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Logo', margin, yPos);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(invoiceData.companyPhone, pageWidth - margin, yPos, { align: 'right' });
  doc.text(invoiceData.companyEmail, pageWidth - margin, yPos + 5, { align: 'right' });

  // ---------------- Details Section (Rounded) ----------------
  yPos += 25;
  const detailsHeight = 40;
  doc.setDrawColor(229, 231, 235);
  doc.roundedRect(margin, yPos, pageWidth - 2 * margin, detailsHeight, 3, 3, 'S');

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Details', margin + 5, yPos + 10);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`Order ID: ${invoiceData.orderId}`, pageWidth - margin - 50, yPos + 10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Tracking No: ${invoiceData.trackingNo}`, margin + 5, yPos + 20);
  doc.text(`Placed on ${invoiceData.placedOn}`, pageWidth - margin - 50, yPos + 20);

  // ---------------- Contact Details (Rounded Table) ----------------
  const contactY = yPos + detailsHeight + 5;
  const contactHeight = 20;
  doc.roundedRect(margin, contactY, pageWidth - 2 * margin, contactHeight, 3, 3, 'S');

  doc.setFont('helvetica', 'bold');
  doc.text('Contact Details', margin + 5, contactY + 7);

  doc.setFontSize(8);
  doc.setTextColor(107, 114, 128);
  doc.text('Name', margin + 5, contactY + 12);
  doc.text('Email', margin + 65, contactY + 12);
  doc.text('Phone Number', margin + 125, contactY + 12);

  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.text(invoiceData.contact.name, margin + 5, contactY + 17);
  doc.text(invoiceData.contact.email, margin + 65, contactY + 17);
  doc.text(invoiceData.contact.phone, margin + 125, contactY + 17);

  // ---------------- Delivery Address (Rounded) ----------------
  const addressY = contactY + contactHeight + 5;
  const addressLines = doc.splitTextToSize(invoiceData.deliveryAddress, pageWidth - 2 * margin - 10);
  const addressHeight = 15 + addressLines.length * 5;
  doc.roundedRect(margin, addressY, pageWidth - 2 * margin, addressHeight, 3, 3, 'S');

  doc.setFont('helvetica', 'bold');
  doc.text('Delivery Address', margin + 5, addressY + 7);

  doc.setFontSize(8);
  doc.setTextColor(107, 114, 128);
  doc.text('Address', margin + 5, addressY + 12);

  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.text(addressLines, margin + 5, addressY + 17);

  // ---------------- Order Summary (Rounded Table) ----------------
  let summaryY = addressY + addressHeight + 5;
  const tableHeaderHeight = 8;
  const rowHeight = 6;
  const summaryHeight = tableHeaderHeight + (invoiceData.items.length * rowHeight) + 35; // includes totals
  doc.roundedRect(margin, summaryY, pageWidth - 2 * margin, summaryHeight, 3, 3, 'S');

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Order Summary', margin + 5, summaryY + 10);

  const tableY = summaryY + 15;
  doc.setFontSize(9);
  doc.setTextColor(107, 114, 128);
  doc.setFont('helvetica', 'bold');
  doc.text('Product', margin + 2, tableY + 6);
  doc.text('Unit Price', pageWidth - margin - 90, tableY + 6, { align: 'right' });
  doc.text('Quantity', pageWidth - margin - 50, tableY + 6, { align: 'right' });
  doc.text('Price', pageWidth - margin - 3, tableY + 6, { align: 'right' });

  let rowY = tableY + 12;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  invoiceData.items.forEach(item => {
    const productLines = doc.splitTextToSize(item.product, 80);
    doc.text(productLines, margin + 2, rowY);
    doc.text(`$${item.unitPrice.toFixed(2)}`, pageWidth - margin - 90, rowY, { align: 'right' });
    doc.text(item.quantity.toString(), pageWidth - margin - 50, rowY, { align: 'right' });
    doc.text(`$${item.price.toFixed(2)}`, pageWidth - margin - 3, rowY, { align: 'right' });
    rowY += productLines.length * 5 + 6;
  });

  // Totals
  rowY += 8;
  const labelX = margin + 3;
  const priceX = pageWidth - margin - 3;

  const addTotalRow = (label: string, value: string, isBold = false) => {
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    doc.text(label, labelX, rowY);
    doc.text(value, priceX, rowY, { align: 'right' });
    rowY += 7;
  };

  addTotalRow('Sub Total', `$${invoiceData.subTotal.toFixed(2)}`);
  addTotalRow('Shipping Cost', `$${invoiceData.shippingCost.toFixed(2)}`);
  addTotalRow(`Sales Tax (${invoiceData.salesTax.percentage})`, `$${invoiceData.salesTax.amount.toFixed(2)}`);
  addTotalRow(`Discount CODE (${invoiceData.discountCode.percentage})`, `$${invoiceData.discountCode.amount.toFixed(2)}`);
  addTotalRow('Total', `$${invoiceData.total.toFixed(2)}`, true);

  // ---------------- Big Rounded Border for Details + Contact + Delivery + Summary + Totals ----------------
  const bigBorderY = yPos - 2; // start from top of Details section
  const bigBorderHeight = rowY - yPos + 2; // cover till totals
  doc.setDrawColor(200, 200, 200); // slightly darker gray
  doc.roundedRect(margin - 2, bigBorderY, pageWidth - 2 * margin + 4, bigBorderHeight, 5, 5, 'S');

  // ---------------- Save PDF ----------------
  doc.save(`invoice-${invoiceData.orderId}.pdf`);
};




  return (
    <div className="min-h-screen bg-white p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start mb-12">
        <div className="text-2xl font-bold">Logo</div>
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
                <span className="text-gray-500">{invoiceData.salesTax.percentage}</span>
                <span>${invoiceData.salesTax.amount.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex justify-between text-sm py-2">
              <span>Discount CODE</span>
              <div className="flex gap-8">
                <span className="text-gray-500">{invoiceData.discountCode.percentage}</span>
                <span>${invoiceData.discountCode.amount.toFixed(2)}</span>
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
      <div className="text-center mt-8 text-gray-500 text-sm">
        Generating invoice and redirecting...
      </div>
    </div>
  );
};

export default InvoicePage;