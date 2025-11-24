"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import logo from "@/public/logo.svg"
import Image from "next/image";
import Cookies from "js-cookie";

import useUserStore from "@/app/store/userStore";
import {
  ArrowDown01Icon,
  Logout01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";


const Navbar: React.FC = () => {
  const [isAvatarDropdownOpen, setIsAvatarDropdownOpen] = useState(false);

  const router = useRouter();
const {user} = useUserStore()
const {UserLogoutRequest}=useUserStore()

  const toggleAvatarDropdown = () => {
      setIsAvatarDropdownOpen(!isAvatarDropdownOpen);
    
  };
 

  


  return (
    <div className="p-0  md:relative   md:left-1/2 md:transform md:-translate-x-1/2  md:h-[116px] w-full bg-[#F5F5F5] text-gray-800">
      <nav className="flex justify-between m-0 p-0 items-center px-4 md:px-16 py-4 md:py-8 w-full h-full bg-[#ffffff]">
       
        <Image src={logo} alt="logo"  width={150} height={150} className="rounded-full " />

        {/* Desktop + Medium Menu */}
        <div className="hidden md:flex items-center gap-16 lg:gap-18 w-auto ">
          
          <div>
            <div
              className="flex text-gray-800 items-center gap-2 px-6 py-3  rounded-xl transition-colors"
              onClick={toggleAvatarDropdown}
            >
              <span className="rounded-full"><HugeiconsIcon icon={UserIcon} /></span>{" "}
              <span className="cursor-default">First name </span>
              <HugeiconsIcon
                icon={ArrowDown01Icon}
                className={`w-6 h-6 text-gray-900 transition-transform ${
                  isAvatarDropdownOpen 
                    ? "rotate-180"
                    : ""
                }`}
              />
            </div>
            {isAvatarDropdownOpen  && (
              <div className="absolute top-20 pr-5 mt-2 bg-[#FFFAE6] rounded-lg shadow-lg border border-gray-300 z-50 text-gray-800">
                <div className="flex flex-col text-left">
                  <a
                    href="/pages/profile"
                    className=" flex gap-2 px-4 py-3 border-b hover:bg-yellow-50 hover:text-yellow-600 border-[#AEAEAE]"
                  >
                   <HugeiconsIcon icon={UserIcon} /> Profile
                  </a>
                  <button className="px-4  py-3 rounded-b-lg hover:bg-yellow-50 hover:text-yellow-600" onClick={
                    async() => {
                      await UserLogoutRequest();
                      router.push("/auth/signin")
                    }}>
                
                    <span className="flex gap-2">
                      {" "}
                      <HugeiconsIcon icon={Logout01Icon} /> Logout
                    </span>
        
                  </button>
                 
                </div>
              </div>
            )}
          </div>
        </div>

       
      </nav>
    
    </div>
  );
};

export default Navbar;
