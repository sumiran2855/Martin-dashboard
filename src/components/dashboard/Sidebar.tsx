"use client";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { getProfile } from "@/controller/companyProfile/createProfile";
import { useTranslation } from "react-i18next";

export default function AdminSidebar({ facilityId }: { facilityId: string }) {
  const { t } = useTranslation("sidebar");
  const pathname = usePathname();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSignOut = () => {
    localStorage.clear();
    router.push("/");
  };

  const { formData } = getProfile();

  const menuItems = [
    { href: "/dashboard", label: "XRGI´s", icon: "⚡", paths: ["/dashboard", "/dashboard/addFacility", `/dashboard/facilities/editFacilities/${facilityId}`, `/dashboard/facilities/${facilityId}`] },
    { href: "/subscription", label: "subscription", icon: "💳", paths: ["/subscription"] },
    { href: "/services", label: "services", icon: "🔧", paths: ["/services"] }
  ];

  const preferenceItems = [
    { href: "/settings", label: "settings", icon: "⚙️" },
    { href: "/helpCenter", label: "helpCenter", icon: "❓" }
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 shadow-sm flex flex-col h-screen">
      <div className="flex-1">
        <SectionTitle title={t("mainMenu")} />
        <nav className="px-2">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <NavItem key={item.href} href={item.href} label={t(item.label)} icon={item.icon} isActive={item.paths.includes(pathname)} />
            ))}
          </div>
        </nav>

        <SectionTitle title={t("preferences")} />
        <nav className="px-2">
          <div className="space-y-1">
            {preferenceItems.map((item) => (
              <NavItem key={item.href} href={item.href} label={t(item.label)} icon={item.icon} isActive={pathname === item.href} />
            ))}
          </div>
        </nav>
      </div>

      <div className={`p-4 border-t border-gray-200 transition-all duration-300 ${isDropdownOpen ? "mb-2" : ""}`}>
        <UserAvatar formData={formData} isDropdownOpen={isDropdownOpen} setIsDropdownOpen={setIsDropdownOpen} router={router} handleSignOut={handleSignOut} t={t} />
      </div>
    </div>
  );
}

const SectionTitle = ({ title }: { title: string }) => (
  <div className="py-4 px-3 ml-5">
    <h2 className="text-sm text-gray-500">{title}</h2>
  </div>
);

const NavItem = ({ href, label, icon, isActive }: { href: string; label: string; icon: string; isActive: boolean }) => (
  <Link href={href} className={`flex items-center p-3 rounded-md no-underline ${isActive ? "text-white bg-blue-900" : "text-gray-700 hover:bg-gray-100"}`}>
    <div className="w-6 h-6 mr-3 flex items-center justify-center">{icon}</div>
    <span className="font-medium">{label}</span>
  </Link>
);

const UserAvatar = ({ formData, isDropdownOpen, setIsDropdownOpen, router, handleSignOut, t }: any) => (
  <>
    <div className="flex items-center cursor-pointer" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
      <div className="flex items-center justify-center w-10 h-10 mr-3 text-white bg-blue-700 rounded">
        {formData.firstName && formData.lastName ? `${formData.firstName[0]}${formData.lastName[0]}`.toUpperCase() : "?"}
      </div>
      <div className="mt-2">
        <span className="text-sm font-medium">{formData.firstName} {formData.lastName}</span>
        <p className="text-xs text-gray-500">{formData.companyName}</p>
      </div>
      <button className="ml-auto text-gray-400">
        <ChevronDown size={16} />
      </button>
    </div>

    {isDropdownOpen && (
      <div className="mt-2 bg-white py-2">
        <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200 rounded" onClick={() => router.push("/profile")}>
          {t("profile")}
        </button>
        <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200 rounded" onClick={handleSignOut}>
          {t("signOut")}
        </button>
      </div>
    )}
  </>
);
