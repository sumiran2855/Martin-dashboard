import { useEffect } from "react";

interface FormData {
  companyName: string;
  cvrNumber: string;
  address: string;
  postnr: string;
  city: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  contactEmail: string;
  contactPhone: string;
}

interface StepTwoFormData {
  systemName: string;
  XRGINumber: string;
  address: string;
  postalCode: string;
  city: string;
  serviceCost: string;
  vat: string;
  m3: string;
  independentDKK: string;
  dependentDKK: string;
  kWh: string;
  electricityIndependentDKK: string;
  electricityDependentDKK: string;
}

const useFormPersistence = (
  step: number,
  formData: FormData,
  stepTwoFormData: StepTwoFormData
) => {
  useEffect(() => {
    localStorage.setItem("formData", JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    localStorage.setItem("stepTwoFormData", JSON.stringify(stepTwoFormData));
  }, [stepTwoFormData]);

  const clearFormData = () => {
    localStorage.removeItem("formData");
    localStorage.removeItem("stepTwoFormData");
  };

  return { clearFormData };
};

export default useFormPersistence;
