import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import BarChart from "../barChart";
import { useRouter } from "next/navigation";

export default function EditFacilities() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  return (
    <>
      <div className="flex-1 overflow-auto">
        <div className=" px-6 py-4">
          <div className="flex flex-col">
            <Link
              href="/admin/facilities"
              className="flex items-center gap-2 text-lg font-medium text-blue-600 no-underline transition-all duration-200 hover:text-blue-800 mb-4"
            >
              <div className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition">
                <ArrowLeft size={20} className="text-blue-600" />
              </div>
              <span className="text-xl">Back</span>
            </Link>
          </div>
          <h1 className="text-2xl font-semibold text-gray-800 ml-6">
            Edit Facilities
          </h1>
        </div>
        <div className="flex-1 overflow-auto px-6 py-2 mx-4">
          <div className="bg-white px-6 py-1 rounded-lg mb-6 border border-gray-200">
            <div className="p-6 rounded-lg mb-6">
              <h2 className="text-lg text-[#082351DE] font-semibold mb-4">
                System Costs
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-1">
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    Service Costs for Operating XRGI®
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="serviceCost"
                      defaultValue="5.75"
                      className="p-3 border border-gray-300 rounded-lg w-full  focus:ring-2 focus:ring-blue-300"
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
                      defaultValue="0.0765"
                      className="p-3 border border-gray-300 rounded-lg w-full  focus:ring-2 focus:ring-blue-300"
                    />
                  </div>

                  <div className="relative">
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      Select if VAT can be Deducted
                    </label>
                    <div className="relative">
                      <select
                        className="appearance-none p-3 border border-gray-300 rounded-lg w-full  focus:ring-2 focus:ring-blue-300 pr-10 cursor-pointer"
                        defaultValue="Ja"
                      >
                        <option>Ja</option>
                        <option>Nej</option>
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
                    <select className="appearance-none p-3 border border-gray-300 rounded-lg w-full bg-white focus:ring-2 focus:ring-blue-300 pr-10 cursor-pointer">
                      <option>Select gas type</option>
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
                    Enter the annual electricity consumption when purchasing
                    from the grid
                  </label>
                  <input
                    type="text"
                    name="kWh"
                    placeholder="kWh"
                    className="p-3 border border-gray-300 rounded-lg w-full bg-white focus:ring-2 focus:ring-blue-300"
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
                  />
                  <span className="text-gray-500 text-xs mt-1 block">
                    Tariffs, taxes, etc., excl. flexible price
                  </span>
                </div>
              </div>
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
        </div>

        <button
          className="bg-blue-500 text-white hover:bg-blue-800 px-6 py-2 rounded-md transition ml-auto block mb-10 mr-4 sm:mr-6 md:mr-12 w-full sm:w-auto"
          onClick={() => setIsOpen(true)}
        >
          Save Changes
        </button>

        {isOpen && (
          <div className="fixed inset-0 bg-opacity-30 flex backdrop-blur-sm items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96 text-center">
              <h2 className="text-lg font-semibold text-gray-900">
                Do you want to save the changes?
              </h2>
              <p className="text-gray-600 mt-2">
                Changes have been made to this facility. Do you want to save or
                discard them?
              </p>

              <div className="flex justify-between mt-6">
                <button
                  onClick={() => setIsOpen(false)}
                  className="border border-gray-400 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-100 transition"
                >
                  Discard
                </button>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    router.push("/admin/facilities");
                  }}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-800 transition"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
