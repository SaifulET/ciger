"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useServicePricingStore, convertToFormData, ServicePricingFormData } from "@/app/store/servicePricing";

export default function EditServicePricing() {
  const router = useRouter();
  const { servicePricing, loading, fetchServicePricing, updateServicePricing } = useServicePricingStore();
  
  const [formData, setFormData] = useState<ServicePricingFormData>({
    shippingCost: 0,
    advertisingText: "",
    minimumFreeShippingAmount: 0,
  });

  const [initialData, setInitialData] = useState<ServicePricingFormData | null>(null);

  useEffect(() => {
    const loadServicePricing = async () => {
      await fetchServicePricing();
    };
    
    loadServicePricing();
  }, [fetchServicePricing]);

  // Update form data when servicePricing changes
  useEffect(() => {
    if (servicePricing) {
      const newFormData = convertToFormData(servicePricing);
      setFormData(newFormData);
      setInitialData(newFormData);
    }
  }, [servicePricing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "shippingCost" || name === "minimumFreeShippingAmount"
          ? Number(value)
          : value,
    }));
  };

  const handleCancel = () => {
    router.push("/pages/servicePricing");
  };

  const handleSave = async () => {
    if (servicePricing && formData !== initialData) {
      console.log(servicePricing,formData)
      await updateServicePricing(servicePricing._id, formData);
    }
    router.push("/pages/servicePricing");
  };

  if (loading && !servicePricing) {
    return (
      <div className="min-h-screen ml-8 flex items-center justify-center">
        <div className="text-gray-600">Loading service pricing...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ml-8">
      {/* Header Section */}
      <div className=" px-8 py-2 pt-8 rounded-lg bg-white mb-8">
        <div className="flex items-center justify-between ">
          <div className="flex items-center text-sm text-gray-500 space-x-2">
            <Link
              href="/pages/servicePricing"
              className="flex items-center justify-center"
            >
              <HugeiconsIcon icon={ArrowLeft02Icon} />
              Service Pricing
            </Link>

            <span>{">"}</span>
            <span>Edit Service Pricing</span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleCancel}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-[16px] leading-[24px] tracking-[0] bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-[#C9A040] text-gray-800 rounded-lg hover:bg-[#9e7e33] transition-colors font-semibold text-[16px] leading-[24px] tracking-[0] disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
        <h1 className="text-[32px] font-semibold text-gray-900 mb-8">
          Service Pricing
        </h1>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
        {/* Shipping Cost */}
        <div>
          <label className="block font-semibold text-[18px] text-gray-900 mb-2">
            Shipping Cost
          </label>
          <input
            type="number"
            name="shippingCost"
            value={formData.shippingCost}
            onChange={handleChange}
            placeholder="Number"
            className="w-full px-4 py-4 bg-gray-50 border-0 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#C9A040] outline-none"
          />
        </div>

        {/* Advertising Text */}
        <div>
          <label className="block font-semibold text-[18px] text-gray-900 mb-2">
            Advertising Text{" "}
            <span className="font-normal text-gray-600">
              (will show on top of landing page)
            </span>
          </label>
          <input
            type="text"
            name="advertisingText"
            value={formData.advertisingText}
            onChange={handleChange}
            placeholder="Text"
            className="w-full px-4 py-4 bg-gray-50 border-0 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#C9A040] outline-none"
          />
        </div>

        {/* Minimum Free Shipping Amount */}
        <div>
          <label className="block font-semibold text-[18px] text-gray-900 mb-2">
            Minimum Free Shipping Amount
          </label>
          <input
            type="number"
            name="minimumFreeShippingAmount"
            value={formData.minimumFreeShippingAmount}
            onChange={handleChange}
            placeholder="200"
            className="w-full px-4 py-4 bg-gray-50 border-0 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#C9A040] outline-none"
          />
        </div>
      </div>
    </div>
  );
}