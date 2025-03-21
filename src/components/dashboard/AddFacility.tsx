import { useState } from "react";
import BarChart from "../barChart";
import GenericModal from "../modals/genericPopup";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useCreateFacility } from "@/controller/facility/createFacility";
import TermsModal from "../modals/acceptTerms";
import { termsText } from "./staticData/Data";

function AddFacility() {
  const router = useRouter();
  const [isChecked, setIsChecked] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const { stepTwoFormData, setStepTwoFormData, handleCreateFacility } =
    useCreateFacility();

  const [selectedModel, setSelectedModel] = useState(
    stepTwoFormData.model || ""
  );
  const [VATDeduction, setVATDeduction] = useState(
    stepTwoFormData.VATDeduction || "Yes"
  );
  const [selectGasType, setSelectGasType] = useState(
    stepTwoFormData.gasType || ""
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStepTwoFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "model") {
      setSelectedModel(value);
      setStepTwoFormData((prev: any) => ({ ...prev, model: value }));
    } else if (name === "VATDeduction") {
      setVATDeduction(value);
      setStepTwoFormData((prev: any) => ({ ...prev, VATDeduction: value }));
    } else if (name === "gasType") {
      setSelectGasType(value);
      setStepTwoFormData((prev: any) => ({ ...prev, gasType: value }));
    }
  };

  // term and condition
  const [isTermsOpen, setTermsOpen] = useState(false);
  const onSubmit = async () => {
    setTermsOpen(true);
  };

  const handleAcceptTerms = async () => {
    setTermsOpen(false);

    const DaSigned = isChecked;
    const installed = isInstalled;


    const success = await handleCreateFacility(DaSigned,installed);
    if (success) {
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="bg-white p-10 rounded-lg shadow w-full max-w-7xl my-10 mx-auto">
        <div className="flex flex-col">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-lg font-medium text-blue-600 no-underline transition-all duration-200 hover:text-blue-800 mb-4"
          >
            <div className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition">
              <ArrowLeft size={20} className="text-blue-600" />
            </div>
            <span className="text-xl">Back</span>
          </Link>
        </div>
        <h2 className="text-2xl font-bold text-[#082351DE] mb-2">
          Register Your XRGI System
        </h2>
        <p className="text-gray-600 mb-6">
          We have now created a login for you and your company. If you do not
          have the system details, you can always return later.
        </p>

        <div className="bg-white px-6 py-1 rounded-lg mb-6 border border-gray-200">
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
                    value={selectedModel}
                    onChange={handleChangeSelect}
                    className="appearance-none bg-white p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-300 pr-10 cursor-pointer"
                  >
                    <option value="">Select a Model</option>
                    <option>XRGI® 9-FORD</option>
                    <option>XRGI® 9</option>
                    <option>XRGI® 6 LOWNOX</option>
                    <option>XRGI® 6</option>
                    <option>XRGI® 25</option>
                    <option>XRGI® 20</option>
                    <option>XRGI® 19</option>
                    <option>XRGI® 17BIO</option>
                    <option>XRGI® 17</option>
                    <option>XRGI® 15BIO</option>
                    <option>XRGI® 15 LOWNOX</option>
                    <option>XRGI® 15</option>
                    <option>XRGI® 13BIO</option>
                    <option>XRGI® 13</option>
                    <option>XRGI® 12</option>
                    <option>XRGI 9 FORD</option>
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

        <div className="bg-white px-6 py-1 rounded-lg mb-6 border border-gray-200">
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
            </div>
          </div>
        </div>

        <div className="bg-white px-6 py-1 rounded-lg mb-6 border border-gray-200">
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

              <div className="md:col-span-1">
                <input
                  type="text"
                  name="serviceProviderPhone"
                  placeholder="Phone Number"
                  className="p-3 border rounded-lg w-full"
                  value={stepTwoFormData.serviceProviderPhone}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white px-6 py-1 rounded-lg mb-6 border border-gray-200">
          <div className=" p-6 rounded-lg mb-6">
            <h2 className="text-lg text-[#082351DE] font-semibold mb-4">
              System Costs
            </h2>
            <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-3 rounded-md flex items-start space-x-3 mb-4">
              <svg
                className="w-5 h-5 text-blue-500 mt-0.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 16h-1v-4h-1m0-4h.01M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z"
                />
              </svg>
              <p className="text-sm mb-[-5]">
                We have pre-filled some of the fields. You can edit them if the
                entries do not match your usage.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-1">
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Service Costs for Operating XRGI®
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="serviceCost"
                    className="p-3 border border-gray-300 rounded-lg w-full bg-[#F2F6FC] focus:ring-2 focus:ring-blue-300"
                    value={stepTwoFormData.serviceCost}
                    onChange={handleChange}
                  />
                  <span className="absolute inset-y-0 right-3 flex items-center text-blue-500 cursor-pointer">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 text-blue-500"
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
                <p className="text-gray-500 text-sm mt-1 ml-3">
                  Your service costs can be found in your contract for the
                  system.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full md:col-span-2">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    Enter VAT Deduction Percentage
                  </label>
                  <input
                    type="text"
                    name="vat"
                    className="p-3 border border-gray-300 rounded-lg w-full bg-[#F2F6FC] focus:ring-2 focus:ring-blue-300"
                    value={stepTwoFormData.vat}
                    onChange={handleChange}
                  />
                </div>

                <div className="relative">
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    Select if VAT can be Deducted
                  </label>
                  <div className="relative">
                    <select
                      name="VATDeduction"
                      value={VATDeduction}
                      onChange={handleChangeSelect}
                      className="appearance-none p-3 border border-gray-300 rounded-lg w-full bg-[#F2F6FC] focus:ring-2 focus:ring-blue-300 pr-10 cursor-pointer"
                    >
                      <option>Yes</option>
                      <option>No</option>
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
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-10 rounded-lg mb-6 border border-gray-200">
          <div className="text-[#082351DE] rounded-lg mb-6">
            <h2 className="text-lg font-semibold mb-4">Gas Consumption</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  What type of gas is supplied to the XRGI system?
                </label>
                <div className="relative">
                  <select
                    name="gasType"
                    value={selectGasType}
                    onChange={handleChangeSelect}
                    className="appearance-none p-3 border border-gray-300 rounded-lg w-full bg-white focus:ring-2 focus:ring-blue-300 pr-10 cursor-pointer"
                  >
                    <option>Select gas type</option>
                    <option>Naturel Gas</option>
                    <option>Hydrogen</option>
                  </select>
                  <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
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
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  What is the annual gas consumption?
                </label>
                <input
                  type="text"
                  name="m3"
                  placeholder="m³"
                  className="p-3 border border-gray-300 rounded-lg w-full bg-white focus:ring-2 focus:ring-blue-300"
                  value={stepTwoFormData.m3}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Enter the sum of consumption-independent costs
                </label>
                <input
                  type="text"
                  name="independentDKK"
                  placeholder="DKK"
                  className="p-3 border border-gray-300 rounded-lg w-full bg-white focus:ring-2 focus:ring-blue-300"
                  value={stepTwoFormData.independentDKK}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Enter the sum of consumption-dependent costs
                </label>
                <input
                  type="text"
                  name="dependentDKK"
                  placeholder="DKK"
                  className="p-3 border border-gray-300 rounded-lg w-full bg-white focus:ring-2 focus:ring-blue-300"
                  value={stepTwoFormData.dependentDKK}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-10 rounded-lg mb-6 border border-gray-200">
          <div className="text-[#082351DE] rounded-lg mb-6">
            <h2 className="text-lg font-semibold mb-4">
              Electricity Consumption
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Enter the annual electricity consumption when purchasing from
                  the grid
                </label>
                <input
                  type="text"
                  name="kWh"
                  placeholder="kWh"
                  className="p-3 border border-gray-300 rounded-lg w-full bg-white focus:ring-2 focus:ring-blue-300"
                  value={stepTwoFormData.kWh}
                  onChange={handleChange}
                />
              </div>

              <div></div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Enter the sum of consumption-independent costs
                </label>
                <input
                  type="text"
                  name="electricityIndependentDKK"
                  placeholder="DKK"
                  className="p-3 border border-gray-300 rounded-lg w-full bg-white focus:ring-2 focus:ring-blue-300"
                  value={stepTwoFormData.electricityIndependentDKK}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Enter the sum of consumption-dependent costs
                </label>
                <input
                  type="text"
                  name="electricityDependentDKK"
                  placeholder="DKK"
                  className="p-3 border border-gray-300 rounded-lg w-full bg-white focus:ring-2 focus:ring-blue-300"
                  value={stepTwoFormData.electricityDependentDKK}
                  onChange={handleChange}
                />
                <span className="text-gray-500 text-xs mt-1 block">
                  Tariffs, taxes, etc., excl. flexible price
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-10 rounded-lg mb-6 border border-gray-200">
          <div className="flex items-center gap-4 ">
            <input
              type="checkbox"
              id="installSystem"
              checked={isInstalled}
              onChange={() => setIsInstalled(!isInstalled)}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 cursor-pointer"
            />
            <label
              htmlFor="installSystem"
              className="text-gray-800 text-sm font-medium"
            >
              Is your system installed?
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

          {/* Chart Section */}
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

        <div className="flex gap-4">
          <button
            onClick={() => onSubmit()}
            className="bg-blue-500 hover:bg-blue-800 text-white px-6 py-3 rounded-md transition ml-auto"
          >
            Add Facility
          </button>
        </div>
      </div>

      <TermsModal
        isOpen={isTermsOpen}
        onClose={() => setTermsOpen(false)}
        title="Terms and Conditions"
        termsContent={termsText}
        onAccept={handleAcceptTerms}
        isChecked={isChecked}
        setIsChecked={setIsChecked}
      />
    </div>
  );
}

export default AddFacility;
