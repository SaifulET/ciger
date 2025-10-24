'use client';
import { PencilEdit02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';

export default function ServicePricing() {
  const router = useRouter();

  // Local state to hold fetched data
  const [serviceData, setServiceData] = useState({
    shippingCost: null as number | null,
    advertisingText: '',
    minimumFreeShippingAmount: 0,
  });

  // Simulated JSON data (in real use, fetch from API or import JSON file)
  const jsonData = {
    shippingCost: 50,
    advertisingText: 'Free shipping for orders above $200!',
    minimumFreeShippingAmount: 200,
  };

  // Load JSON data into state
  useEffect(() => {
    // Example: simulate API call delay
    setTimeout(() => {
      setServiceData(jsonData);
    }, 300);
  }, []);

  const handleEdit = () => {
    router.push('/pages/servicePricing/edit');
  };

  return (
    <div className="min-h-screen ml-8">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-8 bg-white rounded-lg shadow-sm p-8">
          <h1 className="font-semibold text-[40px] leading-[48px] tracking-[0] text-gray-900">
            Service Pricing
          </h1>
          <button
            onClick={handleEdit}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#C9A040] text-gray-800 rounded-lg hover:bg-[#9e7e33] transition-colors font-semibold text-[16px] leading-[24px] tracking-[0]"
          >
            <HugeiconsIcon icon={PencilEdit02Icon} />
            Edit
          </button>
        </div>

        {/* Form Fields */}
        <div className="space-y-6 bg-white p-8 rounded-lg">
          {/* Shipping Cost */}
          <div className="mb-8">
            <label className="block font-semibold text-[18px] leading-[26px] tracking-[0] text-gray-900 mb-2">
              Shipping Cost
            </label>
            <input
              type="text"
              value={serviceData.shippingCost ?? ''}
              placeholder="Number"
              readOnly
              className="w-full px-4 py-4 bg-gray-50 border-0 rounded-lg text-gray-500 placeholder-gray-400"
            />
          </div>

          {/* Advertising Text */}
          <div className="mb-8">
            <label className="block font-semibold text-[18px] leading-[26px] tracking-[0] text-gray-900 mb-2">
              Advertising Text{' '}
              <span className="font-normal text-gray-600">
                (will show on top of landing page)
              </span>
            </label>
            <input
              type="text"
              value={serviceData.advertisingText}
              placeholder="Text"
              readOnly
              className="w-full px-4 py-4 bg-gray-50 border-0 rounded-lg text-gray-500 placeholder-gray-400"
            />
          </div>

          {/* Minimum Free Shipping Amount */}
          <div className="mb-8">
            <label className="block font-semibold text-[18px] leading-[26px] tracking-[0] text-gray-900 mb-2">
              Minimum Free Shipping Amount
            </label>
            <input
              type="text"
              value={serviceData.minimumFreeShippingAmount ?? ''}
              placeholder="200"
              readOnly
              className="w-full px-4 py-4 bg-gray-50 border-0 rounded-lg text-gray-500 placeholder-gray-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
