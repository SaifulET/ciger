import InventoryManagement from '@/Components/inventory/InventoryMain'
import React from 'react'
import { Suspense } from "react";
function page() {
  return (
     <Suspense fallback={<div>Loading inventory...</div>}>
      <InventoryManagement/>
    </Suspense>
    
  )
}

export default page