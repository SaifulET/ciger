"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Menu,
  X,
} from "lucide-react";
import { Analytics01Icon, BrandfetchIcon, Calendar03Icon, DashboardSquare01Icon, Discount01Icon, Image01Icon, Logout01Icon, Money04Icon, MoneyBag01Icon, Notification01Icon, PackageIcon, PencilEdit02Icon, UserGroupIcon, UserIcon, UserStar01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { getEmail, clearAllAuthData } from "@/app/utility/utility";

// ✅ MenuItem interface
interface MenuItem {
  label: string;
  icon: React.ReactNode;
  path?: string;
  danger?: boolean;
  children?: MenuItem[];
  onClick?: () => void;
}

interface MenuStructure {
  main: MenuItem[];
  resourceOrderManagement: MenuItem[];
  pricing: MenuItem[];
  personal: MenuItem[];
}

// ✅ Base menu structure (without admin items)
const baseMenu: MenuStructure = {
  main: [
    { label: "Dashboard", icon: <HugeiconsIcon icon={DashboardSquare01Icon} />, path: "/pages/dashboard" },
    { label: "Analytics", icon: <HugeiconsIcon icon={Analytics01Icon} />, path: "/pages/analytics" },
    { label: "Notifications", icon: <HugeiconsIcon icon={Notification01Icon} />, path: "/pages/notifications" },
  ],
  resourceOrderManagement: [
    { label: "Carousel Management", icon: <HugeiconsIcon icon={Image01Icon} />, path: "/pages/carousel" },
    { label: "Inventory Management", icon: <HugeiconsIcon icon={PackageIcon} />, path: "/pages/inventory" },
    { label: "Order Management", icon: <HugeiconsIcon icon={Calendar03Icon} />, path: "/pages/order" },
    { label: "Customer Management", icon: <HugeiconsIcon icon={UserGroupIcon} />, path: "/pages/customers" },
    { label: "Brand Management", icon: <HugeiconsIcon icon={BrandfetchIcon} />, path: "/pages/brand" },
    { label: "Refund Management", icon: <HugeiconsIcon icon={MoneyBag01Icon} />, path: "/pages/refunds" },
    { label: "Blog Management", icon: <HugeiconsIcon icon={PencilEdit02Icon} />, path: "/pages/blogs" },
  ],
  pricing: [
    { label: "Service Pricing", icon: <HugeiconsIcon icon={Money04Icon} />, path: "/pages/servicePricing" },
    { label: "Discount Code", icon: <HugeiconsIcon icon={Discount01Icon} />, path: "/pages/discountCode" },
  ],
  personal: [
    { label: "Profile", icon: <HugeiconsIcon icon={UserIcon} />, path: "/pages/profile" },
    { 
      label: "Logout", 
      icon: <HugeiconsIcon icon={Logout01Icon} />, 
      danger: true,
      onClick: () => {
        clearAllAuthData();
        window.location.href = "/auth/signin";
      }
    },
  ],
};

// ✅ Admin menu items (separate)
const adminMenuItems: MenuItem[] = [
  { label: "Employee", icon: <HugeiconsIcon icon={UserStar01Icon} />, path: "/pages/employee" },
];

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState<string>("Dashboard");
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Simplified auth initialization
  useEffect(() => {
    const checkAuth = () => {
      setIsLoading(true);
      try {
        const email = getEmail();
        
        if (email) {
          setUserEmail(email);
          // Check if user is admin
          const adminCheck = email === "support@smokenza.com";
          setIsAdmin(adminCheck);
          console.log("Auth check - Email:", email, "Is Admin:", adminCheck);
        } else {
          setUserEmail("");
          setIsAdmin(false);
          console.log("No email found in localStorage");
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setUserEmail("");
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Listen for auth changes (custom event)
    const handleAuthChange = () => {
      console.log("Auth change detected, rechecking...");
      checkAuth();
    };

    window.addEventListener('authChange', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);

    return () => {
      window.removeEventListener('authChange', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, []);

  // ✅ Set active item based on current path
  useEffect(() => {
    const getMenuItemByPath = () => {
      const allMenuItems = [
        ...baseMenu.main,
        ...baseMenu.resourceOrderManagement,
        ...baseMenu.pricing,
        ...baseMenu.personal,
        ...(isAdmin ? adminMenuItems : [])
      ];

      const currentItem = allMenuItems.find(item => 
        item.path && pathname.startsWith(item.path)
      );

      if (currentItem) {
        setActiveItem(currentItem.label);
      }
    };

    if (!isLoading) {
      getMenuItemByPath();
    }
  }, [pathname, isAdmin, isLoading]);

  // ✅ Handle menu item clicks
  const handleItemClick = (item: MenuItem) => {
    if (item.onClick) {
      item.onClick();
      return;
    }
    
    if (item.path) {
      router.push(item.path);
      setActiveItem(item.label);
    }
    
    if (window.innerWidth < 640) {
      setIsOpen(false);
    }
  };

  // ✅ Render menu item
  const renderItem = (item: MenuItem) => {
    const isActive = activeItem === item.label;
    
    return (
      <button
        key={item.label}
        onClick={() => handleItemClick(item)}
        className={`flex items-center gap-3 w-full px-6 py-3 rounded-xl font-medium transition-colors text-left
          ${isActive
            ? "bg-[#C9A040] text-[#212121]"
            : "bg-[#F5F5F5] border border-[#AEAEAE] text-[#212121] hover:bg-yellow-100"
          }
          ${item.danger ? "hover:bg-red-100" : ""}
        `}
      >
        {item.icon}
        <span>{item.label}</span>
      </button>
    );
  };

  // ✅ Main sidebar content with scrollable area
  const SidebarContent = () => (
    <aside className="w-full flex flex-col bg-white shadow-sm font-[Poppins]">
      {/* Scrollable content area with fixed height */}
      <div className="flex-1  overflow-y-auto" style={{ maxHeight: 'calc(80vh - 1rem)' }}>
        <div className="p-4 flex flex-col gap-6">
          {/* Loading State */}
          {isLoading ? (
            <div className="flex flex-col gap-4 p-4">
              <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ) : (
            <>
              {/* Regular Menu Sections */}
              <Section title="Main">
                {baseMenu.main.map((item) => renderItem(item))}
              </Section>
              
              <Section title="Resource & Order Management">
                {baseMenu.resourceOrderManagement.map((item) => renderItem(item))}
              </Section>
              
              <Section title="Pricing & Discounts">
                {baseMenu.pricing.map((item) => renderItem(item))}
              </Section>
              
              {/* Admin Section - ONLY show when user is admin */}
              {isAdmin === true && (
                <Section title="Administration">
                  {adminMenuItems.map((item) => renderItem(item))}
                </Section>
              )}
              
              <Section title="Personal Information">
                {baseMenu.personal.map((item) => renderItem(item))}
              </Section>
            </>
          )}
        </div>
      </div>
      
      {/* Fixed footer at bottom with user info */}
      <div className="border-t border-gray-200 bg-white p-4 shrink-0">
        <div className="text-xs text-gray-500">
          {userEmail ? (
            <>
              Logged in as: <span className="font-medium">{userEmail}</span>
              {isAdmin && <span className="ml-2 text-blue-500">(Admin)</span>}
            </>
          ) : (
            <span className="text-red-500">Not logged in</span>
          )}
        </div>
      </div>
    </aside>
  );

  return (
    <div className="relative">
      {/* Mobile Menu Button */}
      <div className="sm:hidden p-4 flex justify-between items-center bg-white shadow-md fixed top-0 left-0 right-0 z-50">
        <button onClick={() => setIsOpen(!isOpen)} className="z-50">
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-screen z-40 transform bg-white 
        sm:relative sm:top-0 sm:left-0 sm:h-screen sm:translate-x-0 
        transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"}
      `}>
        <SidebarContent />
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)} 
          className="fixed inset-0 bg-black/40 sm:hidden z-30"
        />
      )}
    </div>
  );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-3">
    <h2 className="text-xs font-semibold text-[#717171]">{title}</h2>
    <div className="flex flex-col gap-2">{children}</div>
  </div>
);

export default Sidebar;