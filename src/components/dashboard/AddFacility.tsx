import { useState } from "react";
import BarChart from "../barChart";
import GenericModal from "../modals/genericPopup";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useCreateFacility } from "@/controller/facility/createFacility";
import TermsModal from "../modals/acceptTerms";
import { useTranslation } from "react-i18next";

function AddFacility() {
  const { t } = useTranslation("facilityForm");
  const { t: term } = useTranslation("term");
  const router = useRouter();
  const [isChecked, setIsChecked] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [hasServiceProvider, setHasServiceProvider] = useState(false);
  const [hasPerformanceReport, setHasPerformanceReport] = useState(false);
  const [facilityAdded, setFacilityAdded] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");

  const {
    stepTwoFormData,
    setStepTwoFormData,
    handleCreateFacility,
    partnerDetails,
    setPartnerDetails,
  } = useCreateFacility();

  const [selectedModel, setSelectedModel] = useState(
    stepTwoFormData.model || ""
  );

  const handleRadioChange = () => {
    setHasServiceProvider((prev) => !prev);
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

  // term and condition
  const [isTermsOpen, setTermsOpen] = useState(false);
  const onSubmit = async () => {
    setTermsOpen(true);
  };

  const handleAcceptTerms = async () => {
    setTermsOpen(false);
    setFacilityAdded(true);
  };

  const [setupSuperSaver, setSetupSuperSaver] = useState(false);

  const handleCheckboxChange = (e: any) => {
    const { name, checked } = e.target;
    setSetupSuperSaver((prev) => !prev);
    if (name === "performanceReport") {
      setHasPerformanceReport(checked);
      setStepTwoFormData((prev: any) => ({
        ...prev,
        performanceReport: checked,
      }));
    }
  };

  const handleOptionChange = (value: string) => {
    setSelectedOption(value);
  };

  const handleAddSuperSaverX = async () => {
    const success = await handleCreateFacility(
      isChecked,
      isInstalled,
      hasServiceProvider,
      setupSuperSaver,
      hasPerformanceReport,
      selectedOption,
    );
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
            <span className="text-xl">{t("back")}</span>
          </Link>
        </div>

        {!facilityAdded ? (
          <>
            <h2 className="text-2xl font-bold text-[#082351DE] mb-2">
              {t("registerXrgiSystem")}
            </h2>
            <p className="text-gray-600 mb-6">{t("loginCreatedMessage")}</p>

            <div className="bg-white px-6 py-1 rounded-lg mb-6 border border-gray-200">
              <div className="p-6 rounded-lg mb-6">
                <h2 className="text-lg font-semibold text-[#082351DE] mb-4">
                  {t("registerSystem")}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      name="systemName"
                      placeholder={t("nameSystem")}
                      className="p-3 border rounded-lg w-full"
                      value={stepTwoFormData.systemName}
                      onChange={handleChange}
                    />
                    <label className="text-gray-500 text-sm mt-1 block ml-3">
                      {t("nameSystemExample")}
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
                        name="XRGINumber"
                        placeholder={t("enterXrgiId")}
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
                      name="address"
                      placeholder={t("address")}
                      className="p-3 border rounded-lg w-full"
                      value={stepTwoFormData.address}
                      onChange={handleChange}
                    />
                    <label className="text-gray-500 text-sm mt-1 block ml-3">
                      {t("addressHint")}
                    </label>
                  </div>

                  <div>
                    <input
                      type="text"
                      name="postalCode"
                      placeholder={t("postalCode")}
                      className="p-3 border rounded-lg w-full"
                      value={stepTwoFormData.postalCode}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="md:col-span-1">
                    <input
                      type="text"
                      name="city"
                      placeholder={t("city")}
                      className="p-3 border rounded-lg w-full"
                      value={stepTwoFormData.city}
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
                        name="serviceProviderName"
                        placeholder={t("serviceProviderName")}
                        className="p-3 border rounded-lg w-full"
                        value={stepTwoFormData.serviceProviderName}
                        onChange={handleChange}
                      />
                      <label className="text-gray-500 text-sm mt-1 block ml-3">
                        {t("enterServiceProviderName")}
                      </label>
                    </div>

                    <div>
                      <input
                        type="text"
                        name="serviceProviderMail"
                        placeholder={t("serviceProviderEmail")}
                        className="p-3 border rounded-lg w-full"
                        value={stepTwoFormData.serviceProviderMail}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="md:col-span-1">
                      <input
                        type="text"
                        name="serviceProviderPhone"
                        placeholder={t("serviceProviderPhone")}
                        className="p-3 border rounded-lg w-full"
                        value={stepTwoFormData.serviceProviderPhone}
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
                          name="annualSavings"
                          placeholder={t("euroPerYear")}
                          className="p-3 border border-gray-300 rounded-lg w-full bg-white focus:ring-2"
                          value={stepTwoFormData.annualSavings}
                          onChange={handleChange}
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1">
                          {t("expectedAnnualCO2Savings")}
                        </label>
                        <input
                          type="text"
                          name="co2Savings"
                          placeholder={t("tonsPerYear")}
                          className="p-3 border border-gray-300 rounded-lg w-full bg-white focus:ring-2 "
                          value={stepTwoFormData.co2Savings}
                          onChange={handleChange}
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1">
                          {t("expectedOperatingHours")}
                        </label>
                        <input
                          type="text"
                          name="operatingHours"
                          placeholder={t("operatingHoursPlaceholder")}
                          className="p-3 border border-gray-300 rounded-lg w-full bg-white focus:ring-2 "
                          value={stepTwoFormData.operatingHours}
                          onChange={handleChange}
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1">
                          {t("industry")}
                        </label>
                        <select
                          name="industry"
                          className="p-3 border border-gray-300 rounded-lg w-full bg-white focus:ring-2 "
                          value={stepTwoFormData.industry}
                          onChange={handleChange}
                        >
                          <option value="" disabled>Select a Industry</option>
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

            <div className="flex gap-4">
              <button
                onClick={() => onSubmit()}
                className="bg-blue-500 hover:bg-blue-800 text-white px-6 py-3 rounded-md transition ml-auto"
              >
                {t("addFacility")}
              </button>
            </div>
          </>
        ) : (
          <div>
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
            <div className="flex gap-4">
              <button
                onClick={handleAddSuperSaverX}
                className="bg-blue-500 hover:bg-blue-800 text-white px-6 py-3 rounded-md transition ml-auto"
              >
                {t("addSuperSaverX")}
              </button>
            </div>
          </div>
        )}
      </div>

      <TermsModal
        isOpen={isTermsOpen}
        onClose={() => setTermsOpen(false)}
        title="Terms and Conditions"
        termsContent={term("termsAndConsent", { returnObjects: true }) as string[] }
        onAccept={handleAcceptTerms}
        isChecked={isChecked}
        setIsChecked={setIsChecked}
      />
    </div>
  );
}

export default AddFacility;
