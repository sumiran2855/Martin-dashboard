import { useTranslation } from "react-i18next";
import { countryCodes } from "../dashboard/staticData/Data";

interface AddFeature {
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
  selectedOption,
  setSelectedOption,
  partnerDetails,
  setPartnerDetails,
  setupSuperSaver,
  setSetupSuperSaver,
}: AddFeature) {
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
      <h2 className="text-2xl font-bold text-[#082351DE] mb-2">{t("Installation.title")}</h2>
      <p className="text-gray-600 mb-6">
      {t("Installation.description")}
      </p>

      <div className="flex items-center space-x-3 py-4">
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
           {t("Installation.setupQuestion")}
        </label>
      </div>

      {setupSuperSaver && (
        <div className="bg-white px-6 py-4 rounded-lg mb-6 border border-gray-200">
          <div className="p-4 rounded-lg mb-4">
            <h2 className="text-lg font-semibold text-[#082351DE] mb-4">
            {t("Installation.setupTitle")}
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
                <span className="text-gray-700">{t("Installation.atService")}</span>
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
                  <span className="text-gray-700">{t("Installation.localPartner")}</span>
                </label>

                {selectedOption === "local_partner" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-gray-300 p-4 rounded-lg">
                    <input
                      type="text"
                      placeholder={t("Installation.namePlaceholder")}
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
                      <div className="relative w-1/5">
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
                        placeholder={t("Installation.mobilePlaceholder")}
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
                      placeholder={t("Installation.emailPlaceholder")}
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
  );
}
