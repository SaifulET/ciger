"use client";
import React, { useState, useEffect } from "react";
import { ArrowLeft02Icon, PencilEdit02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useDiscountCodeStore, DiscountCode } from "@/app/store/discountCodeStore";

export default function ViewDiscountCode() {
  const [formData, setFormData] = useState<DiscountCode>({
    _id: "",
    code: "",
    description: "",
    percentage: 0,
    createdAt: "",
    updatedAt: ""
  });

  const params = useParams();
  const id = params.id as string;
  const { fetchDiscountCodeById, loading } = useDiscountCodeStore();

  useEffect(() => {
    const loadDiscountCode = async () => {
      if (id) {
        const discountCode = await fetchDiscountCodeById(id);
        if (discountCode) {
          setFormData(discountCode);
        }
      }
    };
    
    loadDiscountCode();
  }, [id, fetchDiscountCodeById]);

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
            <span>View Discount Code</span>
          </div>
          <div className="flex items-center space-x-3">
            <Link href={`/pages/discountCode/edit/${id}`}>
            <button
              className="flex items-center justify-center gap-2 px-6 py-3 bg-[#C9A040] text-gray-800 rounded-lg hover:bg-[#9e7e33] transition-colors font-semibold text-[16px] leading-[24px] tracking-[0]"
            >
              <HugeiconsIcon icon={PencilEdit02Icon} />Edit
            </button>
            </Link>
            
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
            readOnly
            placeholder="Number"
            className="w-full px-4 py-4 bg-gray-50 border-0 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#C9A040] outline-none"
          />
        </div>
        
        {/* Discount percentage */}
        <div>
          <label className="block font-semibold text-[18px] text-gray-900 mb-2">
           Discount Percentage (%)
          </label>
          <input
            type="number"
            name="percentage"
            value={formData.percentage}
            readOnly
            placeholder="200"
            className="w-full px-4 py-4 bg-gray-50 border-0 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#C9A040] outline-none"
          />
        </div>
        
        {/* Discount Description*/}
        <div>
          <label className="block font-semibold text-[18px] text-gray-900 mb-2">
            Discount Description
          </label>
          <input
            type="text"
            name="description"
            value={formData.description}
            readOnly
            placeholder="Text"
            className="w-full px-4 py-4 bg-gray-50 border-0 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#C9A040] outline-none"
          />
        </div>
      </div>
    </div>
  );
}