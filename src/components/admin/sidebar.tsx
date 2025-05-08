import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { getProfile } from "@/controller/companyProfile/createProfile";
interface User {
  userId: string[];
}

export default function AdminSidebar({ userId = [] }: User) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  const handleSignOut = () => {
    localStorage.clear();
    router.push("/");
  };

  const pathname = usePathname();

  const { formData } = getProfile();
  const [menuOpen, setMenuOpen] = useState(false);
  const isActive = (path: string) => pathname.startsWith(path);
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
        <div className="flex-1">
          <div className="py-4 px-3 ml-5">
            <h2 className="text-sm text-gray-500 mb-[-10]">Main Menu</h2>
          </div>

          <nav className="px-2">
            <div className="space-y-1">
              <Link
                href="/admin"
                className={`flex items-center p-3 rounded-md no-underline ${
                  isActive("/admin") &&
                  !isActive("/admin/subscription") &&
                  !isActive("/admin/services") &&
                  !isActive("/admin/contact")
                    ? "text-white bg-blue-900"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <div className="w-6 h-6 mr-3 flex items-center justify-center">
                  👤
                </div>
                <span className="font-medium">Users</span>
              </Link>

              <Link
                href="/admin/subscription"
                className={`flex items-center p-3 rounded-md no-underline ${
                  isActive("/admin/subscription")
                    ? "text-white bg-blue-900"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <div className="w-6 h-6 mr-3 flex items-center justify-center">
                  💳
                </div>
                <span className="font-medium">Subscription</span>
              </Link>

              <Link
                href="/admin/services"
                className={`flex items-center p-3 rounded-md no-underline ${
                  isActive("/admin/services")
                    ? "text-white bg-blue-900"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <div className="w-6 h-6 mr-3 flex items-center justify-center">
                  🔧
                </div>
                <span className="font-medium">Service</span>
              </Link>

              <Link
                href="/admin/contact"
                className={`flex items-center p-3 rounded-md no-underline ${
                  isActive("/admin/contact")
                    ? "text-white bg-blue-900"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <div className="w-6 h-6 mr-3 flex items-center justify-center">
                  📩
                </div>
                <span className="font-medium">Contact EC Power</span>
              </Link>
            </div>
          </nav>
        </div>

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
                {" "}
                {formData.firstName} {formData.lastName}
              </span>
              <p className="text-xs text-gray-500 mt-[-2]">
                {formData.companyName}
              </p>
            </div>
            <button className="ml-auto text-gray-400">
              <ChevronDown size={16} />
            </button>
          </div>

          {isDropdownOpen && (
            <div className="mt-2 bg-white py-2">
              <button
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200 rounded"
                onClick={() => router.push("/admin/create-admin")}
              >
                Create new Admin
              </button>
              <button
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200 rounded"
                onClick={() => router.push("/admin/profile")}
              >
                Profile
              </button>
              <button
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200 rounded"
                onClick={handleSignOut}
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
