"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Menu,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Analytics01Icon, BrandfetchIcon, Calendar03Icon, DashboardSquare01Icon, Image01Icon, Logout01Icon, Money04Icon, MoneyBag01Icon, Notification01Icon, PackageIcon, PencilEdit02Icon, UserGroupIcon, UserIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

// ✅ Define proper TypeScript interfaces
interface MenuItem {
  label: string;
  icon: React.ReactNode;
  path?: string;
  danger?: boolean;
  children?: MenuItem[];
}

interface MenuStructure {
  main: MenuItem[];
  resourceOrderManagement: MenuItem[];
  pricing: MenuItem[];
  personal: MenuItem[];
}

// ✅ Updated menu to match UI with proper typing
const menu: MenuStructure = {
  main: [
    { label: "Dashboard", icon: <HugeiconsIcon icon={DashboardSquare01Icon} />, path: "/pages/dashboard" },
    { label: "Analytics", icon: <HugeiconsIcon icon={Analytics01Icon} />, path: "/pages/analytics" },
    { label: "Notifications", icon: <HugeiconsIcon icon={Notification01Icon} />, path: "/pages/notifications" },
  ],
  resourceOrderManagement: [
    { label: "Carousel Management", icon: <HugeiconsIcon icon={Image01Icon} />, path: "/pages/carousel" },
    {
      label: "Inventory Management",
      icon: <HugeiconsIcon icon={PackageIcon} />,
      path: "/pages/inventory"
    },
    { label: "Order Management", icon: <HugeiconsIcon icon={Calendar03Icon} />, path: "/pages/order" },
    { label: "Customer Management", icon: <HugeiconsIcon icon={UserGroupIcon} />, path: "/pages/customers" },
    { label: "Brand Management", icon: <HugeiconsIcon icon={BrandfetchIcon} />, path: "/pages/brand" },
    { label: "Refund Management", icon: <HugeiconsIcon icon={MoneyBag01Icon} />, path: "/pages/refunds" },
    { label: "Blog Management", icon: <HugeiconsIcon icon={PencilEdit02Icon} />, path: "/pages/blogs" },
  ],
  pricing: [
    { label: "Service Pricing", icon: <HugeiconsIcon icon={Money04Icon} />, path: "/pages/servicePricing" },
    { label: "Discount Code", icon: <HugeiconsIcon icon={Money04Icon} />, path: "/pages/discountCode" },
  ],
  personal: [
    { label: "Profile", icon: <HugeiconsIcon icon={UserIcon} />, path: "/pages/profile" },
    { label: "Logout", icon: <HugeiconsIcon icon={Logout01Icon} />, danger: true, path: "/auth/signin" },
  ],
};

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState<string>("Dashboard");
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<string[]>([]);

  // Function to get the base path (first 2 segments)
  const getBasePath = (path: string) => {
    const segments = path.split('/').filter(segment => segment.length > 0);
    return '/' + segments.slice(0, 2).join('/');
  };

  // Function to find menu item by path
  const findMenuItemByPath = (path: string): MenuItem | null => {
    const basePath = getBasePath(path);
    
    // Search through all menu sections
    const allMenuItems = [
      ...menu.main,
      ...menu.resourceOrderManagement,
      ...menu.pricing,
      ...menu.personal
    ];
    
    return allMenuItems.find(item => item.path === basePath) || null;
  };

  // Function to find parent section for dropdown
  const findParentSection = (itemLabel: string): string | null => {
    if (menu.main.some(item => item.label === itemLabel)) return "Main";
    if (menu.resourceOrderManagement.some(item => item.label === itemLabel)) return "Resource & Order Management";
    if (menu.pricing.some(item => item.label === itemLabel)) return "Pricing & Discounts";
    if (menu.personal.some(item => item.label === itemLabel)) return "Personal Information";
    return null;
  };

  // Set active item based on current URL when component mounts or pathname changes
  useEffect(() => {
    const currentMenuItem = findMenuItemByPath(pathname);
    if (currentMenuItem) {
      setActiveItem(currentMenuItem.label);
      
      // Also open the parent dropdown if applicable
      const parentSection = findParentSection(currentMenuItem.label);
      if (parentSection) {
        setOpenDropdowns([parentSection]);
      }
    }

    // Load from localStorage (for backward compatibility)
    const savedItem = localStorage.getItem("activeSidebarItem");
    const savedDropdowns = localStorage.getItem("openDropdowns");
    
    if (savedItem && !currentMenuItem) {
      setActiveItem(savedItem);
    }
    
    if (savedDropdowns) {
      try {
        setOpenDropdowns(JSON.parse(savedDropdowns));
      } catch {
        setOpenDropdowns([]);
      }
    }
  }, [pathname]);

  // Save active and dropdown states
  useEffect(() => {
    localStorage.setItem("activeSidebarItem", activeItem);
  }, [activeItem]);

  useEffect(() => {
    localStorage.setItem("openDropdowns", JSON.stringify(openDropdowns));
  }, [openDropdowns]);

  const handleItemClick = (item: MenuItem, parentLabel?: string) => {
    if (item.children && item.children.length > 0) {
      setOpenDropdowns((prev) =>
        prev.includes(item.label) ? [] : [item.label]
      );
      return;
    }
    if (item.path) router.push(item.path);
    setActiveItem(item.label);
    if (parentLabel) setOpenDropdowns([parentLabel]);
    else setOpenDropdowns([]);
  };

  const renderItem = (item: MenuItem, isChild = false, parentLabel?: string) => {
    const hasChildren = item.children && item.children.length > 0;
    const isDropdownOpen = openDropdowns.includes(item.label);
    const isActive = activeItem === item.label;

    return (
      <div key={item.label} className="flex flex-col gap-1">
        <button
          onClick={() => handleItemClick(item, parentLabel)}
          className={`flex items-center justify-between gap-3 px-6 py-3 rounded-xl font-medium transition-colors
            ${isActive
              ? "bg-[#C9A040] text-[#212121]"
              : "bg-[#F5F5F5] border border-[#AEAEAE] text-[#212121] hover:bg-yellow-100"
            }
            ${item.danger ? " hover:bg-red-100" : ""}
          `}
        >
          <div className="flex items-center gap-3">
            {item.icon}
            {item.label}
          </div>
          {hasChildren && (
            <span>
              {isDropdownOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </span>
          )}
        </button>

        {hasChildren && isDropdownOpen && (
          <div className="flex flex-col gap-1">
            {item.children!.map((child) => renderItem(child, true, item.label))}
          </div>
        )}
      </div>
    );
  };

  const SidebarContent = () => (
    <aside className="w-full sm:w-72 md:w-80 lg:w-[336px] min-h-screen flex flex-col gap-6 p-4 bg-white shadow-sm font-[Poppins] rounded-lg ">
      <Section title="Main">{menu.main.map((item) => renderItem(item))}</Section>
      <Section title="Resource & Order Management">
        {menu.resourceOrderManagement.map((item) => renderItem(item))}
      </Section>
      <Section title="Pricing & Discounts">
        {menu.pricing.map((item) => renderItem(item))}
      </Section>
      <Section title="Personal Information">
        {menu.personal.map((item) => renderItem(item))}
      </Section>
    </aside>
  );

  return (
    <div className="relative">
      <div className="sm:hidden p-4 flex justify-between items-center bg-white shadow-md">
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <span className="font-bold">My App</span>
      </div>

      <div className={`rounded-lg fixed top-0 left-0 h-full z-40 transform bg-white sm:static sm:translate-x-0 transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <SidebarContent />
      </div>

      {isOpen && (
        <div onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black/40 sm:hidden" />
      )}
    </div>
  );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-3">
    <h2 className="text-xs font-semibold text-[#717171]">{title}</h2>
    <div className="flex flex-col gap-3">{children}</div>
  </div>
);

export default Sidebar;