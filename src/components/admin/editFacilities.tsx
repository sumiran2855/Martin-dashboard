import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import BarChart from "../barChart";
import { useRouter } from "next/navigation";
import Modal from "../modals/modal";
import { apiRequest } from "@/utils/authHelper";
import GenericModal from "../modals/genericPopup";

interface Facility {
  facilityId?: string;
  location?: { address: string; postalCode: string; city: string };
  name: string;
  modelNumber: string;
  xrgiID: string;
  serviceProvider?: {
    name: string;
    mailAddress: string;
    phone: string;
  };
  hasPerformanceReport: boolean;
  performance_report?: {
    annualSavings: string;
    co2Savings: string;
    operatingHours: string;
    industry: string;
  };
  isInstalled: boolean;
}

export default function EditFacilities({
  facilityId,
}: {
  facilityId: string[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const [facility, setFacility] = useState<Facility | null>(null);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [hasServiceProvider, setHasServiceProvider] = useState(false);
  const [hasPerformanceReport, setHasPerformanceReport] = useState(false);

  const handleRadioChange = () => {
    setHasServiceProvider((prev) => !prev);
  };

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
          console.log("Failed to fetch facility data");
        }
        setFacility(response.data);
        setIsInstalled(response.data.isInstalled || false);
        const { serviceProvider } = response.data;
        if (
          serviceProvider &&
          serviceProvider.name &&
          serviceProvider.mailAddress &&
          serviceProvider.phone
        ) {
          setHasServiceProvider(true);
        }
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

      current[keys[keys.length - 1]] =
        name === "systemCosts.VAT_Deduction" ? value === "Yes" : value;

      return updatedFacility;
    });
  };

  const handleCheckboxChange = (e: any) => {
    const { name, checked } = e.target;
    if (name === "performanceReport") {
      setHasPerformanceReport(checked);
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token") || "";
      const IdToken = localStorage.getItem("IdToken") || "";

      if (!token || !IdToken) {
        console.log(" Authentication tokens are missing.");
      }
      const payload = {
        name: facility?.name,
        xrgiID: facility?.xrgiID,
        modelNumber: facility?.modelNumber,
        location: {
          address: facility?.location?.address,
          postalCode: facility?.location?.postalCode,
          city: facility?.location?.city,
        },
        serviceProvider: {
          name: facility?.serviceProvider?.name,
          mailAddress: facility?.serviceProvider?.mailAddress,
          phone: facility?.serviceProvider?.phone,
        },
        performance_report: {
          annualSavings: facility?.performance_report?.annualSavings || "",
          co2Savings: facility?.performance_report?.co2Savings || "",
          operatingHours: facility?.performance_report?.operatingHours || "",
          industry: facility?.performance_report?.industry || "",
        },
        hasPerformanceReport,
        isInstalled: isInstalled,
        DaSigned: true,
      };

      const updatedFacility = await apiRequest(
        `create-facility?id=${facilityId}`,
        "POST",
        payload,
        token,
        IdToken
      );
      if (updatedFacility) {
        router.push(`/admin/user/plantDetail/${facilityId}`);
      } else {
        throw new Error(" Failed to update facility");
      }
    } catch (error) {
      console.error(" Error saving facility:", error);
    }
  };

  return (
    <>
      <div className="flex-1 overflow-auto">
        <div className=" px-6 py-4">
          <div className="flex flex-col">
            <Link
              href={`/admin/user/plantDetail/${facilityId}`}
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
              <h2 className="text-lg font-semibold text-[#082351DE] mb-4">
                Register a System
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Name the system"
                    className="p-3 border rounded-lg w-full"
                    value={facility?.name}
                    onChange={handleChange}
                  />
                  <label className="text-gray-500 text-sm mt-1 block ml-3">
                    Example: “System in basement 01”
                  </label>
                </div>

                <div>
                  <div className="relative">
                    <select
                      name="modelNumber"
                      value={facility?.modelNumber}
                      onChange={handleChange}
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
                      name="xrgiID"
                      placeholder="Enter XRGI ID number"
                      className="p-3 border border-gray-300 rounded-lg w-full pr-10  focus:ring-2 focus:ring-blue-300"
                      value={facility?.xrgiID}
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
            <GenericModal
              show={isPopupOpen}
              onHide={() => setPopupOpen(false)}
            />
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
                    name="location.address"
                    placeholder="Address"
                    className="p-3 border rounded-lg w-full"
                    value={facility?.location?.address}
                    onChange={handleChange}
                  />
                  <label className="text-gray-500 text-sm mt-1 block ml-3">
                    Enter the address of this system's location
                  </label>
                </div>

                <div>
                  <input
                    type="text"
                    name="location.postalCode"
                    placeholder="Postal Code"
                    className="p-3 border rounded-lg w-full"
                    value={facility?.location?.postalCode}
                    onChange={handleChange}
                  />
                </div>

                <div className="md:col-span-1">
                  <input
                    type="text"
                    name="location.city"
                    placeholder="City"
                    className="p-3 border rounded-lg w-full"
                    value={facility?.location?.city}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white px-6 py-1 rounded-lg mb-6 border border-gray-200">
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
                      name="serviceProvider.name"
                      placeholder="Name of service provider"
                      className="p-3 border rounded-lg w-full"
                      value={facility?.serviceProvider?.name ?? ""}
                      onChange={handleChange}
                    />
                    <label className="text-gray-500 text-sm mt-1 block ml-3">
                      Enter the name of the service provider
                    </label>
                  </div>

                  <div>
                    <input
                      type="text"
                      name="serviceProvider.mailAddress"
                      placeholder="Email Address"
                      className="p-3 border rounded-lg w-full"
                      value={facility?.serviceProvider?.mailAddress ?? ""}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="md:col-span-1">
                    <input
                      type="text"
                      name="serviceProvider.phone"
                      placeholder="Phone Number"
                      className="p-3 border rounded-lg w-full"
                      value={facility?.serviceProvider?.phone ?? ""}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white px-6 py-1 rounded-lg mb-6 border border-gray-200">
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
                  <h2 className="text-lg font-semibold mb-4">
                    Performance report
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">
                        Expected annual savings
                      </label>
                      <input
                        type="text"
                        name="performance_report.annualSavings"
                        placeholder="Euro Pr. Year"
                        className="p-3 border border-gray-300 rounded-lg w-full bg-white focus:ring-2"
                        value={facility?.performance_report?.annualSavings || ""}
                        onChange={handleChange}
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">
                        Expected annual CO₂ savings
                      </label>
                      <input
                        type="text"
                        name="performance_report.co2Savings"
                        placeholder="Tons Pr. year"
                        className="p-3 border border-gray-300 rounded-lg w-full bg-white focus:ring-2 "
                        value={facility?.performance_report?.co2Savings || ""}
                        onChange={handleChange}
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">
                        Expected operating hours per year
                      </label>
                      <input
                        type="text"
                        name="performance_report.operatingHours"
                        placeholder="0-8763"
                        className="p-3 border border-gray-300 rounded-lg w-full bg-white focus:ring-2 "
                        value={facility?.performance_report?.operatingHours || ""}
                        onChange={handleChange}
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">
                        Industry
                      </label>
                      <select
                        name="performance_report.industry"
                        className="p-3 border border-gray-300 rounded-lg w-full bg-white focus:ring-2 "
                        value={facility?.performance_report?.industry || ""}
                        onChange={handleChange}
                      >
                        <option value="">Select a Industry</option>
                        <option value="manufacturing">Manufacturing</option>
                        <option value="healthcare">Healthcare</option>
                        <option value="hospitality">Hospitality</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}
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
        </div>

        <button
          className="bg-blue-500 text-white hover:bg-blue-800 px-6 py-2 rounded-md transition ml-auto block mb-10 mr-4 sm:mr-6 md:mr-12 w-full sm:w-auto"
          onClick={() => setIsOpen(true)}
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
            router.push(`/dashboard/facilities/${facilityId}`);
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
