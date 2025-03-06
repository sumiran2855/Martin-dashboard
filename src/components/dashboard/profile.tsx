import { useRouter } from "next/navigation";
import { useState } from "react";
import Modal from "../modals/modal";
import ChangePassword from "../modals/changePassword";

export default function profileDetail() {
  const [isOpen, setIsOpen] = useState(false);
  const [changePassword, setChangePassword] = useState(false);

  const router = useRouter();
  return (
    <>
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="bg-white shadow-md rounded-lg">
            <div className="p-6 border-b flex justify-between items-center">
              <h1 className="text-2xl font-semibold text-gray-800">Profile</h1>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                onClick={() => setChangePassword(true)}
              >
                Change Password
              </button>
            </div>

            {/* Business Information Section */}
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                Business Information
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Business Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter business name"
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    CVR Number
                  </label>
                  <input
                    type="text"
                    placeholder="Enter CVR number"
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    placeholder="Enter address"
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      placeholder="Enter postal code"
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      House Number
                    </label>
                    <input
                      type="text"
                      placeholder="Enter house number"
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Floor
                    </label>
                    <input
                      type="text"
                      placeholder="Enter floor number"
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    placeholder="Enter city"
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    placeholder="Enter country"
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
              </div>
            </div>

            {/* Contact Person Section */}
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                Contact Person
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter first name"
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter last name"
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Email
                  </label>
                  <input
                    type="text"
                    placeholder="Enter email"
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div className="flex items-end space-x-2">
                  <div className="w-24 md:w-28">
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Mobile
                    </label>
                    <div className="relative">
                      <select className="w-full h-10 md:h-12 px-3 border rounded-md bg-white cursor-pointer appearance-none">
                        <option
                          className="p-2 text-gray-700 bg-white"
                          value="+45"
                        >
                          🇩🇰 +45
                        </option>
                        <option
                          className="p-2 text-gray-700 bg-white"
                          value="+1"
                        >
                          🇺🇸 +1
                        </option>
                        <option
                          className="p-2 text-gray-700 bg-white"
                          value="+44"
                        >
                          🇬🇧 +44
                        </option>
                        <option
                          className="p-2 text-gray-700 bg-white"
                          value="+91"
                        >
                          🇮🇳 +91
                        </option>
                      </select>
                    </div>
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Enter mobile number"
                      className="w-full h-10 md:h-12 px-3 border rounded-md"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Save Changes Button */}
            <div className="p-6 border-t">
              <button
                className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                onClick={() => setIsOpen(true)}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>

        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Do you want to save the changes?"
          message="Changes have been made to your profile. Do you want to save or
                discard them?"
          primaryButton="Save"
          onPrimaryClick={() => router.push("/profile")}
          secondaryButton="Discard"
          onSecondaryClick={() => router.push("/profile")}
        />

        {changePassword && (
          <ChangePassword setChangePassword={setChangePassword} />
        )}
      </div>
    </>
  );
}
