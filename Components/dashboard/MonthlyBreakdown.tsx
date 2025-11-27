'use client';
import React, { useEffect, useState } from 'react';
import {
  ChevronDown,
  DollarSign,
  RotateCcw,
  Cigarette,
  FlaskConical,
  Droplets,
  Package,
  Leaf,
  ShoppingBag,
} from 'lucide-react';
import api from '@/lib/axios';

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
  const [data, setData] = useState<Record<string, Record<string, BreakdownData>>>({});
  const [months, setMonths] = useState<string[]>([]);
  const [years, setYears] = useState<string[]>([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get("/dashboard/");
        console.log(response);
        const apiData: Record<string, Record<string, BreakdownData>> = response.data.data;
        
        setData(apiData);
        
        // Extract months and years from the API data
        const monthsList = Object.keys(apiData);
        const yearsList = Object.keys(apiData[monthsList[0]] || {});
        
        setMonths(monthsList);
        setYears(yearsList);
        
        if (monthsList.length > 0 && yearsList.length > 0) {
          setSelectedMonth(monthsList[0]);
          setSelectedYear(yearsList[0]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        // Set empty state on error
        setData({});
        setMonths([]);
        setYears([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get current data based on selection
  const currentData = data[selectedMonth]?.[selectedYear];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 pl-10 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading data...</p>
        </div>
      </div>
    );
  }

  // if (!currentData && months.length === 0) {
  //   return (
  //     <div className="min-h-screen bg-gray-100 pl-10 flex items-center justify-center">
  //       <div className="text-center">
  //         <p className="text-gray-600">No data available</p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-gray-100 pl-10 ">
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
                <ChevronDown className="w-4 h-4 text-black" />
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
                <ChevronDown className="w-4 h-4 text-black" />
              </div>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {currentData?.categories.map((category) => (
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
          <SummaryCard 
            label="Total" 
            amount={currentData?.total || 0} 
            icon={<DollarSign className="text-black" />} 
          />
          <SummaryCard 
            label="Refund" 
            amount={currentData?.refund || 0} 
            icon={<RotateCcw className="text-black" />} 
          />
        </div>
      </div>
    </div> 
  );
}