import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Modal from "../modals/modal";
import ChangePassword from "../modals/changePassword";
import { createProfile, getCustomer } from "@/services/stepperServices";
import { getProfile } from "@/controller/companyProfile/createProfile";
import { countryCodes } from "./staticData/Data";

export default function profileDetail() {
  const [isOpen, setIsOpen] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const { formData, setFormData, loading } = getProfile();

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const updateProfile = async () => {
    const token = localStorage.getItem("token");
    const IdToken = localStorage.getItem("IdToken");
    if (!token || !IdToken) {
      console.error("Authorization token missing.");
      return;
    }

    const payload = {
      companyInfo: {
        name: formData.companyName,
        cvr_number: formData.cvrNumber,
        address: formData.address,
        city: formData.city,
        postal_code: formData.postal_code,
        email: formData.email,
        phone: formData.phone,
      },
      contactPerson: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        personalCountryCode: formData.personalCountryCode,
        personalEmail: formData.personalEmail,
        personalPhone: formData.personalPhone,
      },
    };

    try {
      await createProfile(token, IdToken, payload);
      console.log("Profile updated successfully");
      setIsOpen(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const router = useRouter();
  return (
    <>
      {loading ? (
        <div className="fixed inset-0 flex justify-center items-center bg-white bg-opacity-75 z-50">
          <div className="loader animate-spin rounded-full border-4 border-gray-300 border-t-gray-900 h-12 w-12"></div>
        </div>
      ) : (
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            <div className="bg-white shadow-md rounded-lg">
              <div className="p-6 border-b flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-gray-800">
                  Profile
                </h1>
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
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
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
                      name="cvrNumber"
                      value={formData.cvrNumber}
                      onChange={handleChange}
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
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter address"
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        name="postal_code"
                        value={formData.postal_code}
                        onChange={handleChange}
                        placeholder="Enter postal code"
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        placeholder="Enter city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>
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
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
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
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
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
                      name="personalEmail"
                      value={formData.personalEmail}
                      onChange={handleChange}
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
                        <select
                          name="personalCountryCode"
                          value={formData.personalCountryCode}
                          onChange={handleChange}
                          className="w-full h-10 md:h-12 px-3 border rounded-md bg-white cursor-pointer appearance-none"
                        >
                          {countryCodes.map((country) => (
                            <option
                              key={country.code}
                              className="p-2 text-gray-700 bg-white hover:bg-gray-100"
                              value={country.code}
                            >
                              {country.flag} {country.code}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        name="personalPhone"
                        value={formData.personalPhone}
                        onChange={handleChange}
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
            onPrimaryClick={updateProfile}
            secondaryButton="Discard"
            onSecondaryClick={() => router.push("/profile")}
          />

          {changePassword && (
            <ChangePassword setChangePassword={setChangePassword} />
          )}
        </div>
      )}
    </>
  );
}
