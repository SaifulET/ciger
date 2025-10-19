'use client'
import React, { useState } from 'react';

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
      month: "January",
      year: "2024",
      categories: [
        { id: "tobacco", name: "Tobacco Products", amount: 120 },
        { id: "hookah", name: "Hookah", amount: 120 },
        { id: "nicotine", name: "Nicotine Vapes", amount: 120 },
        { id: "smokeless", name: "Smokeless Tobacco", amount: 120 },
        { id: "thc", name: "THC", amount: 120 },
        { id: "general", name: "General Accessories", amount: 120 }
      ],
      total: 120,
      refund: 120
    },
    2025: {
      month: "January",
      year: "2025",
      categories: [
        { id: "tobacco", name: "Tobacco Products", amount: 150 },
        { id: "hookah", name: "Hookah", amount: 140 },
        { id: "nicotine", name: "Nicotine Vapes", amount: 130 },
        { id: "smokeless", name: "Smokeless Tobacco", amount: 145 },
        { id: "thc", name: "THC", amount: 155 },
        { id: "general", name: "General Accessories", amount: 125 }
      ],
      total: 150,
      refund: 140
    }
  },
  February: {
    2024: {
      month: "February",
      year: "2024",
      categories: [
        { id: "tobacco", name: "Tobacco Products", amount: 100 },
        { id: "hookah", name: "Hookah", amount: 110 },
        { id: "nicotine", name: "Nicotine Vapes", amount: 105 },
        { id: "smokeless", name: "Smokeless Tobacco", amount: 95 },
        { id: "thc", name: "THC", amount: 115 },
        { id: "general", name: "General Accessories", amount: 100 }
      ],
      total: 110,
      refund: 105
    },
    2025: {
      month: "February",
      year: "2025",
      categories: [
        { id: "tobacco", name: "Tobacco Products", amount: 160 },
        { id: "hookah", name: "Hookah", amount: 150 },
        { id: "nicotine", name: "Nicotine Vapes", amount: 140 },
        { id: "smokeless", name: "Smokeless Tobacco", amount: 155 },
        { id: "thc", name: "THC", amount: 165 },
        { id: "general", name: "General Accessories", amount: 135 }
      ],
      total: 160,
      refund: 150
    }
  }
};

const months = Object.keys(data);
const years = ["2024", "2025"];

interface CardProps {
  name: string;
  amount: number;
}

const CategoryCard: React.FC<CardProps> = ({ name, amount }) => (
  <div className="bg-white rounded-lg p-6 border border-gray-200 flex flex-col items-center justify-center min-h-[150px]">
    <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mb-4">
      <span className="text-white text-lg">₪</span>
    </div>
    <h3 className="text-gray-600 text-sm font-medium text-center mb-2">{name}</h3>
    <p className="text-2xl font-bold text-gray-900">${amount}</p>
  </div>
);

const SummaryCard: React.FC<{ label: string; amount: number }> = ({ label, amount }) => (
  <div className="bg-white rounded-lg p-6 border border-gray-200 flex flex-col items-center justify-center min-h-[150px]">
    <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mb-4">
      <span className="text-white text-lg">₪</span>
    </div>
    <h3 className="text-gray-600 text-sm font-medium">{label}</h3>
    <p className="text-2xl font-bold text-gray-900">${amount}</p>
  </div>
);

export default function MonthlyBreakdown() {
  const [selectedMonth, setSelectedMonth] = useState(months[0]);
  const [selectedYear, setSelectedYear] = useState(years[0]);

  const currentData = data[selectedMonth]?.[selectedYear] || data[months[0]][years[0]];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Monthly Breakdown</h1>
          <div className="flex gap-4">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-4 py-2 bg-yellow-600 text-white rounded-full font-medium cursor-pointer hover:bg-yellow-700 transition-colors"
            >
              {months.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-4 py-2 bg-yellow-600 text-white rounded-full font-medium cursor-pointer hover:bg-yellow-700 transition-colors"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {currentData.categories.map((category) => (
            <CategoryCard
              key={category.id}
              name={category.name}
              amount={category.amount}
            />
          ))}
        </div>

        {/* Total and Refund */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SummaryCard label="Total" amount={currentData.total} />
          <SummaryCard label="Refund" amount={currentData.refund} />
        </div>
      </div>
    </div>
  );
}