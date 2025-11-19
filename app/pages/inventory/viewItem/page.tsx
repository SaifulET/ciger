'use client'
import InventoryViewItem from '@/Components/inventory/ViewInventory'



import React from 'react'
import { Suspense } from "react";
function page() {
  return (
    <Suspense fallback={<div>Loading...</div>}><InventoryViewItem/></Suspense>
  )
}

export default page