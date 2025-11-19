
'use client'
import InventoryEditItem from '@/Components/inventory/EditInventory'
import React from 'react'
import { Suspense } from "react";
function page() {
  return (
    
    <Suspense fallback={<div>Loading...</div>}><InventoryEditItem/></Suspense>
  )
}

export default page