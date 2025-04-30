import GenericModal from "@/components/modals/genericPopup";
import { useState } from "react";
import BarChart from "../barChart";
import { countryCodes } from "../dashboard/staticData/Data";

interface ValidateFormProps {
  stepTwoFormData: any;
  setStepTwoFormData: React.Dispatch<React.SetStateAction<any>>;
  isInstalled: boolean;
  setIsInstalled: React.Dispatch<React.SetStateAction<any>>;
  hasServiceProvider: boolean;
  setHasServiceProvider: React.Dispatch<React.SetStateAction<any>>;
  hasPerformanceReport: boolean;
  setHasPerformanceReport: React.Dispatch<React.SetStateAction<any>>;
}

export default function CreateFacility({
  stepTwoFormData,
  setStepTwoFormData,
  isInstalled,
  setIsInstalled,
  hasServiceProvider,
  setHasServiceProvider,
  hasPerformanceReport,
  setHasPerformanceReport,
}: ValidateFormProps) {
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState(
    stepTwoFormData.model || ""
  );

  const handleCheckboxChange = (e: any) => {
    const { name, checked } = e.target;
    if (name === "performanceReport") {
      setHasPerformanceReport(checked);
      setStepTwoFormData((prev: any) => ({
        ...prev,
        performanceReport: checked,
      }));
    }
  };

  const handleRadioChange = () => {
    setHasServiceProvider((prev: boolean) => !prev);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | any) => {
    const { name, value } = e.target;
    setStepTwoFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "model") {
      setSelectedModel(value);
      setStepTwoFormData((prev: any) => ({ ...prev, model: value }));
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#082351DE] mb-2">
        Register Your XRGI System
      </h2>
      <p className="text-gray-600 mb-6">
        We have now created a login for you and your company. If you do not have
        the system details, you can always return later.
      </p>
      <div className="bg-white px-6 py-1 rounded-lg mb-6 border border-gray-200 max-md:px-0">
        <div className="p-6 rounded-lg mb-6">
          <h2 className="text-lg font-semibold text-[#082351DE] mb-4">
            Register a System
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                name="systemName"
                placeholder="Name the system"
                className="p-3 border rounded-lg w-full"
                value={stepTwoFormData.systemName}
                onChange={handleChange}
              />
              <label className="text-gray-500 text-sm mt-1 block ml-3">
                Example: “System in basement 01”
              </label>
            </div>

            <div>
              <div className="relative">
                <select
                  name="model"
                  value={stepTwoFormData.model}
                  onChange={handleChangeSelect}
                  className="appearance-none bg-white p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-300 pr-10 cursor-pointer"
                >
                  <option value="">Select a Model</option>
                  <option>XRGI® 6 LOWNOX</option>
                  <option>XRGI® 6</option>
                  <option>XRGI® 9</option>
                  <option>XRGI® 15</option>
                  <option>XRGI® 15 BIO</option>
                  <option>XRGI® 15 LOWNOX</option>
                  <option>XRGI® 20</option>
                  <option>XRGI® 25</option>
                </select>
                <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-gray-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 9l6 6 6-6"></path>
                  </svg>
                </span>
              </div>
              <label className="text-gray-500 text-sm mt-1 block ml-3">
                Model name is on your registration form
              </label>
            </div>

            <div className="md:col-span-1 relative">
              <label className="block text-gray-700 text-sm font-medium mb-1">
                XRGI ID Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="XRGINumber"
                  placeholder="Enter XRGI ID number"
                  className="p-3 border border-gray-300 rounded-lg w-full pr-10  focus:ring-2 focus:ring-blue-300"
                  value={stepTwoFormData.XRGINumber}
                  onChange={handleChange}
                />
                <span
                  className="absolute inset-y-0 right-3 flex items-center text-blue-500 cursor-pointer"
                  onClick={() => setPopupOpen(true)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 16h.01M12 12a2 2 0 1 0-2-2"
                    />
                  </svg>
                </span>
              </div>
              <p className="text-gray-500 text-sm mt-1">
                The ID number is 8 digits and located on the side of the
                machine.
              </p>
            </div>
          </div>
        </div>
        <GenericModal show={isPopupOpen} onHide={() => setPopupOpen(false)} />
      </div>

      <div className="bg-white px-6 py-1 rounded-lg mb-6 border border-gray-200 max-md:px-0">
        <div className="p-6 rounded-lg mb-6">
          <h2 className="text-lg text-[#082351DE] font-semibold mb-4">
            System Location
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                name="address"
                placeholder="Address"
                className="p-3 border rounded-lg w-full"
                value={stepTwoFormData.address}
                onChange={handleChange}
              />
              <label className="text-gray-500 text-sm mt-1 block ml-3">
                Enter the address of this system's location
              </label>
            </div>

            <div>
              <input
                type="text"
                name="postalCode"
                placeholder="Postal Code"
                className="p-3 border rounded-lg w-full"
                value={stepTwoFormData.postalCode}
                onChange={handleChange}
              />
            </div>

            <div className="md:col-span-1">
              <input
                type="text"
                name="city"
                placeholder="City"
                className="p-3 border rounded-lg w-full"
                value={stepTwoFormData.city}
                onChange={handleChange}
              />
            </div>
            <div className="md:col-span-1">
              <input
                type="text"
                name="country"
                placeholder="Country"
                className="p-3 border rounded-lg w-full"
                value={stepTwoFormData.country}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white px-6 py-1 rounded-lg mb-6 border border-gray-200 max-md:px-0">
        <div className="flex items-center space-x-3 py-4">
          <input
            type="checkbox"
            id="serviceProvider"
            name="serviceProvider"
            checked={hasServiceProvider}
            onChange={handleRadioChange}
            className="w-5 h-5 cursor-pointer"
          />
          <label
            htmlFor="serviceProvider"
            className="text-[#082351DE] text-lg font-semibold"
          >
            I want to add my service provider
          </label>
        </div>

        {hasServiceProvider && (
          <div className="p-6 rounded-lg mb-6">
            <h2 className="text-lg text-[#082351DE] font-semibold mb-4">
              Service Provider
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  name="serviceProviderName"
                  placeholder="Name of service provider"
                  className="p-3 border rounded-lg w-full"
                  value={stepTwoFormData.serviceProviderName}
                  onChange={handleChange}
                />
                <label className="text-gray-500 text-sm mt-1 block ml-3">
                  Enter the name of the service provider
                </label>
              </div>

              <div>
                <input
                  type="text"
                  name="serviceProviderMail"
                  placeholder="Email Address"
                  className="p-3 border rounded-lg w-full"
                  value={stepTwoFormData.serviceProviderMail}
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center w-full gap-2">
                <div className="relative w-1/6">
                  <select
                    name="serviceProviderCountryCode"
                    value={stepTwoFormData.serviceProviderCountryCode}
                    onChange={handleChange}
                    className="p-3 w-full border rounded outline-none bg-white cursor-pointer appearance-none pr-6"
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

                <input
                  type="text"
                  name="serviceProviderPhone"
                  placeholder="Phone Number"
                  className="p-3 w-5/6 border rounded-lg outline-none"
                  value={stepTwoFormData.serviceProviderPhone}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white px-6 py-1 rounded-lg mb-6 border border-gray-200 max-md:px-0">
        <div className="flex items-center space-x-3 py-4">
          <input
            type="checkbox"
            id="performanceReport"
            name="performanceReport"
            checked={hasPerformanceReport}
            onChange={handleCheckboxChange}
            className="w-5 h-5 cursor-pointer"
          />
          <label
            htmlFor="performanceReport"
            className="text-[#082351DE] text-lg font-semibold"
          >
            I want to add a performance report
          </label>
        </div>

        {hasPerformanceReport && (
          <div className="bg-white p-10 rounded-lg mb-6">
            <div className="text-[#082351DE] rounded-lg mb-6">
              <h2 className="text-lg font-semibold mb-4">Performance report</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    Expected annual savings
                  </label>
                  <input
                    type="text"
                    name="annualSavings"
                    placeholder="Euro Pr. Year"
                    className="p-3 border border-gray-300 rounded-lg w-full bg-white focus:ring-2"
                    value={stepTwoFormData.annualSavings}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    Expected annual CO₂ savings
                  </label>
                  <input
                    type="text"
                    name="co2Savings"
                    placeholder="Tons Pr. year"
                    className="p-3 border border-gray-300 rounded-lg w-full bg-white focus:ring-2 "
                    value={stepTwoFormData.co2Savings}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    Expected operating hours per year
                  </label>
                  <input
                    type="text"
                    name="operatingHours"
                    placeholder="0-8763"
                    className="p-3 border border-gray-300 rounded-lg w-full bg-white focus:ring-2 "
                    value={stepTwoFormData.operatingHours}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    Industry
                  </label>
                  <select
                    name="industry"
                    className="p-3 border border-gray-300 rounded-lg w-full bg-white focus:ring-2 "
                    value={stepTwoFormData.industry}
                    onChange={handleChange}
                  >
                    <option value="" disabled>
                      Select a Industry
                    </option>
                    <option value="manufacturing">Hotel</option>
                    <option value="healthcare">School</option>
                    <option value="hospitality">Sport</option>
                    <option value="hospitality">Nursing home</option>
                    <option value="hospitality">Indrusty</option>
                    <option value="hospitality">Other</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white px-6 py-1 rounded-lg mb-6 border border-gray-200 max-md:px-0">
        <div className="flex items-center space-x-3 py-4">
          <input
            type="checkbox"
            id="installSystem"
            checked={isInstalled}
            onChange={() => setIsInstalled(!isInstalled)}
            className="w-5 h-5 cursor-pointer"
          />
          <label
            htmlFor="installSystem"
            className="text-[#082351DE] text-lg font-semibold"
          >
            Is your system installed ?
          </label>
        </div>
      </div>

      <div className="bg-white p-10 rounded-lg mb-6 border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg text-[#082351DE] font-semibold">
            Operation Example
          </h2>
          <span className="text-blue-500 cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 16h.01M12 12a2 2 0 1 0-2-2"
              />
            </svg>
          </span>
        </div>

        <div className="bg-[#F9FAFB] p-4 rounded-lg border border-gray-200">
          <BarChart />
        </div>

        <div className="flex justify-center space-x-6 mt-4 text-sm">
          <div className="flex items-center">
            <span className="w-3 h-3 bg-yellow-300 rounded-full inline-block mr-2"></span>
            <span className="text-gray-700">XRGI</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 bg-blue-900 rounded-full inline-block mr-2"></span>
            <span className="text-gray-700">Tariffs</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 bg-blue-400 rounded-full inline-block mr-2"></span>
            <span className="text-gray-700">Flex Price</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 bg-gray-300 rounded-full inline-block mr-2"></span>
            <span className="text-gray-700">VAT</span>
          </div>
        </div>
      </div>
    </div>
  );
}
