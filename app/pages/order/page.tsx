import OrderManagement from '@/Components/order/OrderPage'
import React, { Suspense } from 'react'

function page() {
  return (
     <Suspense fallback={<div>Loading inventory...</div>}><OrderManagement/></Suspense>
  )
}

export default page