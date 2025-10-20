import RevenueChart from '@/Components/analytics/RevenueCurve'
import MonthlyBreakdown from '@/Components/dashboard/MonthlyBreakdown'
import React from 'react'

function page() {
  return (
    <div><MonthlyBreakdown/><RevenueChart/></div>
  )
}

export default page