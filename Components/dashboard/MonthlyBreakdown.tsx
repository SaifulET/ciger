'use client';
import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  DollarSign,
  RotateCcw,
  Cigarette,
  FlaskConical,
  Droplets,
  Package,
  Leaf,
  ShoppingBag,
} from 'lucide-react';

interface BreakdownData {
  month: string;
  year: string;
  categories: {
    id: string;
    name: string;
    amount: number;
  }[];
  total: number;
  refund: number;
}

const data: Record<string, Record<string, BreakdownData>> = {
  January: {
    2024: {
      month: 'January',
      year: '2024',
      categories: [
        { id: 'tobacco', name: 'Tobacco Products', amount: 120 },
        { id: 'hookah', name: 'Hookah', amount: 120 },
        { id: 'nicotine', name: 'Nicotine Vapes', amount: 120 },
        { id: 'smokeless', name: 'Smokeless Tobacco', amount: 120 },
        { id: 'thc', name: 'THC', amount: 120 },
        { id: 'general', name: 'General Accessories', amount: 120 },
      ],
      total: 120,
      refund: 120,
    },
    2025: {
      month: 'January',
      year: '2025',
      categories: [
        { id: 'tobacco', name: 'Tobacco Products', amount: 150 },
        { id: 'hookah', name: 'Hookah', amount: 140 },
        { id: 'nicotine', name: 'Nicotine Vapes', amount: 130 },
        { id: 'smokeless', name: 'Smokeless Tobacco', amount: 145 },
        { id: 'thc', name: 'THC', amount: 155 },
        { id: 'general', name: 'General Accessories', amount: 125 },
      ],
      total: 150,
      refund: 140,
    },
  },
  February: {
    2024: {
      month: 'February',
      year: '2024',
      categories: [
        { id: 'tobacco', name: 'Tobacco Products', amount: 100 },
        { id: 'hookah', name: 'Hookah', amount: 110 },
        { id: 'nicotine', name: 'Nicotine Vapes', amount: 105 },
        { id: 'smokeless', name: 'Smokeless Tobacco', amount: 95 },
        { id: 'thc', name: 'THC', amount: 115 },
        { id: 'general', name: 'General Accessories', amount: 100 },
      ],
      total: 110,
      refund: 105,
    },
    2025: {
      month: 'February',
      year: '2025',
      categories: [
        { id: 'tobacco', name: 'Tobacco Products', amount: 160 },
        { id: 'hookah', name: 'Hookah', amount: 150 },
        { id: 'nicotine', name: 'Nicotine Vapes', amount: 140 },
        { id: 'smokeless', name: 'Smokeless Tobacco', amount: 155 },
        { id: 'thc', name: 'THC', amount: 165 },
        { id: 'general', name: 'General Accessories', amount: 135 },
      ],
      total: 160,
      refund: 150,
    },
  },
};

const months = Object.keys(data);
const years = ['2024', '2025'];

// Map each category to a unique icon
const categoryIcons: Record<string, React.ReactNode> = {
  tobacco: <Cigarette className="text-black" />,
  hookah: <FlaskConical className="text-black" />,
  nicotine: <Droplets className="text-black" />,
  smokeless: <Package className="text-black" />,
  thc: <Leaf className="text-black" />,
  general: <ShoppingBag className="text-black" />,
};

interface CardProps {
  name: string;
  amount: number;
  icon: React.ReactNode;
}

const CategoryCard: React.FC<CardProps> = ({ name, amount, icon }) => (
  <div className="bg-white rounded-lg p-6 border border-gray-200 flex items-center justify-between min-h-[150px]">
    <div>
      <h3 className=" text-gray-600 font-montserrat font-semibold text-[18px] leading-[26px] tracking-normal">{name}</h3>
      <p className="text-2xl font-bold text-gray-900">${amount}</p>
    </div>
    <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mt-32">
      {icon}
    </div>
  </div>
);

interface SummaryCardProps {
  label: string;
  amount: number;
  icon: React.ReactNode;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ label, amount, icon }) => (
  <div className="bg-white rounded-lg p-6 border border-gray-200 flex items-center justify-between min-h-[150px]">
    <div>
      <h3 className="text-gray-600 font-montserrat font-semibold text-[18px] leading-[26px] tracking-normal">{label}</h3>
      <p className="text-2xl font-bold text-gray-900">${amount}</p>
    </div>
    <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mt-32">
      {icon}
    </div>
  </div>
);

export default function MonthlyBreakdown() {
  const [selectedMonth, setSelectedMonth] = useState(months[0]);
  const [selectedYear, setSelectedYear] = useState(years[0]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const currentData = data[selectedMonth]?.[selectedYear] || data[months[0]][years[0]];

  return (
    <div className="min-h-screen bg-gray-100 pl-10">
      <div className="w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-10 mb-8 bg-white rounded-lg">
          <h1 className="text-3xl font-bold text-gray-900">Monthly Breakdown</h1>
          <div className="flex gap-4">
            {/* Month Select */}
            <div className="relative">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                onFocus={() => setOpenDropdown('month')}
                onBlur={() => setOpenDropdown(null)}
                className="px-6 pr-10 py-2 bg-yellow-600 text-black rounded-full font-semibold text-[14px] leading-[24px] tracking-normal cursor-pointer hover:bg-yellow-700 transition-colors appearance-none"
              >
                {months.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none transition-transform duration-200">
                {openDropdown === 'month' ? (
                  <ChevronDown className="w-4 h-4 text-black rotate-180" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-black" />
                )}
              </div>
            </div>

            {/* Year Select */}
            <div className="relative">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                onFocus={() => setOpenDropdown('year')}
                onBlur={() => setOpenDropdown(null)}
                className="px-4 pr-10 py-2 bg-yellow-600 text-black rounded-full font-semibold text-[14px] leading-[24px] tracking-normal cursor-pointer hover:bg-yellow-700 transition-colors appearance-none"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none transition-transform duration-200">
                {openDropdown === 'year' ? (
                  <ChevronDown className="w-4 h-4 text-black rotate-180" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-black" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {currentData.categories.map((category) => (
            <CategoryCard
              key={category.id}
              name={category.name}
              amount={category.amount}
              icon={categoryIcons[category.id] || <DollarSign className="text-white" />}
            />
          ))}
        </div>

        {/* Total and Refund */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SummaryCard label="Total" amount={currentData.total} icon={<DollarSign className="text-black" />} />
          <SummaryCard label="Refund" amount={currentData.refund} icon={<RotateCcw className="text-black" />} />
        </div>
      </div>
    </div> 
  );
}
