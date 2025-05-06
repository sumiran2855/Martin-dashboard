import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "../modals/modal";
import { apiRequest } from "@/utils/authHelper";
import GenericModal from "../modals/genericPopup";
import { useTranslation } from "react-i18next";
import { countryCodes } from "./staticData/Data";

interface Facility {
  facilityId?: string;
  location?: {
    address: string;
    postalCode: string;
    city: string;
    country: string;
  };
  name: string;
  modelNumber: string;
  xrgiID: string;
  serviceProvider?: {
    name: string;
    mailAddress: string;
    phone: string;
    countryCode: string;
  };
  performance_report?: {
    annualSavings: string;
    co2Savings: string;
    operatingHours: string;
    industry: string;
  };
  hasPerformanceReport: boolean;
  featureAdded: boolean;
  hasServiceContract: boolean;
  needServiceContract: boolean;
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
  const [serviceContractChoice, setServiceContractChoice] = useState("");
  const [serviceContractWantedChoice, setServiceContractWantedChoice] =
    useState("");
  const [setupSuperSaver, setSetupSuperSaver] = useState(
    facility?.featureAdded || false
  );

  const handleServiceContractChoice = (choice: any) => {
    setServiceContractChoice(choice);
    setHasServiceProvider(choice === "yes");
  };

  const handleWantServiceContractChoice = (choice: any) => {
    setServiceContractWantedChoice(choice);
  };

  const [partnerDetails, setPartnerDetails] = useState({
    name: "",
    mobile: "",
    email: "",
    countryCode: "",
  });
  const [hasPerformanceReport, setHasPerformanceReport] = useState(false);

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

        const { feature } = response.data;

        if (response.data.hasServiceContract) {
          setHasServiceProvider(true);
          setServiceContractChoice("yes");
        } else {
          setServiceContractChoice("no");
          setServiceContractWantedChoice(
            response.data.needServiceContract ? "yes" : "no"
          );
        }

        if (response.data.hasPerformanceReport) {
          setHasPerformanceReport(true);
        }

        if (response.data.featureAdded === true || feature) {
          setSetupSuperSaver(true);
          setSelectedOption(feature.method || "");

          if (feature.method === "local_partner" && feature.partner_details) {
            setPartnerDetails({
              name: feature.partner_details.name || "",
              mobile: feature.partner_details.mobile || "",
              email: feature.partner_details.email || "",
              countryCode: feature.partner_details.countryCode || "",
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
    setSetupSuperSaver((prev) => !prev);
    if (name === "performanceReport") {
      setHasPerformanceReport(checked);
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const IdToken = localStorage.getItem("IdToken");

      if (!token || !IdToken) {
        console.error("Authentication tokens are missing.");
        return;
      }

      const hasServiceContract = serviceContractChoice === "yes";
      const needServiceContract =
        serviceContractChoice === "no" && serviceContractWantedChoice === "yes";

      const serviceProviderData = hasServiceContract
        ? {
            name: facility?.serviceProvider?.name || "",
            mailAddress: facility?.serviceProvider?.mailAddress || "",
            phone: facility?.serviceProvider?.phone || "",
            countryCode: facility?.serviceProvider?.countryCode || "",
          }
        : null;

      const payload = {
        name: facility?.name,
        xrgiID: facility?.xrgiID,
        modelNumber: facility?.modelNumber,
        location: {
          address: facility?.location?.address || "",
          postalCode: facility?.location?.postalCode || "",
          city: facility?.location?.city || "",
          country: facility?.location?.country || "",
        },
        serviceProvider: serviceProviderData,
        performance_report: {
          annualSavings: facility?.performance_report?.annualSavings || "",
          co2Savings: facility?.performance_report?.co2Savings || "",
          operatingHours: facility?.performance_report?.operatingHours || "",
          industry: facility?.performance_report?.industry || "",
        },
        hasPerformanceReport,
        isInstalled,
        needServiceContract,
        DaSigned: true,
        hasServiceContract,
        feature: setupSuperSaver
          ? {
              method: selectedOption || "",
              partner_details:
                selectedOption === "local_partner"
                  ? {
                      name: partnerDetails.name || "",
                      mobile: partnerDetails.mobile || "",
                      email: partnerDetails.email || "",
                      countryCode: partnerDetails.countryCode || "",
                    }
                  : undefined,
            }
          : null,
        featureAdded: setupSuperSaver ? true : false,
      };
      console.log("🚀 ~ handleSave ~ payload:", payload);

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

  const SelectionButton = ({ selected, onClick, children }: any) => (
    <button
      onClick={onClick}
      className={`flex-2 py-3 px-4 rounded-lg border ${
        selected
          ? "bg-blue-500 text-white border-blue-500"
          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
      } transition duration-200 font-medium`}
    >
      {children}
    </button>
  );

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
            <div className="bg-white px-6 py-1 rounded-lg mb-6 border border-gray-200 max-md:px-0">
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
                      value={facility?.name || ""}
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
                        value={facility?.modelNumber || ""}
                        onChange={handleChange}
                        className="appearance-none bg-white p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-300 pr-10 cursor-pointer"
                      >
                        <option value="">{t("selectModel")}</option>
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
                        value={facility?.xrgiID || ""}
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

            <div className="bg-white px-6 py-1 rounded-lg mb-6 border border-gray-200 max-md:px-0">
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
                      value={facility?.location?.address || ""}
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
                      value={facility?.location?.postalCode || ""}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="md:col-span-1">
                    <input
                      type="text"
                      name="location.city"
                      placeholder={t("city")}
                      className="p-3 border rounded-lg w-full"
                      value={facility?.location?.city || ""}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="md:col-span-1">
                    <input
                      type="text"
                      name="location.country"
                      placeholder={t("country")}
                      className="p-3 border rounded-lg w-full"
                      value={facility?.location?.country || ""}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white px-6 py-1 rounded-lg mb-6 border border-gray-200 max-md:px-0">
              <div className="p-6 rounded-lg">
                <h2 className="text-lg text-[#082351DE] font-semibold mb-4">
                  {t("alreadyHaveContract")}
                </h2>
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <SelectionButton
                    selected={serviceContractChoice === "yes"}
                    onClick={() => handleServiceContractChoice("yes")}
                  >
                    {t("yes")}
                  </SelectionButton>
                  <SelectionButton
                    selected={serviceContractChoice === "no"}
                    onClick={() => handleServiceContractChoice("no")}
                  >
                    {t("no")}
                  </SelectionButton>
                </div>

                {serviceContractChoice === "no" && (
                  <div className="mt-6">
                    <h2 className="text-lg text-[#082351DE] font-semibold mb-4">
                      {t("wantContract")}
                    </h2>
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                      <SelectionButton
                        selected={serviceContractWantedChoice === "yes"}
                        onClick={() => handleWantServiceContractChoice("yes")}
                      >
                        {t("yes")}
                      </SelectionButton>
                      <SelectionButton
                        selected={serviceContractWantedChoice === "no"}
                        onClick={() => handleWantServiceContractChoice("no")}
                      >
                        {t("no")}
                      </SelectionButton>
                    </div>
                  </div>
                )}

                {hasServiceProvider && (
                  <div className="mt-6">
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
                      <div className="flex items-center w-full gap-2">
                        <div className="relative w-1/4">
                          <select
                            name="serviceProvider.countryCode"
                            value={facility?.serviceProvider?.countryCode ?? ""}
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
                          name="serviceProvider.phone"
                          placeholder={t("serviceProviderPhone")}
                          className="p-3 w-5/6 border rounded-lg outline-none"
                          value={facility?.serviceProvider?.phone ?? ""}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
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
                  {t("addPerformanceReport")}
                </label>
              </div>

              {hasPerformanceReport && (
                <div className="bg-white p-10 rounded-lg mb-6">
                  <div className="text-[#082351DE] rounded-lg mb-6">
                    <h2 className="text-lg font-semibold mb-4">
                      {t("performanceReport")}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1">
                          {t("expectedAnnualSavings")}
                        </label>
                        <input
                          type="text"
                          name="performance_report.annualSavings"
                          placeholder={t("euroPerYear")}
                          className="p-3 border border-gray-300 rounded-lg w-full bg-white focus:ring-2"
                          value={facility?.performance_report?.annualSavings}
                          onChange={handleChange}
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1">
                          {t("expectedAnnualCO2Savings")}
                        </label>
                        <input
                          type="text"
                          name="performance_report.co2Savings"
                          placeholder={t("tonsPerYear")}
                          className="p-3 border border-gray-300 rounded-lg w-full bg-white focus:ring-2 "
                          value={facility?.performance_report?.co2Savings}
                          onChange={handleChange}
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1">
                          {t("expectedOperatingHours")}
                        </label>
                        <input
                          type="text"
                          name="performance_report.operatingHours"
                          placeholder={t("operatingHoursPlaceholder")}
                          className="p-3 border border-gray-300 rounded-lg w-full bg-white focus:ring-2 "
                          value={facility?.performance_report?.operatingHours}
                          onChange={handleChange}
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1">
                          {t("industry")}
                        </label>
                        <select
                          name="performance_report.industry"
                          className="p-3 border border-gray-300 rounded-lg w-full bg-white focus:ring-2 "
                          value={facility?.performance_report?.industry}
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
                  {t("isSystemInstalled")}
                </label>
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
                checked={setupSuperSaver}
                onChange={handleCheckboxChange}
                className="w-5 h-5 cursor-pointer"
              />
              <label className="text-[#082351DE] text-lg font-semibold">
                {t("setupSuperSaverX")}
              </label>
            </div>

            {setupSuperSaver && (
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
                          <div className="flex gap-2">
                            <div className="relative w-1/3">
                              <select
                                name="serviceProviderCountryCode"
                                value={partnerDetails.countryCode}
                                onChange={(e) =>
                                  setPartnerDetails({
                                    ...partnerDetails,
                                    countryCode: e.target.value,
                                  })
                                }
                                className="p-2 w-full border rounded outline-none bg-white cursor-pointer appearance-none pr-6"
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
                          </div>
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
