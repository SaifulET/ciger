"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BarChart2,
  Bell,
  Calendar,
  Package,
  Users,
  Tag,
  RefreshCw,
  PenSquare,
  DollarSign,
  User,
  LogOut,
  Menu,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// ✅ Updated menu to match UI
const menu = {
  main: [
    { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard/dashboard" },
    { label: "Analytics", icon: BarChart2, path: "/dashboard/analysis" },
    { label: "Notifications", icon: Bell, path: "/dashboard/notifications" },
  ],
  resourceOrderManagement: [
    { label: "Carousel Management", icon: Calendar, path: "/dashboard/carousel" },
    {
      label: "Inventory Management",
      icon: Package,
       path: "/dashboard/InventoryManagement"
    },
    { label: "Order Management", icon: Package, path: "/dashboard/orders" },
    { label: "Customer Management", icon: Users, path: "/dashboard/customers" },
    { label: "Brand Management", icon: Tag, path: "/dashboard/brands" },
    { label: "Refund Management", icon: RefreshCw, path: "/dashboard/refunds" },
    { label: "Blog Management", icon: PenSquare, path: "/dashboard/blogs" },
  ],
  pricing: [
    { label: "Service Pricing", icon: DollarSign, path: "/dashboard/service-pricing" },
    { label: "Discount Code", icon: DollarSign, path: "/dashboard/discount-codes" },
  ],
  personal: [
    { label: "Profile", icon: User, path: "/dashboard/profile" },
    { label: "Logout", icon: LogOut, danger: true, path: "/auth/signin" },
  ],
};

const Sidebar = () => {
  const router = useRouter();
  const [activeItem, setActiveItem] = useState<string>("Dashboard");
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<string[]>([]);

  // Load from localStorage
  useEffect(() => {
    const savedItem = localStorage.getItem("activeSidebarItem");
    const savedDropdowns = localStorage.getItem("openDropdowns");
    if (savedItem) setActiveItem(savedItem);
    if (savedDropdowns) {
      try {
        setOpenDropdowns(JSON.parse(savedDropdowns));
      } catch {
        setOpenDropdowns([]);
      }
    }
  }, []);

  // Save active and dropdown states
  useEffect(() => {
    localStorage.setItem("activeSidebarItem", activeItem);
  }, [activeItem]);

  useEffect(() => {
    localStorage.setItem("openDropdowns", JSON.stringify(openDropdowns));
  }, [openDropdowns]);

  type MenuItem = {
    label: string;
    path?: string;
    icon?: React.ComponentType<{ className?: string }>;
    danger?: boolean;
    children?: { label: string; path?: string }[];
  };

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
            {item.icon && <item.icon className="w-5 h-5" />}
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
    <aside className="w-full sm:w-72 md:w-80 lg:w-[336px] min-h-screen flex flex-col gap-6 p-4 bg-white shadow-sm font-[Poppins] rounded-lg">
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
