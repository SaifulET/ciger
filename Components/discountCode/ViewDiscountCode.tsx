"use client";
import React, { useState, useEffect } from "react";
import { ArrowLeft02Icon, PencilEdit02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface DiscountCode {
  id:string;
 code: string;
  description: string;
  percentage: number;
}
const discountCodesData: DiscountCode[] = [
  { id: '1', code: 'ELFD0646', percentage: 5,description:"1st one" },
  { id: '2', code: 'SUMMER2024', percentage: 10,description:"2nd one"  },
  { id: '3', code: 'WELCOME15', percentage: 15 ,description:"3rd one"},
  { id: '4', code: 'SAVE20NOW', percentage: 20 ,description:"4th one"},
  { id: '5', code: 'MEGA25', percentage: 25 ,description:"5th one"},
  { id: '6', code: 'MEGA25', percentage: 25,description:"6th one" },
  { id: '7', code: 'MEGA25', percentage: 25 ,description:"7th one"},
  { id: '8', code: 'MEGA25', percentage: 25 ,description:"8th one"},
  { id: '9', code: 'MEGA25', percentage: 25,description:"8th one" },
];

// Simulated JSON data (in real app, import or fetch this)


export default function ViewDiscountCode() {
  
 const [formData, setFormData] = useState<DiscountCode>({
    id:"",
    code: "",
    description: "",
    percentage: 0,
  });
 

 
const params=useParams()
const id =params.id as string
console.log(id ,typeof(id))
  const setFormDataById = (id:string) => {
    const discountCode =discountCodesData.find((item:DiscountCode) => item.id === id);
    console.log(discountCode)
    
    if (discountCode) {
      setFormData({
        id:discountCode.id,
        code: discountCode.code,
        description: discountCode.description,
        percentage: discountCode.percentage,
      });
     
    } else {
      console.warn('Service not found with ID:', id);
    }
  };
useEffect((()=>{
    setFormDataById(id)
    console.log(id)
}),[id])


 

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

      {/* Title */}

      {/* Form Card */}
      <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
        {/* Shipping Cost */}
        <div>
          <label className="block font-semibold text-[18px] text-gray-900 mb-2">
            Discount Code
          </label>
          <input
            type="text"
            name="Number"
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
            name="Number"
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
            name="Description"
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




