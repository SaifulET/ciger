"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useDiscountCodeStore, DiscountCode } from "@/app/store/discountCodeStore";

export default function EditDiscountCode() {
  const router = useRouter();
  const [formData, setFormData] = useState<DiscountCode>({
    _id: "",
    code: "",
    description: "",
    percentage: 0,
    createdAt: "",
    updatedAt: ""
  });
  const [initialData, setInitialData] = useState<DiscountCode>({
    _id: "",
    code: "",
    description: "",
    percentage: 0,
    createdAt: "",
    updatedAt: ""
  });

  const params = useParams();
  const id = params.id as string;
  const { fetchDiscountCodeById, updateDiscountCodeById, loading } = useDiscountCodeStore();

  useEffect(() => {
    const loadDiscountCode = async () => {
      if (id) {
        const discountCode = await fetchDiscountCodeById(id);
        if (discountCode) {
          setFormData(discountCode);
          setInitialData(discountCode);
        }
      }
    };
    
    loadDiscountCode();
  }, [id, fetchDiscountCodeById]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: name === "percentage" ? Number(value) : value,
    }));
  };

  const handleCancel = () => {
    router.push("/pages/discountCode");
  };

  const handleSave = async () => {
    if (formData !== initialData) {
      await updateDiscountCodeById(id, {
        code: formData.code,
        percentage: formData.percentage,
        description: formData.description
      });
    }
    router.push(`/pages/discountCode`);
  };



  if (loading) {
    return (
      <div className="min-h-screen ml-8 flex items-center justify-center">
        <div className="text-gray-600">Loading discount code...</div>
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
              href="/pages/discountCode"
              className="flex items-center justify-center"
            >
              <HugeiconsIcon icon={ArrowLeft02Icon} />
              Discount Code 
            </Link>

            <span>{">"}</span>
            <span>Edit Discount Code</span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleCancel}
              className="flex items-center justify-center gap-2 px-6 py-3  rounded-lg  text-[16px] leading-[24px] tracking-[0] bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-[#C9A040] text-gray-800 rounded-lg hover:bg-[#9e7e33] transition-colors font-semibold text-[16px] leading-[24px] tracking-[0]"
            >
              Save
            </button>
          </div>
        </div>{" "}
        <h1 className="text-[32px] font-semibold text-gray-900 mb-8">
          Discount Code
        </h1>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
        {/* Discount Code */}
        <div>
          <label className="block font-semibold text-[18px] text-gray-900 mb-2">
            Discount Code
          </label>
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleChange}
            placeholder="Enter discount code"
            className="w-full px-4 py-4 bg-gray-50 border-0 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#C9A040] outline-none"
          />
        </div>
        
        {/* Discount Percentage */}
        <div>
          <label className="block font-semibold text-[18px] text-gray-900 mb-2">
            Discount Percentage (%)
          </label>
          <input
            type="number"
            name="percentage"
            value={formData.percentage}
            onChange={handleChange}
            placeholder="Enter percentage"
            className="w-full px-4 py-4 bg-gray-50 border-0 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#C9A040] outline-none"
          />
        </div>
        
        {/* Discount Description */}
        <div>
          <label className="block font-semibold text-[18px] text-gray-900 mb-2">
            Discount Description
          </label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter description"
            className="w-full px-4 py-4 bg-gray-50 border-0 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#C9A040] outline-none"
          />
        </div>
      </div>
    </div>
  );
}