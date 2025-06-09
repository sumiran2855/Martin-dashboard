import { useState } from "react";
import GenericModal from "../modals/genericPopup";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useCreateFacility } from "@/controller/facility/createFacility";
import TermsModal from "../modals/acceptTerms";
import { useTranslation } from "react-i18next";
import { countryCodes } from "./staticData/Data";

function AddFacility() {
  const { t } = useTranslation("facilityForm");
  const { t: term } = useTranslation("term");
  const router = useRouter();
  const [isChecked, setIsChecked] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [hasServiceProvider, setHasServiceProvider] = useState(false);
  const [hasEnergyCheckPlus, sethasEnergyCheckPlus] = useState(false);
  const [facilityAdded, setFacilityAdded] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [serviceContractChoice, setServiceContractChoice] = useState("");
  const [serviceContractWantedChoice, setServiceContractWantedChoice] =
    useState("");
  const [wantsServiceContract, setWantsServiceContract] = useState(false);
  const [setupSuperSaver, setSetupSuperSaver] = useState(false);
  const [isTermsOpen, setTermsOpen] = useState(false);
  const [errors, setErrors] = useState({
    systemName: "",
    model: "",
    XRGINumber: "",
    address: "",
    postalCode: "",
    city: "",
    country: ""
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const {
    stepTwoFormData,
    setStepTwoFormData,
    handleCreateFacility,
  } = useCreateFacility();

  const [selectedModel, setSelectedModel] = useState(
    stepTwoFormData.model || ""
  );

  const handleServiceContractChoice = (choice: any) => {
    setServiceContractChoice(choice);
    setHasServiceProvider(choice === "yes");
  };

  const handleWantServiceContractChoice = (choice: any) => {
    setServiceContractWantedChoice(choice);
    setWantsServiceContract(choice === "yes");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | any) => {
    const { name, value } = e.target;
    setStepTwoFormData((prev: any) => ({ ...prev, [name]: value }));
    
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "model") {
      setSelectedModel(value);
      setStepTwoFormData((prev: any) => ({ ...prev, model: value }));
      if (errors.model) {
        setErrors(prev => ({ ...prev, model: "" }));
      }
    }
  };

  const validateForm = () => {
    setFormSubmitted(true);
    const newErrors = {
      systemName: "",
      model: "",
      XRGINumber: "",
      address: "",
      postalCode: "",
      city: "",
      country: ""
    };
    
      if (!stepTwoFormData.systemName?.trim()) {
        newErrors.systemName = "Please provide the system name.";
      }
      if (!selectedModel) {
        newErrors.model = "Please select a model.";
      }
      if (!stepTwoFormData.XRGINumber?.trim()) {
        newErrors.XRGINumber = "Please enter the XRGI number.";
      }
      if (!stepTwoFormData.address?.trim()) {
        newErrors.address = "Please provide the installation address.";
      }
      if (!stepTwoFormData.postalCode?.trim()) {
        newErrors.postalCode = "Postal code is required.";
      }
      if (!stepTwoFormData.city?.trim()) {
        newErrors.city = "City name is required.";
      }
      if (!stepTwoFormData.country?.trim()) {
        newErrors.country = "Country name is required.";
      }

    
    setErrors(newErrors);
    
    return !Object.values(newErrors).some(error => error);
  };

  const onSubmit = async () => {
    const isValid = validateForm();
    if (isValid) {
      setTermsOpen(true);
    }
  };

  const handleAcceptTerms = async () => {
    setTermsOpen(false);
    setFacilityAdded(true);
  };

  const handleCheckboxChange = (e: any) => {
    const { name, checked } = e.target;
    setSetupSuperSaver((prev) => !prev);
    if (name === "performanceReport") {
      sethasEnergyCheckPlus(checked);
      setStepTwoFormData((prev: any) => ({
        ...prev,
        performanceReport: checked,
      }));
    }
  };

  const handleOptionChange = (value: string) => {
    setSelectedOption(value);
  };

  const handleAddSmartPriceControl = async () => {
    const success = await handleCreateFacility(
      isChecked,
      isInstalled,
      hasServiceProvider,
      setupSuperSaver,
      hasEnergyCheckPlus,
      selectedOption,
      wantsServiceContract
    );
    if (success) {
      router.push("/dashboard");
    }
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

            <div className="bg-white px-6 py-1 rounded-lg mb-6 border border-gray-200 max-md:px-0">
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
                      className={`p-3 border rounded-lg w-full ${
                        errors.systemName && formSubmitted
                          ? "border-red-500"
                          : ""
                      }`}
                      value={stepTwoFormData.systemName || ""}
                      onChange={handleChange}
                    />
                    {errors.systemName && formSubmitted ? (
                      <p className="text-red-500 text-sm mt-1 ml-3">
                        {errors.systemName}
                      </p>
                    ) : (
                      <label className="text-gray-500 text-sm mt-1 block ml-3">
                        {t("nameSystemExample")}
                      </label>
                    )}
                  </div>

                  <div>
                    <div className="relative">
                      <select
                        name="model"
                        value={selectedModel}
                        onChange={handleChangeSelect}
                        className={`appearance-none bg-white p-3 border rounded-lg w-full focus:ring-2 focus:ring-blue-300 pr-10 cursor-pointer ${
                          errors.model && formSubmitted
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
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
                    {errors.model && formSubmitted ? (
                      <p className="text-red-500 text-sm mt-1 ml-3">
                        {errors.model}
                      </p>
                    ) : (
                      <label className="text-gray-500 text-sm mt-1 block ml-3">
                        {t("modelNameHint")}
                      </label>
                    )}
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
                        className={`p-3 border rounded-lg w-full pr-10 focus:ring-2 focus:ring-blue-300 ${
                          errors.XRGINumber && formSubmitted
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        value={stepTwoFormData.XRGINumber || ""}
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
                    {errors.XRGINumber && formSubmitted ? (
                      <p className="text-red-500 text-sm mt-1 ml-3">
                        {errors.XRGINumber}
                      </p>
                    ) : (
                      <p className="text-gray-500 text-sm mt-1 block ml-3">
                        {t("xrgiIdHint")}
                      </p>
                    )}
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
                      name="address"
                      placeholder={t("address")}
                      className={`p-3 border rounded-lg w-full ${
                        errors.address && formSubmitted ? "border-red-500" : ""
                      }`}
                      value={stepTwoFormData.address || ""}
                      onChange={handleChange}
                    />
                    {errors.address && formSubmitted ? (
                      <p className="text-red-500 text-sm mt-1 ml-3">
                        {errors.address}
                      </p>
                    ) : (
                      <label className="text-gray-500 text-sm mt-1 block ml-3">
                        {t("addressHint")}
                      </label>
                    )}
                  </div>

                  <div>
                    <input
                      type="text"
                      name="postalCode"
                      placeholder={t("postalCode")}
                      className={`p-3 border rounded-lg w-full ${
                        errors.postalCode && formSubmitted
                          ? "border-red-500"
                          : ""
                      }`}
                      value={stepTwoFormData.postalCode || ""}
                      onChange={handleChange}
                    />
                    {errors.postalCode && formSubmitted && (
                      <p className="text-red-500 text-sm mt-1 ml-3">
                        {errors.postalCode}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-1">
                    <input
                      type="text"
                      name="city"
                      placeholder={t("city")}
                      className={`p-3 border rounded-lg w-full ${
                        errors.city && formSubmitted ? "border-red-500" : ""
                      }`}
                      value={stepTwoFormData.city || ""}
                      onChange={handleChange}
                    />
                    {errors.city && formSubmitted && (
                      <p className="text-red-500 text-sm mt-1 ml-3">
                        {errors.city}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-1">
                    <input
                      type="text"
                      name="country"
                      placeholder={t("country")}
                      className={`p-3 border rounded-lg w-full ${
                        errors.country && formSubmitted ? "border-red-500" : ""
                      }`}
                      value={stepTwoFormData.country || ""}
                      onChange={handleChange}
                    />
                    {errors.country && formSubmitted && (
                      <p className="text-red-500 text-sm mt-1 ml-3">
                        {errors.country}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white px-6 py-1 rounded-lg mb-6 border border-gray-200 max-md:px-0">
              <div className="p-6 rounded-lg">
                <h2 className="text-lg text-[#082351DE] font-semibold mb-2">
                  {t("alreadyHaveContract")}
                </h2>
                <p className="mb-4 text-gray-500">
                  {t("alreadyHaveContract2")}
                </p>
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
                      <div className="flex items-center w-full gap-2">
                        <div className="relative w-1/4">
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
                          placeholder={t("serviceProviderPhone")}
                          className="p-3 w-5/6 border rounded-lg outline-none"
                          value={stepTwoFormData.serviceProviderPhone}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white px-6 py-1 rounded-lg mb-2 border border-gray-200 max-md:px-0">
              <h2 className="text-2xl font-semibold text-[#082351DE] px-4 pt-4">
                {t("energyCheckTitle")}
              </h2>
              <h2 className="text-xl font-semibold text-[#082351DE] px-4 pb-4">
                {t("energyCheckSubtitle")}
              </h2>
              <div className="flex items-center space-x-3 pb-4">
                <input
                  type="checkbox"
                  id="performanceReport"
                  name="performanceReport"
                  checked={hasEnergyCheckPlus}
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

              {hasEnergyCheckPlus && (
                <div className="bg-white px-4 rounded-lg mb-6">
                  <div className="text-[#082351DE] rounded-lg mb-6">
                    <h2 className="text-lg font-normal mb-2">
                      {t("performanceReport")}
                    </h2>
                    <h2 className="text-lg font-normal mb-4">
                      {t("performanceReport2")}
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
                          <option value="">Select a Industry</option>
                          <option value="Hotel">{t("option.Hotel")}</option>
                          <option value="School">{t("option.School")}</option>
                          <option value="Sport">{t("option.Sport")}</option>
                          <option value="Nursing home">{t("option.NursingHome")}</option>
                          <option value="Industry">{t("option.Industry")}</option>
                          <option value="other">{t("option.Other")}</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1">
                          {t("emailLabel")}
                          <span className="text-gray-500 text-sm">
                            {t("emailHint")}
                          </span>
                        </label>
                        <input
                          type="text"
                          name="email"
                          placeholder={t("emailPlaceholder")}
                          className="p-3 border border-gray-300 rounded-lg w-full bg-white focus:ring-2 "
                          value={stepTwoFormData.email}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <label className="block text-gray-700 text-sm font-medium mb-6 ml-2">
              {t("emailHint2")}
            </label>

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
              Smart PriceControl
            </h2>
            <p className="text-gray-600 mb-4">
              {t("Installation.description")}
            </p>
            <p className="text-gray-600 mb-2">
              {t("Installation.description2")}
            </p>
            <div className="flex items-center space-x-3 py-3">
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
                {t("Installation.setupTitle")}
              </label>
            </div>

            {setupSuperSaver && (
              <div className="bg-white px-6 py-4 rounded-lg mb-6 border border-gray-200">
                <div className="p-4 rounded-lg mb-4">
                  <h2 className="text-lg font-semibold text-[#082351DE] mb-4">
                    {t("Installation.atService")}
                  </h2>
                  <div className="space-y-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="installation"
                        value="On_Site_Visit"
                        checked={selectedOption === "On_Site_Visit"}
                        onChange={(e) => handleOptionChange(e.target.value)}
                        className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">
                        {t("Installation.atService2")}
                      </span>
                    </label>

                    <div className="space-y-2">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="installation"
                          value="as_soon_as_possible"
                          checked={selectedOption === "as_soon_as_possible"}
                          onChange={(e) => handleOptionChange(e.target.value)}
                          className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-gray-700">
                          {t("Installation.atService3")}
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="flex gap-4">
              <button
                onClick={handleAddSmartPriceControl}
                className="bg-blue-500 hover:bg-blue-800 text-white px-6 py-3 rounded-md transition ml-auto"
              >
                {t("addSmartPriceControl")}
              </button>
            </div>
          </div>
        )}
      </div>

      <TermsModal
        isOpen={isTermsOpen}
        onClose={() => setTermsOpen(false)}
        title="Terms and Conditions"
        termsContent={
          term("termsAndConsent", { returnObjects: true }) as string[]
        }
        onAccept={handleAcceptTerms}
        isChecked={isChecked}
        setIsChecked={setIsChecked}
      />
    </div>
  );
}

export default AddFacility;