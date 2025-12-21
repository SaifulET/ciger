import BrandManagement from '@/Components/brand/Brand'
import React, { Suspense } from 'react'

function page() {
  return (
    <Suspense fallback={<div>Loading inventory...</div>}><BrandManagement/></Suspense>
  )
}

export default page