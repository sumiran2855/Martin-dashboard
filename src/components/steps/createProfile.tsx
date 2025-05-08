import { countryCodes } from "@/components/dashboard/staticData/Data";
import { useTranslation } from "react-i18next";
interface ValidateFormProps {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}
export default function createProfile({
  formData,
  setFormData,
}: ValidateFormProps) {
  const { t } = useTranslation("CreateProfile");
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-[#082351DE] mb-2 ">
      {t("title")}
      </h2>
      <p className="text-gray-600 mb-6">
      {t("subtitle")}
      </p>
      <div className="bg-white p-6 rounded-lg mb-6 border border-gray-200">
        <h3 className="text-xl font-semibold text-[#082351DE] mb-2">
        {t("companyInfo.title")}
        </h3>
        <p className="text-gray-600 mb-6">
        {t("companyInfo.description")}
        </p>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="companyName"
            placeholder={t("companyInfo.companyName")}
            className="border p-3 rounded w-full"
            value={formData.companyName}
            onChange={handleChange}
          />

          <input
            type="text"
            name="cvrNumber"
            placeholder={t("companyInfo.cvrNumber")}
            className="border p-3 rounded w-full"
            value={formData.cvrNumber}
            onChange={handleChange}
          />
          <input
            type="text"
            name="address"
            placeholder={t("companyInfo.address")}
            className="border p-3 rounded w-full"
            value={formData.address}
            onChange={handleChange}
          />
          <div className="flex items-center w-full gap-2">
            <input
              type="text"
              name="postal_code"
              placeholder={t("companyInfo.postalCode")}
              className="p-3 border rounded outline-none w-1/6"
              value={formData.postal_code}
              onChange={handleChange}
            />
            <input
              type="text"
              name="city"
              placeholder={t("companyInfo.city")}
              className="p-3 border rounded outline-none w-5/6"
              value={formData.city}
              onChange={handleChange}
            />
          </div>

          <input
            type="text"
            name="email"
            placeholder={t("companyInfo.email")}
            className="border p-3 rounded w-full"
            value={formData.email}
            onChange={handleChange}
          />
          <div className="flex items-center w-full gap-2">
            <div className="relative w-1/6">
              <select
                name="countryCode"
                value={formData.countryCode}
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
              name="phone"
              placeholder={t("companyInfo.phone")}
              className="p-3 w-5/6 border rounded outline-none"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg mb-6 border border-gray-200">
        <h3 className="text-xl font-semibold text-[#082351DE] mb-2">
        {t("contactPerson.title")}
        </h3>
        <p className="text-gray-600 mb-6">
        {t("contactPerson.description")}
        </p>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="firstName"
            placeholder={t("contactPerson.firstName")}
            className="border p-3 rounded w-full"
            value={formData.firstName}
            onChange={handleChange}
          />
          <input
            type="text"
            name="lastName"
            placeholder={t("contactPerson.lastName")}
            className="border p-3 rounded w-full"
            value={formData.lastName}
            onChange={handleChange}
          />
          <input
            type="text"
            name="personalEmail"
            placeholder={t("contactPerson.email")}
            className="border p-3 rounded w-full"
            value={formData.personalEmail}
            onChange={handleChange}
          />
          <div className="flex items-center w-full gap-2">
            <div className="relative w-1/6">
              <select
                name="personalCountryCode"
                value={formData.personalCountryCode}
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
              name="personalPhone"
              placeholder={t("contactPerson.phone")}
              className="p-3 w-5/6 border rounded outline-none"
              value={formData.personalPhone}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
    </>
  );
}
