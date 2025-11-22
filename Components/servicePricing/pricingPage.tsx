'use client';
import { PencilEdit02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { useServicePricingStore, convertToFormData } from '@/app/store/servicePricing';

export default function ServicePricing() {
  const router = useRouter();
  const { servicePricing, loading, fetchServicePricing } = useServicePricingStore();

  // Convert backend data to frontend form data
  const formData = servicePricing ? convertToFormData(servicePricing) : {
    shippingCost: 0,
    advertisingText: '',
    minimumFreeShippingAmount: 0
  };

  useEffect(() => {
    fetchServicePricing();
  }, [fetchServicePricing]);

  const handleEdit = () => {
    router.push('/pages/servicePricing/edit');
  };

  if (loading) {
    return (
      <div className="min-h-screen ml-8 flex items-center justify-center">
        <div className="text-gray-600">Loading service pricing...</div>
      </div>
    );
  }

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
              value={formData.shippingCost}
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
              value={formData.advertisingText}
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
              value={formData.minimumFreeShippingAmount}
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