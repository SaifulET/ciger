'use client'
import { ArrowLeft02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useState } from 'react';

interface FormData {
  code: string;
  percentage: string;
  description: string;
}

interface DiscountData {
  code: string;
  percentage: number;
  description: string;
}

export default function CreateDiscountCode() {
  const [formData, setFormData] = useState<FormData>({
    code: '',
    percentage: '',
    description: ''
  });

  const handleSubmit = (): void => {
    // Validate required fields
    if (!formData.code || !formData.percentage) {
      alert('Please fill in the discount code and percentage');
      return;
    }

    // Create JSON object and log to console
    const discountData: DiscountData = {
      code: formData.code,
      percentage: parseFloat(formData.percentage),
      description: formData.description
    };
    
    console.log(JSON.stringify(discountData, null, 2));
    
    // Navigate to discount code page
    window.location.href = '/pages/discountCode';
  };

  const handleCancel = (): void => {
    window.location.href = '/pages/discountCode';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setFormData((prev: FormData) => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen ml-8">
      <div className="">


        <div className='px-8 py-6 bg-white mb-8 rounded-lg'> <div className="flex items-center text-sm text-gray-600 mb-6 ">
          <button 
            onClick={handleCancel}
            className="flex items-center hover:text-gray-900"
            type="button"
          >
            <HugeiconsIcon icon={ArrowLeft02Icon} />
            Discount Code
          </button>
          <span className="mx-2">›</span>
          <span className="text-gray-900">Create Discount Code</span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Discount Code</h1>
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              type="button"
              className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              type="button"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-[#C9A040] text-gray-800 rounded-lg hover:bg-[#9e7e33] transition-colors font-semibold text-[16px] leading-[24px] tracking-[0]"
            >
              Save
            </button>
          </div>
        </div></div>
        {/* Breadcrumb */}
        

        {/* Form Container */}
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          {/* Discount Code Field */}
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-900 mb-2">
              Discount Code
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              id="code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="Text"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            />
          </div>

          {/* Discount Percentage Field */}
          <div>
            <label htmlFor="percentage" className="block text-sm font-medium text-gray-900 mb-2">
              Discount Percentage (%)
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="number"
              id="percentage"
              name="percentage"
              value={formData.percentage}
              onChange={handleChange}
              placeholder="Number"
              min="0"
              max="100"
              step="0.01"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            />
          </div>

          {/* Discount Description Field */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-900 mb-2">
              Discount Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
              rows={6}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}