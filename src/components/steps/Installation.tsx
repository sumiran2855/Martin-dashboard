import { useTranslation } from "react-i18next";

interface AddsmartPriceControl {
  stepTwoFormData: any;
  selectedOption: string;
  setSelectedOption: (value: string) => void;
  partnerDetails: {
    name: string;
    mobile: string;
    email: string;
    countryCode: string;
  };
  setPartnerDetails: (details: any) => void;
  setupSuperSaver: boolean;
  setSetupSuperSaver: React.Dispatch<React.SetStateAction<any>>;
  facilityMethod: string;
  setFacilityMethod: (value: string) => void;
}

export default function StepThree({
  stepTwoFormData,
  selectedOption,
  setSelectedOption,
  setPartnerDetails,
  setupSuperSaver,
  setSetupSuperSaver,
}: AddsmartPriceControl) {
  const { t } = useTranslation("CreateProfile");
  const handleCheckboxChange = () => {
    setSetupSuperSaver((prev: any) => !prev);
    if (setupSuperSaver) {
      setSelectedOption("");
      setPartnerDetails({ name: "", mobile: "", email: "" });
    }
  };

  const handleOptionChange = (value: string) => {
    setSelectedOption(value);

    if (value !== "local_partner") {
      setPartnerDetails({ name: "", mobile: "", email: "" });
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#082351DE] mb-2">
        Smart PriceControl
      </h2>
      <p className="text-gray-600 mb-4">{t("Installation.description")}</p>
      <p className="text-gray-600 mb-2">{t("Installation.description2")}</p>
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
          {t("Installation.setupTitle")} Smart PriceControl
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
    </div>
  );
}
