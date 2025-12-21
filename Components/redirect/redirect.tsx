"use client";
import React, { useEffect } from 'react'
import { useRouter } from "next/navigation";

function Redirect() {
    const router = useRouter();
    
    useEffect(() => {
        router.push("/pages/dashboard");
    }, [router]); 
  return (
    <div></div>
  )
}

export default Redirect