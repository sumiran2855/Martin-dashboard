import GenericModal from "@/components/modals/genericPopup";
import { useState } from "react";
import { countryCodes } from "../dashboard/staticData/Data";
import { useTranslation } from "react-i18next";

interface ValidateFormProps {
  stepTwoFormData: any;
  setStepTwoFormData: React.Dispatch<React.SetStateAction<any>>;
  isInstalled: boolean;
  setIsInstalled: React.Dispatch<React.SetStateAction<any>>;
  hasServiceProvider: boolean;
  setHasServiceProvider: React.Dispatch<React.SetStateAction<any>>;
  hasPerformanceReport: boolean;
  setHasPerformanceReport: React.Dispatch<React.SetStateAction<any>>;
  setWantsServiceContract: React.Dispatch<React.SetStateAction<any>>;
  serviceContractChoice: string;
  setServiceContractChoice: React.Dispatch<React.SetStateAction<any>>;
  serviceContractWantedChoice: string;
  setServiceContractWantedChoice: React.Dispatch<React.SetStateAction<any>>;
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
  setWantsServiceContract,
  serviceContractChoice,
  setServiceContractChoice,
  setServiceContractWantedChoice,
  serviceContractWantedChoice,
}: ValidateFormProps) {
  const { t } = useTranslation("CreateProfile");
  const [isPopupOpen, setPopupOpen] = useState(false);
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
    <div>
      <h2 className="text-2xl font-bold text-[#082351DE] mb-2">
        {t("facility.title")}
      </h2>
      <p className="text-gray-600 mb-6">
      {t("facility.description")}
      </p>
      <div className="bg-white px-6 py-1 rounded-lg mb-6 border border-gray-200 max-md:px-0">
        <div className="p-6 rounded-lg mb-6">
          <h2 className="text-lg font-semibold text-[#082351DE] mb-4">
          {t("facility.registerSystem")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                name="systemName"
                placeholder={t("facility.systemNamePlaceholder")}
                className="p-3 border rounded-lg w-full"
                value={stepTwoFormData.systemName}
                onChange={handleChange}
              />
              <label className="text-gray-500 text-sm mt-1 block ml-3">
              {t("facility.systemNameHint")}
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
                  <option value="">{t("facility.selectModel")}</option>
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
              {t("facility.modelHint")}
              </label>
            </div>

            <div className="md:col-span-1 relative">
              <label className="block text-gray-700 text-sm font-medium mb-1">
              {t("facility.xrgiIdLabel")}
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="XRGINumber"
                  placeholder={t("facility.xrgiIdPlaceholder")}
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
                {t("facility.xrgiIdHint")}
              </p>
            </div>
          </div>
        </div>
        <GenericModal show={isPopupOpen} onHide={() => setPopupOpen(false)} />
      </div>

      <div className="bg-white px-6 py-1 rounded-lg mb-6 border border-gray-200 max-md:px-0">
        <div className="p-6 rounded-lg mb-6">
          <h2 className="text-lg text-[#082351DE] font-semibold mb-4">
          {t("facility.locationTitle")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                name="address"
                placeholder={t("facility.addressPlaceholder")}
                className="p-3 border rounded-lg w-full"
                value={stepTwoFormData.address}
                onChange={handleChange}
              />
              <label className="text-gray-500 text-sm mt-1 block ml-3">
              {t("facility.addressHint")}
              </label>
            </div>

            <div>
              <input
                type="text"
                name="postalCode"
                placeholder={t("facility.postalCodePlaceholder")}
                className="p-3 border rounded-lg w-full"
                value={stepTwoFormData.postalCode}
                onChange={handleChange}
              />
            </div>

            <div className="md:col-span-1">
              <input
                type="text"
                name="city"
                placeholder={t("facility.cityPlaceholder")}
                className="p-3 border rounded-lg w-full"
                value={stepTwoFormData.city}
                onChange={handleChange}
              />
            </div>
            <div className="md:col-span-1">
              <input
                type="text"
                name="country"
                placeholder={t("facility.countryPlaceholder")}
                className="p-3 border rounded-lg w-full"
                value={stepTwoFormData.country}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white px-6 py-1 rounded-lg mb-6 border border-gray-200 max-md:px-0">
        <div className="p-6 rounded-lg">
          <h2 className="text-lg text-[#082351DE] font-semibold mb-4">
          {t("facility.contractQuestion")}
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <SelectionButton
              selected={serviceContractChoice === "yes"}
              onClick={() => handleServiceContractChoice("yes")}
            >
              Yes
            </SelectionButton>
            <SelectionButton
              selected={serviceContractChoice === "no"}
              onClick={() => handleServiceContractChoice("no")}
            >
              No
            </SelectionButton>
          </div>

          {serviceContractChoice === "no" && (
            <div className="mt-6">
              <h2 className="text-lg text-[#082351DE] font-semibold mb-4">
              {t("facility.wantContractQuestion")}
              </h2>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <SelectionButton
                  selected={serviceContractWantedChoice === "yes"}
                  onClick={() => handleWantServiceContractChoice("yes")}
                >
                  Yes
                </SelectionButton>
                <SelectionButton
                  selected={serviceContractWantedChoice === "no"}
                  onClick={() => handleWantServiceContractChoice("no")}
                >
                  No
                </SelectionButton>
              </div>
            </div>
          )}

          {hasServiceProvider && (
            <div className="mt-6">
              <h2 className="text-lg text-[#082351DE] font-semibold mb-4">
              {t("facility.providerTitle")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    name="serviceProviderName"
                    placeholder={t("facility.providerNamePlaceholder")}
                    className="p-3 border rounded-lg w-full"
                    value={stepTwoFormData.serviceProviderName}
                    onChange={handleChange}
                  />
                  <label className="text-gray-500 text-sm mt-1 block ml-3">
                  {t("facility.providerNameHint")}
                  </label>
                </div>

                <div>
                  <input
                    type="text"
                    name="serviceProviderMail"
                    placeholder={t("facility.providerEmailPlaceholder")}
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
                    placeholder={t("facility.providerPhonePlaceholder")}
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
            {t("facility.addPerformanceReport")}
          </label>
        </div>

        {hasPerformanceReport && (
          <div className="bg-white p-10 rounded-lg mb-6">
            <div className="text-[#082351DE] rounded-lg mb-6">
              <h2 className="text-lg font-semibold mb-4">{t("facility.performanceTitle")}</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                  {t("facility.savingsLabel")}
                  </label>
                  <input
                    type="text"
                    name="annualSavings"
                    placeholder={t("facility.savingsPlaceholder")}
                    className="p-3 border border-gray-300 rounded-lg w-full bg-white focus:ring-2"
                    value={stepTwoFormData.annualSavings}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                  {t("facility.co2Label")}
                  </label>
                  <input
                    type="text"
                    name="co2Savings"
                    placeholder={t("facility.co2Placeholder")}
                    className="p-3 border border-gray-300 rounded-lg w-full bg-white focus:ring-2 "
                    value={stepTwoFormData.co2Savings}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                  {t("facility.hoursLabel")}
                  </label>
                  <input
                    type="text"
                    name="operatingHours"
                    placeholder={t("facility.hoursPlaceholder")}
                    className="p-3 border border-gray-300 rounded-lg w-full bg-white focus:ring-2 "
                    value={stepTwoFormData.operatingHours}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                  {t("facility.industryLabel")}
                  </label>
                  <select
                    name="industry"
                    className="p-3 border border-gray-300 rounded-lg w-full bg-white focus:ring-2 "
                    value={stepTwoFormData.industry}
                    onChange={handleChange}
                  >
                    <option value="" disabled>
                    {t("facility.industryPlaceholder")}
                    </option>
                    <option value="manufacturing">Hotel</option>
                    <option value="healthcare">School</option>
                    <option value="hospitality">Sport</option>
                    <option value="hospitality">Nursing home</option>
                    <option value="hospitality">Indrusty</option>
                    <option value="hospitality">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                  {t("facility.emailLabel")}{" "}
                    <span className="text-gray-500 text-sm">
                    {t("facility.emailHint")}
                    </span>
                  </label>
                  <input
                    type="text"
                    name="email"
                    placeholder={t("facility.emailPlaceholder")}
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
            {t("facility.installCheckbox")}
          </label>
        </div>
      </div>
    </div>
  );
}
