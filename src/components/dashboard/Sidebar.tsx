"use client";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getProfile } from "@/controller/companyProfile/createProfile";
import { useTranslation } from "react-i18next";

export default function AdminSidebar({ facilityId }: { facilityId: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const { t, i18n } = useTranslation("sidebar");

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    const savedLang = localStorage.getItem("language");
    if (savedLang && i18n.language !== savedLang) {
      i18n.changeLanguage(savedLang);
    }
  }, []);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("language", lng);
  };

  const handleSignOut = () => {
    localStorage.clear();
    router.push("/");
  };

  const { formData } = getProfile();

  const menuItems = [
    {
      href: "/dashboard",
      label: "XRGI´s",
      icon: "⚡",
      paths: [
        "/dashboard",
        "/dashboard/addFacility",
        `/dashboard/facilities/editFacilities/${facilityId}`,
        `/dashboard/facilities/${facilityId}`,
      ],
    },
    {
      href: "/subscription",
      label: "subscription",
      icon: "💳",
      paths: ["/subscription"],
    },
    { href: "/services", label: "services", icon: "🔧", paths: ["/services"] },
  ];

  const preferenceItems = [
    { href: "/settings", label: "settings", icon: "⚙️" },
    { href: "/helpCenter", label: "helpCenter", icon: "❓" },
  ];

  const [menuOpen, setMenuOpen] = useState(false);

  const handleToggle = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <>
      <div className=" max-lg:block absolute right-3 top-3 hidden ">
        <div
          className="cursor-pointer flex justify-end bg-white rounded-full p-2 shadow-sm"
          onClick={handleToggle}
        >
          <svg
            fill="#000000"
            width="20px"
            height="20px"
            viewBox="0 -2 28 28"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="m2.61 0h22.431c1.441 0 2.61 1.168 2.61 2.61s-1.168 2.61-2.61 2.61h-22.431c-1.441 0-2.61-1.168-2.61-2.61s1.168-2.61 2.61-2.61z" />
            <path d="m2.61 9.39h22.431c1.441 0 2.61 1.168 2.61 2.61s-1.168 2.61-2.61 2.61h-22.431c-1.441 0-2.61-1.168-2.61-2.61s1.168-2.61 2.61-2.61z" />
            <path d="m2.61 18.781h22.431c1.441 0 2.61 1.168 2.61 2.61s-1.168 2.61-2.61 2.61h-22.431c-1.441 0-2.61-1.168-2.61-2.61s1.168-2.61 2.61-2.61z" />
          </svg>
        </div>
      </div>
      <div
        className={`w-64 bg-white border-r border-gray-200 shadow-sm flex flex-col transition-all duration-300 h-screen max-lg:fixed z-10 ${
          menuOpen ? " max-lg:left-[0%]" : "max-lg:left-[-100%] "
        }`}
      >
        <div className="flex-1 relative">
          <ul className="flex gap-2 pt-3 font-sm pb-3 justify-center pl-0">
            {[
              { code: "da", label: "Da" },
              { code: "de", label: "De" },
              { code: "it", label: "It" },
              { code: "en", label: "En" },
            ].map(({ code, label }) => (
              <li key={code}>
                <button
                  onClick={() => changeLanguage(code)}
                  className={`no-underline text-blue-900 relative focus:outline-none ${
                    i18n.language === code
                      ? "font-bold underline text-blue"
                      : ""
                  }`}
                >
                  {label} {code !== "en" && "|"}
                </button>
              </li>
            ))}
          </ul>

          <SectionTitle title={t("mainMenu")} />
          <nav className="px-2">
            <div className="space-y-1">
              {/* {menuItems.map((item) => (
                <NavItem key={item.href} href={item.href} label={t(item.label)} icon={item.icon} isActive={item.paths.includes(pathname)} />
              ))} */}
              {hasMounted &&
                menuItems.map((item) => (
                  <NavItem
                    key={item.href}
                    href={item.href}
                    label={t(item.label)}
                    icon={item.icon}
                    isActive={item.paths.some(path => pathname.startsWith(path))}
                  />
                ))}
            </div>
          </nav>

          <SectionTitle title={t("preferences")} />
          <nav className="px-2">
            <div className="space-y-1">
              {preferenceItems.map((item) => (
                <NavItem
                  key={item.href}
                  href={item.href}
                  label={t(item.label)}
                  icon={item.icon}
                  isActive={pathname === item.href}
                />
              ))}
            </div>
          </nav>
        </div>

        <div
          className={`p-4 border-t border-gray-200 transition-all duration-300 ${
            isDropdownOpen ? "mb-2" : ""
          }`}
        >
          <UserAvatar
            formData={formData}
            isDropdownOpen={isDropdownOpen}
            setIsDropdownOpen={setIsDropdownOpen}
            router={router}
            handleSignOut={handleSignOut}
            t={t}
          />
        </div>
      </div>
    </>
  );
}

const SectionTitle = ({ title }: { title: string }) => (
  <div className="py-2 px-3 ml-5">
    <h2 className="text-sm text-gray-500">{title}</h2>
  </div>
);

const NavItem = ({
  href,
  label,
  icon,
  isActive,
}: {
  href: string;
  label: string;
  icon: string;
  isActive: boolean;
}) => (
  <Link
    href={href}
    className={`flex items-center p-3 rounded-md no-underline ${
      isActive ? "text-white bg-blue-900" : "text-gray-700 hover:bg-gray-100"
    }`}
  >
    <div className="w-6 h-6 mr-3 flex items-center justify-center">{icon}</div>
    <span className="font-medium">{label}</span>
  </Link>
);

const UserAvatar = ({
  formData,
  isDropdownOpen,
  setIsDropdownOpen,
  router,
  handleSignOut,
  t,
}: any) => (
  <>
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
  </>
);
