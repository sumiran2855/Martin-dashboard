import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import BarChart from "../barChart";
import { useRouter } from "next/navigation";
import Modal from "../modals/modal";
import { apiRequest } from "@/utils/apiClient";

interface Facility {
  facilityId?: string;
  location?: { address: string };
  name: string;
  modelNumber: string;
  xrgiID: string;
  SystemCostsInfo?: {
    service_Costs: string;
    VAT_Deduction_Percent: string;
    VAT_Deduction: string;
  };
  gas_Consumption?: {
    annual_gas_consumption_m3: string;
    xrgi_gas_type: string;
    gas_fixed_costs_dkk: string;
    gas_variable_costs_dkk: string;
  };
  electircity_Consumption?: {
    annual_grid_consumption_kwh: string;
    fixed_costs_dkk: string;
    variable_costs_dkk: string;
  };
  isInstalled:false,
  DaSigned:true
}

export default function EditFacilities({ facilityId }: { facilityId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const [facility, setFacility] = useState<Facility | null>(null);

  useEffect(() => {
    async function fetchFacility() {
      const token = localStorage.getItem("token") || "";
      const IdToken = localStorage.getItem("IdToken") || "";
      try {
        const response = await apiRequest(
          `get-facility?id=${facilityId}`,
          "GET",
          undefined,
          token,
          IdToken
        );
        if (!response.success || !response.data) {
          throw new Error("Failed to fetch facility data");
        }
        setFacility(response.data);
      } catch (error) {
        console.error("Error fetching facility details:", error);
      }
    }

    if (facilityId) {
      fetchFacility();
    }
  }, [facilityId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    

    setFacility((prev) => {
      if (!prev) return prev;

      const keys = name.split(".");
      let updatedFacility = { ...prev };
      let current: any = updatedFacility;

      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = value;

      return updatedFacility;
    });
  };

  async function handleSave() {
    const token = localStorage.getItem("token") || "";
    const IdToken = localStorage.getItem("IdToken") || "";

    try {
      const response = await apiRequest(
        `create-facility?id=${facilityId}`,
        "POST",
        facility ?? undefined,
        token,
        IdToken
      );

      if (!response.success)
        throw new Error("Failed to update facility details");

      router.push(`/dashboard/facilities/${facilityId}`);
    } catch (error) {
      console.error("Error updating facility:", error);
    }
  }

  return (
    <>
      <div className="flex-1 overflow-auto">
        <div className=" px-6 py-4">
          <div className="flex flex-col">
            <Link
              href={`/dashboard/facilities/${facilityId}`}
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
                      name="SystemCostsInfo.service_Costs"
                      // defaultValue="5.75" 
                      value={facility?.SystemCostsInfo?.service_Costs ?? ""}
                      onChange={handleChange}
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
                      name="SystemCostsInfo.VAT_Deduction_Percent"
                      // defaultValue="0.0765"
                      value={facility?.SystemCostsInfo?.VAT_Deduction_Percent ?? ""} 
                      onChange={handleChange}
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
                        // defaultValue="Ja"
                        name="SystemCostsInfo.VAT_Deduction"
                        value={facility?.SystemCostsInfo?.VAT_Deduction}
                        onChange={handleChange}
                      >
                        <option>Yes</option>
                        <option>No</option>
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
                    <select
                      name="gas_Consumption.xrgi_gas_type"
                      value={facility?.gas_Consumption?.xrgi_gas_type ?? ""}
                      onChange={handleChange}
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
                    name="gas_Consumption.annual_gas_consumption_m3"
                    value={facility?.gas_Consumption?.annual_gas_consumption_m3 ?? ""}
                    onChange={handleChange}
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
                    name="gas_Consumption.gas_fixed_costs_dkk"
                    value={facility?.gas_Consumption?.gas_fixed_costs_dkk}
                    onChange={handleChange}
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
                    name="gas_Consumption.gas_variable_costs_dkk"
                    value={facility?.gas_Consumption?.gas_variable_costs_dkk}
                    onChange={handleChange}
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
                    name="electircity_Consumption.annual_grid_consumption_kwh"
                    value={
                      facility?.electircity_Consumption
                        ?.annual_grid_consumption_kwh
                    }
                    onChange={handleChange}
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
                    name="electircity_Consumption.fixed_costs_dkk"
                    value={facility?.electircity_Consumption?.fixed_costs_dkk}
                    onChange={handleChange}
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
                    name="electircity_Consumption.variable_costs_dkk"
                    value={
                      facility?.electircity_Consumption?.variable_costs_dkk
                    }
                    onChange={handleChange}
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
          onClick={() => {
            setIsOpen(true);
          }}
        >
          Save Changes
        </button>

        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Do you want to save the changes?"
          message="Changes have been made to this facility. Do you want to save or
                discard them?"
          primaryButton="Save"
          onPrimaryClick={() => {
            handleSave();
            router.push("/dashboard/facilities/${facilityId}");
          }}
          secondaryButton="Discard"
          onSecondaryClick={() =>
            router.push("/dashboard/facilities/editFacilities")
          }
        />
      </div>
    </>
  );
}
