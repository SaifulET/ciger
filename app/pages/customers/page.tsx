import CustomerManagement from '@/Components/customer/CustomerPage'
import React, { Suspense } from 'react'

function page() {
  return (
   <Suspense fallback={<div>Loading inventory...</div>}><CustomerManagement/></Suspense>
  )
}

export default page