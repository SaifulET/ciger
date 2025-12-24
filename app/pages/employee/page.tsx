import EmployeeManagement from '@/Components/adminApproval/EmployeeApproval'
import React, { Suspense } from 'react'

function page() {
  return (
    <div> <Suspense fallback={<div>Loading inventory...</div>}><EmployeeManagement/></Suspense></div>
  )
}

export default page