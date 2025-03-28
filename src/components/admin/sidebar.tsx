import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { getProfile } from "@/controller/companyProfile/createProfile";
interface User {
  userId: string[];
}

export default function AdminSidebar({ userId = [] }: User) {
  const params = useParams();
  const facilityId = params.facilityId || "";
  const id = params.id || "";

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
                  `/admin/user/${userId}`,
                  `/admin/user/plantDetail/${facilityId}`,
                  `/admin/user/editFacilities/${id}`
                ].includes(pathname)
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
              href="/subscription"
              aria-disabled="true"
              onClick={(e) => e.preventDefault()}
              className={`flex items-center p-3 rounded-md no-underline cursor-not-allowed ${
                pathname === "/subscription"
                  ? "text-white bg-blue-900"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <div className="w-6 h-6 mr-3 flex items-center justify-center">
              💳
              </div>
              <span>Subscription</span>
            </Link>

            <Link
              href="/service"
              aria-disabled="true"
              onClick={(e) => e.preventDefault()}
              className={`flex items-center p-3 rounded-md no-underline cursor-not-allowed ${
                pathname === "/service"
                  ? "text-white bg-blue-900"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <div className="w-6 h-6 mr-3 flex items-center justify-center">
              🔧
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
