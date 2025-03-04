import { ChevronDown } from "lucide-react";

export default function AdminSidebar() {
  return (
    <div className="w-64 bg-white border-r border-gray-200 shadow-sm flex flex-col h-screen">
      <div className="flex-1">
        <div className="py-4 px-3 ml-5">
          <h2 className="text-sm text-gray-500 mb-[-10]">Main Menu</h2>
        </div>

        <nav className="px-2">
          <div className="space-y-1">
            <a
              href="#"
              className="flex items-center p-3 text-white bg-blue-900 rounded-md"
            >
              <div className="w-6 h-6 mr-3 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-yellow-400"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M13 9h5.5L13 3.5V9M6 2h8l6 6v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4c0-1.11.89-2 2-2m9 16v-2H6v2h9m3-4v-2H6v2h12z" />
                </svg>
              </div>
              <span className="font-medium">Facilities</span>
            </a>

            <a
              href="#"
              className="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-md"
            >
              <div className="w-6 h-6 mr-3 flex items-center justify-center text-gray-600">
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M2 22h20V2M22 16L12 6l-8 8" />
                </svg>
              </div>
              <span>Usage</span>
            </a>

            <a
              href="#"
              className="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-md"
            >
              <div className="w-6 h-6 mr-3 flex items-center justify-center text-gray-600">
                <svg
                  className="w-6 h-6"
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
            </a>

            <a
              href="#"
              className="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-md"
            >
              <div className="w-6 h-6 mr-3 flex items-center justify-center text-gray-600">
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
                </svg>
              </div>
              <span>Service</span>
            </a>
          </div>
        </nav>

        {/* Preferences Section */}
        <div className="mt-8 p-4 ml-5 border-t border-gray-200 mt-10">
          <h2 className="text-sm text-gray-500 mb-[-10]">Præferencer</h2>
        </div>

        <nav className="px-2">
          <div className="space-y-1">
            <a
              href="#"
              className="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-md"
            >
              <div className="w-6 h-6 mr-3 flex items-center justify-center text-gray-600">
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <span>Settings</span>
            </a>

            <a
              href="#"
              className="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-md"
            >
              <div className="w-6 h-6 mr-3 flex items-center justify-center text-gray-600">
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 17v-2M12 9V7" />
                </svg>
              </div>
              <span>Help Center</span>
            </a>
          </div>
        </nav>
      </div>

      {/* User Profile at Bottom */}
      <div className="p-4 border-t border-gray-200 mt-auto">
        <div className="flex items-center cursor-pointer">
          <div className="flex items-center justify-center w-10 h-10 mr-3 text-white bg-blue-700 rounded">
            CN
          </div>
          <div className="mt-2">
            <span className="text-sm font-medium">Christian Neve</span>
            <p className="text-xs text-gray-500 mt-[-2]">EC Power</p>
          </div>
          <button className="ml-auto text-gray-400">
            <ChevronDown size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
