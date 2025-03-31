import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import BarChart from "../barChart";
import { useRouter } from "next/navigation";
import Modal from "../modals/modal";
import { apiRequest } from "@/utils/authHelper";
import GenericModal from "../modals/genericPopup";
import { useTranslation } from "react-i18next";

interface Facility {
  facilityId?: string;
  location?: { address: string; postalCode: string; city: string };
  name: string;
  modelNumber: string;
  xrgiID: string;
  systemCosts?: {
    service_Costs: string;
    VAT_Deduction_Percent: string;
    VAT_Deduction: string;
  };
  serviceProvider?: {
    name: string;
    mailAddress: string;
    phone: string;
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

  hasServiceContract: boolean;
  feature?: {
    method: string;
    partner_details?: {
      name: string;
      email: string;
      mobile: string;
    };
  };
}

export default function EditFacilities({ facilityId }: { facilityId: string }) {
  const { t } = useTranslation("facilityForm");
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const [facility, setFacility] = useState<Facility | null>(null);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [hasServiceProvider, setHasServiceProvider] = useState(false);
  const [facilityAdded, setFacilityAdded] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [partnerDetails, setPartnerDetails] = useState({
    name: "",
    mobile: "",
    email: "",
  });

  const handleAcceptTerms = async () => {
    setFacilityAdded(true);
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
        setIsInstalled(response.data?.isInstalled || false);

        const { serviceProvider, feature } = response.data;
        if (
          serviceProvider?.name &&
          serviceProvider?.mailAddress &&
          serviceProvider?.phone
        ) {
          setHasServiceProvider(true);
        }

        if (response.data.hasServiceContract && feature) {
          setSetupSuperSaver(true);
          setSelectedOption(feature.method || "");

          if (feature.method === "local_partner" && feature.partner_details) {
            setPartnerDetails({
              name: feature.partner_details.name || "",
              mobile: feature.partner_details.mobile || "",
              email: feature.partner_details.email || "",
            });
          }
        }
      } catch (error) {
        console.error("Error fetching facility details:", error);
      }
    }

    if (facilityId) {
      fetchFacility();
    }
  }, [facilityId]);

  const handleRadioChange = () => {
    setHasServiceProvider((prev) => !prev);
  };

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

  const [setupSuperSaver, setSetupSuperSaver] = useState(false);

  const handleCheckboxChange = () => {
    setSetupSuperSaver((prev) => !prev);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const IdToken = localStorage.getItem("IdToken");

      if (!token || !IdToken) {
        console.error("Authentication tokens are missing.");
        return;
      }

      const hasServiceContract = hasServiceProvider ? true : false;

      const payload = {
        name: facility?.name,
        xrgiID: facility?.xrgiID,
        modelNumber: facility?.modelNumber,
        location: {
          address: facility?.location?.address,
          postalCode: facility?.location?.postalCode,
          city: facility?.location?.city,
        },
        serviceProvider: hasServiceProvider
          ? {
              name: facility?.serviceProvider?.name || "",
              mailAddress: facility?.serviceProvider?.mailAddress || "",
              phone: facility?.serviceProvider?.phone || "",
            }
          : null,
        systemCosts: {
          service_Costs: facility?.systemCosts?.service_Costs,
          VAT_Deduction_Percent: facility?.systemCosts?.VAT_Deduction_Percent,
          VAT_Deduction: facility?.systemCosts?.VAT_Deduction,
        },
        gas_Consumption: {
          annual_gas_consumption_m3:
            facility?.gas_Consumption?.annual_gas_consumption_m3,
          xrgi_gas_type: facility?.gas_Consumption?.xrgi_gas_type,
          gas_fixed_costs_dkk: facility?.gas_Consumption?.gas_fixed_costs_dkk,
          gas_variable_costs_dkk:
            facility?.gas_Consumption?.gas_variable_costs_dkk,
        },
        electircity_Consumption: {
          annual_grid_consumption_kwh:
            facility?.electircity_Consumption?.annual_grid_consumption_kwh,
          fixed_costs_dkk: facility?.electircity_Consumption?.fixed_costs_dkk,
          variable_costs_dkk:
            facility?.electircity_Consumption?.variable_costs_dkk,
        },
        isInstalled,
        DaSigned: true,
        hasServiceContract,
        feature:
          setupSuperSaver || hasServiceContract
            ? {
                method: selectedOption || "",
                partner_details:
                  selectedOption === "local_partner"
                    ? {
                        name: partnerDetails.name || "",
                        mobile: partnerDetails.mobile || "",
                        email: partnerDetails.email || "",
                      }
                    : undefined,
              }
            : null,
            featureAdded: setupSuperSaver ? true : false,
      };

      const updatedFacility = await apiRequest(
        `create-facility?id=${facilityId}`,
        "POST",
        payload,
        token,
        IdToken
      );

      if (updatedFacility) {
        router.push(`/dashboard/facilities/${facilityId}`);
      } else {
        throw new Error("Failed to update facility");
      }
    } catch (error) {
      console.error("Error saving facility:", error);
    }
  };

  const handleOptionChange = (value: string) => {
    setSelectedOption(value);
  };

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
              <span className="text-xl">{t("back")}</span>
            </Link>
          </div>
          <h1 className="text-2xl font-semibold text-gray-800 ml-6">
            {t("editFacilities")}
          </h1>
        </div>
        {!facilityAdded ? (
          <div className="flex-1 overflow-auto px-6 py-2 mx-4">
            <div className="bg-white px-6 py-1 rounded-lg mb-6 border border-gray-200">
              <div className="p-6 rounded-lg mb-6">
                <h2 className="text-lg font-semibold text-[#082351DE] mb-4">
                  {t("registerSystem")}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      name="name"
                      placeholder={t("nameSystem")}
                      className="p-3 border rounded-lg w-full"
                      value={facility?.name}
                      onChange={handleChange}
                    />
                    <label className="text-gray-500 text-sm mt-1 block ml-3">
                      {t("nameSystemExample")}
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
                        <option value="">{t("selectModel")}</option>
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
                      {t("modelNameHint")}
                    </label>
                  </div>

                  <div className="md:col-span-1 relative">
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      {t("xrgiIdNumber")}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="xrgiID"
                        placeholder={t("enterXrgiId")}
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
                      {t("xrgiIdHint")}
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
                  {t("systemLocation")}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      name="location.address"
                      placeholder={t("address")}
                      className="p-3 border rounded-lg w-full"
                      value={facility?.location?.address}
                      onChange={handleChange}
                    />
                    <label className="text-gray-500 text-sm mt-1 block ml-3">
                      {t("addressHint")}
                    </label>
                  </div>

                  <div>
                    <input
                      type="text"
                      name="location.postalCode"
                      placeholder={t("postalCode")}
                      className="p-3 border rounded-lg w-full"
                      value={facility?.location?.postalCode}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="md:col-span-1">
                    <input
                      type="text"
                      name="location.city"
                      placeholder={t("city")}
                      className="p-3 border rounded-lg w-full"
                      value={facility?.location?.city}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white px-6 py-1 rounded-lg mb-6 border border-gray-200">
              <div className="p-6 rounded-lg mb-6">
                <h2 className="text-lg text-[#082351DE] font-semibold mb-4">
                  {t("systemCosts")}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-1">
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      {t("serviceCosts")}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="systemCosts.service_Costs"
                        value={facility?.systemCosts?.service_Costs}
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
                      {t("serviceCostsHint")}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full md:col-span-2">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">
                        {t("vatDeductionPercentage")}
                      </label>
                      <input
                        type="text"
                        name="systemCosts.VAT_Deduction_Percent"
                        value={facility?.systemCosts?.VAT_Deduction_Percent}
                        onChange={handleChange}
                        className="p-3 border border-gray-300 rounded-lg w-full  focus:ring-2 focus:ring-blue-300"
                      />
                    </div>

                    <div className="relative">
                      <label className="block text-gray-700 text-sm font-medium mb-1">
                        {t("vatDeduction")}
                      </label>
                      <div className="relative">
                        <select
                          className="appearance-none p-3 border border-gray-300 rounded-lg w-full  focus:ring-2 focus:ring-blue-300 pr-10 cursor-pointer"
                          name="systemCosts.VAT_Deduction"
                          value={
                            facility?.systemCosts?.VAT_Deduction ? "Yes" : "No"
                          }
                          onChange={handleChange}
                        >
                          <option>{t("yes")}</option>
                          <option>{t("no")}</option>
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
                  {t("addServiceProvider")}
                </label>
              </div>

              {hasServiceProvider && (
                <div className="p-6 rounded-lg mb-6">
                  <h2 className="text-lg text-[#082351DE] font-semibold mb-4">
                    {t("serviceProvider")}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <input
                        type="text"
                        name="serviceProvider.name"
                        placeholder={t("serviceProviderName")}
                        className="p-3 border rounded-lg w-full"
                        value={facility?.serviceProvider?.name ?? ""}
                        onChange={handleChange}
                      />
                      <label className="text-gray-500 text-sm mt-1 block ml-3">
                        {t("enterServiceProviderName")}
                      </label>
                    </div>

                    <div>
                      <input
                        type="text"
                        name="serviceProvider.mailAddress"
                        placeholder={t("serviceProviderEmail")}
                        className="p-3 border rounded-lg w-full"
                        value={facility?.serviceProvider?.mailAddress ?? ""}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="md:col-span-1">
                      <input
                        type="text"
                        name="serviceProvider.phone"
                        placeholder={t("serviceProviderPhone")}
                        className="p-3 border rounded-lg w-full"
                        value={facility?.serviceProvider?.phone ?? ""}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white p-10 rounded-lg mb-6 border border-gray-200">
              <div className="text-[#082351DE] rounded-lg mb-6">
                <h2 className="text-lg font-semibold mb-4">
                  {t("gasConsumption")}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      {t("gasType")}
                    </label>
                    <div className="relative">
                      <select
                        name="gas_Consumption.xrgi_gas_type"
                        value={facility?.gas_Consumption?.xrgi_gas_type ?? ""}
                        onChange={handleChange}
                        className="appearance-none p-3 border border-gray-300 rounded-lg w-full bg-white focus:ring-2 focus:ring-blue-300 pr-10 cursor-pointer"
                      >
                        <option>{t("selectGasType")}</option>
                        <option>{t("naturalGas")}</option>
                        <option>{t("hydrogen")}</option>
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
                      {t("annualGasConsumption")}
                    </label>
                    <input
                      type="text"
                      name="gas_Consumption.annual_gas_consumption_m3"
                      value={
                        facility?.gas_Consumption?.annual_gas_consumption_m3 ??
                        ""
                      }
                      onChange={handleChange}
                      placeholder="m³"
                      className="p-3 border border-gray-300 rounded-lg w-full bg-white focus:ring-2 focus:ring-blue-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      {t("consumptionIndependentCosts")}
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
                      {t("consumptionDependentCosts")}
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
                  {t("electricityConsumption")}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      {t("annualGridConsumption")}
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
                      {t("fixedCosts")}
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
                      {t("variableCosts")}
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
                      {t("tariffHint")}
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
                  {t("isSystemInstalled")}
                </label>
              </div>
            </div>

            <div className="bg-white p-10 rounded-lg mb-6 border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg text-[#082351DE] font-semibold">
                  {t("operationExample")}
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
                  <span className="text-gray-700">{t("xrgilabel")}</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-blue-900 rounded-full inline-block mr-2"></span>
                  <span className="text-gray-700">{t("tariffsLabel")}</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-blue-400 rounded-full inline-block mr-2"></span>
                  <span className="text-gray-700">{t("flexPriceLabel")}</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-gray-300 rounded-full inline-block mr-2"></span>
                  <span className="text-gray-700">{t("vatLabel")}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-auto px-6 py-2 mx-4">
            <h2 className="text-2xl font-bold text-[#082351DE] mb-2">
              {t("installation")}
            </h2>
            <p className="text-gray-600 mb-6">{t("installationDescription")}</p>

            <div className="flex items-center space-x-3 py-4">
              <input
                type="checkbox"
                checked={facility?.hasServiceContract}
                onChange={handleCheckboxChange}
                className="w-5 h-5 cursor-pointer"
              />
              <label className="text-[#082351DE] text-lg font-semibold">
                {t("setupSuperSaverX")}
              </label>
            </div>

            {facility?.hasServiceContract && (
              <div className="bg-white px-6 py-4 rounded-lg mb-6 border border-gray-200">
                <div className="p-4 rounded-lg mb-4">
                  <h2 className="text-lg font-semibold text-[#082351DE] mb-4">
                    {t("setupSuperSaverXSolution")}
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
                      <span className="text-gray-700">{t("serviceCheck")}</span>
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
                        <span className="text-gray-700">
                          {t("localPartner")}
                        </span>
                      </label>

                      {selectedOption === "local_partner" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-gray-300 p-4 rounded-lg">
                          <input
                            type="text"
                            placeholder={t("partnerName")}
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
                            placeholder={t("partnerMobile")}
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
                            placeholder={t("partnerEmail")}
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
        )}

        <button
          className="bg-blue-500 text-white hover:bg-blue-800 px-6 py-2 rounded-md transition ml-auto block mb-10 mr-4 sm:mr-6 md:mr-12 w-full sm:w-auto"
          onClick={() => {
            if (facilityAdded) {
              setIsOpen(true);
            } else {
              handleAcceptTerms();
            }
          }}
        >
          {facilityAdded ? t("saveChanges") : t("next")}
        </button>

        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title={t("modalTitle")}
          message={t("modalMessage")}
          primaryButton={t("save")}
          onPrimaryClick={() => {
            handleSave();
            router.push("/dashboard/facilities/${facilityId}");
          }}
          secondaryButton={t("discard")}
          onSecondaryClick={() =>
            router.push("/dashboard/facilities/editFacilities")
          }
        />
      </div>
    </>
  );
}
