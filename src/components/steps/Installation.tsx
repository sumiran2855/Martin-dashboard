import { useState } from "react";

interface AddFeature {
  selectedOption: string;
  setSelectedOption: (value: string) => void;
  partnerDetails: { name: string; mobile: string; email: string };
  setPartnerDetails: (details: any) => void;
  setupSuperSaver: boolean;
  setSetupSuperSaver: React.Dispatch<React.SetStateAction<any>>;
  facilityMethod: string;
  setFacilityMethod: (value: string) => void;
}

export default function StepThree({
  selectedOption,
  setSelectedOption,
  partnerDetails,
  setPartnerDetails,
  setupSuperSaver,
  setSetupSuperSaver,
  facilityMethod,
  setFacilityMethod,
}: AddFeature) {
  const handleCheckboxChange = () => {
    setSetupSuperSaver((prev: any) => !prev);
    if (setupSuperSaver) {
      setSelectedOption("");
      setPartnerDetails({ name: "", mobile: "", email: "" });
    }
  };

  const handleOptionChange = (value: string) => {
    setSelectedOption(value);

    if (value !== "local_partner") {
      setPartnerDetails({ name: "", mobile: "", email: "" });
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#082351DE] mb-2">Installation</h2>
      <p className="text-gray-600 mb-6">
        To start saving money on electricity, new software needs to be installed
        on your system. This software is developed by EC Power and ensures
        optimal performance while providing explanations on its benefits. The
        pricing for this service may vary depending on the plan. See the price
        overview here.
      </p>

      <div className="flex items-center space-x-3 py-4">
        <input
          type="checkbox"
          checked={setupSuperSaver}
          onChange={handleCheckboxChange}
          className="w-5 h-5 cursor-pointer"
        />
        <label
          htmlFor="serviceProvider"
          className="text-[#082351DE] text-lg font-semibold"
        >
          Do you want to set up SuperSaverX?
        </label>
      </div>

      {setupSuperSaver && (
        <div className="bg-white px-6 py-4 rounded-lg mb-6 border border-gray-200">
          <div className="p-4 rounded-lg mb-4">
            <h2 className="text-lg font-semibold text-[#082351DE] mb-4">
              Setup of the SuperSaverX Solution
            </h2>
            <div className="space-y-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="installation"
                  value="service_check"
                  checked={selectedOption === "service_check"}
                  onChange={(e) => handleOptionChange(e.target.value)}
                  className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-gray-700">At next service check</span>
              </label>

              <div className="space-y-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="installation"
                    value="local_partner"
                    checked={selectedOption === "local_partner"}
                    onChange={(e) => handleOptionChange(e.target.value)}
                    className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">Local partner</span>
                </label>

                {selectedOption === "local_partner" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-gray-300 p-4 rounded-lg">
                    <input
                      type="text"
                      placeholder="Name"
                      value={partnerDetails.name}
                      onChange={(e) =>
                        setPartnerDetails({
                          ...partnerDetails,
                          name: e.target.value,
                        })
                      }
                      className="p-2 border rounded-md w-full"
                    />
                    <input
                      type="text"
                      placeholder="Mobile"
                      value={partnerDetails.mobile}
                      onChange={(e) =>
                        setPartnerDetails({
                          ...partnerDetails,
                          mobile: e.target.value,
                        })
                      }
                      className="p-2 border rounded-md w-full"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={partnerDetails.email}
                      onChange={(e) =>
                        setPartnerDetails({
                          ...partnerDetails,
                          email: e.target.value,
                        })
                      }
                      className="p-2 border rounded-md w-full col-span-2"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
