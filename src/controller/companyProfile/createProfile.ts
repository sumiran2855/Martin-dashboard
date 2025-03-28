import { useEffect, useState } from "react";
import { getCustomer } from "@/services/customerServices";

export function getProfile() {
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    companyName: "",
    cvrNumber: "",
    address: "",
    postal_code: "",
    city: "",
    email: "",
    countryCode: "",
    phone: "",
    firstName: "",
    lastName: "",
    personalEmail: "",
    personalPhone: "",
    personalCountryCode: "",
  });

  useEffect(() => {
    const fetchCustomer = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
    const IdToken = localStorage.getItem("IdToken");
    if (!token || !IdToken) {
      console.log("Authorization token missing.");
      setLoading(false);
      return;
    }

    const splitPhoneNumber = (fullPhoneNumber: string) => {
      if (!fullPhoneNumber) return { phone: "", countryCode: "" };
      const phone = fullPhoneNumber.slice(-10);
      const countryCode = fullPhoneNumber.slice(0, -10);
      return { phone, countryCode };
    };

    try {
      const customerData = await getCustomer(token, IdToken);
      if (customerData) {
        const { phone, countryCode } = splitPhoneNumber(
          customerData.phone
        );
        const { phone: personalPhone, countryCode: personalCountryCode } =
          splitPhoneNumber(customerData.personalPhone);
        setFormData((prev: any) => ({
          ...prev,
          ...customerData,
          phone,
          countryCode,
          personalPhone,
          personalCountryCode,
        }));
      }
    } catch (error) {
      console.error("Error fetching customer data:", error);
    } finally {
      setLoading(false);
    }
    };

    fetchCustomer();
  }, []);

  return {formData,setFormData,loading};
}
