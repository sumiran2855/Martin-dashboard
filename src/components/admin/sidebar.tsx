import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { getProfile } from "@/controller/companyProfile/createProfile";

export default function AdminSidebar({ facilityId }: { facilityId: string }) {
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
          <h2 className="text-sm text-gray-500 mb-[-10]">Main Menu</h2>
        </div>

        <nav className="px-2">
          <div className="space-y-1">
            <Link
              href="/admin"
              className={`flex items-center p-3 rounded-md no-underline ${
                [
                  "/admin",
                ].includes(pathname)
                  ? "text-white bg-blue-900"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <div className="w-6 h-6 mr-3 flex items-center justify-center">
                <svg
                  className={`w-6 h-6 ${
                    [
                      "/admin",
                    ].includes(pathname)
                      ? "text-yellow-400"
                      : "text-gray-600"
                  }`}
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M13 9h5.5L13 3.5V9M6 2h8l6 6v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4c0-1.11.89-2 2-2m9 16v-2H6v2h9m3-4v-2H6v2h12z" />
                </svg>
              </div>
              <span className="font-medium">Users</span>
            </Link>

            <Link
              href="/subscription"
              className={`flex items-center p-3 rounded-md no-underline ${
                pathname === "/subscription"
                  ? "text-white bg-blue-900"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <div className="w-6 h-6 mr-3 flex items-center justify-center">
                <svg
                  className={`w-6 h-6 ${
                    pathname === "/subscription"
                      ? "text-yellow-400"
                      : "text-gray-600"
                  }`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 3" />
                </svg>
              </div>
              <span>Subscription</span>
            </Link>

            <Link
              href="/service"
              className={`flex items-center p-3 rounded-md no-underline ${
                pathname === "/service"
                  ? "text-white bg-blue-900"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <div className="w-6 h-6 mr-3 flex items-center justify-center">
                <svg
                  className={`w-6 h-6 ${
                    pathname === "/service"
                      ? "text-yellow-400"
                      : "text-gray-600"
                  }`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
                </svg>
              </div>
              <span>Service</span>
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
  );
}
