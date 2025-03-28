"use client";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { getProfile } from "@/controller/companyProfile/createProfile";
import { useTranslation } from "react-i18next";

export default function AdminSidebar({ facilityId }: { facilityId: string }) {
  const { t } = useTranslation("sidebar");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  const handleSignOut = () => {
    localStorage.clear();
    router.push("/");
  };

  const pathname = usePathname();
  const { formData } = getProfile();

  return (
    <div className="w-64 bg-white border-r border-gray-200 shadow-sm flex flex-col h-screen">
      <div className="flex-1">
        <div className="py-4 px-3 ml-5">
          <h2 className="text-sm text-gray-500 mb-[-10]">{t("mainMenu")}</h2>
        </div>

        <nav className="px-2">
          <div className="space-y-1">
            <Link
              href="/dashboard"
              className={`flex items-center p-3 rounded-md no-underline ${
                [
                  "/dashboard",
                  "/dashboard/addFacility",
                  `/dashboard/facilities/editFacilities/${facilityId}`,
                  `/dashboard/facilities/${facilityId}`,
                ].includes(pathname)
                  ? "text-white bg-blue-900"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <div className="w-6 h-6 mr-3 flex items-center justify-center">
                🌱
              </div>
              <span className="font-medium">{t("plants")}</span>
            </Link>

            <Link
              href="/usage"
              aria-disabled="true"
              onClick={(e) => e.preventDefault()}
              className="flex items-center p-3 rounded-md no-underline cursor-not-allowed text-gray-700 hover:bg-gray-100"
            >
              <div className="w-6 h-6 mr-3">📊</div>
              <span>{t("usage")}</span>
            </Link>

            <Link
              href="/subscription"
              aria-disabled="true"
              onClick={(e) => e.preventDefault()}
              className="flex items-center p-3 rounded-md no-underline cursor-not-allowed text-gray-700 hover:bg-gray-100"
            >
              <div className="w-6 h-6 mr-3">💳</div>
              <span>{t("subscription")}</span>
            </Link>

            <Link
              href="/service"
              aria-disabled="true"
              onClick={(e) => e.preventDefault()}
              className="flex items-center p-3 rounded-md no-underline cursor-not-allowed text-gray-700 hover:bg-gray-100"
            >
              <div className="w-6 h-6 mr-3">🔧</div>
              <span>{t("service")}</span>
            </Link>
          </div>
        </nav>

        {/* Preferences Section */}
        <div className="mt-10 p-4 ml-5 border-t border-gray-200">
          <h2 className="text-sm text-gray-500">{t("preferences")}</h2>
        </div>

        <nav className="px-2">
          <div className="space-y-1">
            <Link
              href="/settings"
              className={`flex items-center p-3 rounded-md no-underline ${
                pathname === "/settings"
                  ? "text-white bg-blue-900"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <div className="w-6 h-6 mr-3">⚙️</div>
              <span className="font-medium">{t("settings")}</span>
            </Link>

            <Link
              href="/helpCenter"
              className={`flex items-center p-3 rounded-md no-underline ${
                pathname === "/helpCenter"
                  ? "text-white bg-blue-900"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <div className="w-6 h-6 mr-3">❓</div>
              <span className="font-medium">{t("helpCenter")}</span>
            </Link>
          </div>
        </nav>
      </div>

      {/* User Profile at Bottom */}
      <div
        className={`p-4 border-t border-gray-200 transition-all duration-300 ${
          isDropdownOpen ? "mb-2" : ""
        }`}
      >
        <div
          className="flex items-center cursor-pointer"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <div className="flex items-center justify-center w-10 h-10 mr-3 text-white bg-blue-700 rounded">
            {formData.firstName && formData.lastName
              ? `${formData.firstName[0]}${formData.lastName[0]}`.toUpperCase()
              : "?"}
          </div>
          <div className="mt-2">
            <span className="text-sm font-medium">
              {formData.firstName} {formData.lastName}
            </span>
            <p className="text-xs text-gray-500">{formData.companyName}</p>
          </div>
          <button className="ml-auto text-gray-400">
            <ChevronDown size={16} />
          </button>
        </div>

        {isDropdownOpen && (
          <div className="mt-2 bg-white py-2">
            <button
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200 rounded"
              onClick={() => router.push("/profile")}
            >
              {t("profile")}
            </button>
            <button
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200 rounded"
              onClick={handleSignOut}
            >
              {t("signOut")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
