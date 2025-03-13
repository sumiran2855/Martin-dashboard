import { useState } from "react";
import { createFacility } from "@/services/stepperServices";

export function useCreateFacility() {
  const [stepTwoFormData, setStepTwoFormData] = useState({
    systemName: "",
    XRGINumber: "",
    model: "",
    address: "",
    postalCode: "",
    city: "",
    serviceCost: "5.75",
    vat: "12",
    VATDeduction: "Yes",
    m3: "",
    gasType: "",
    independentDKK: "",
    dependentDKK: "",
    kWh: "",
    electricityIndependentDKK: "",
    electricityDependentDKK: "",
  });

  const handleCreateFacility = async () => {
    const token = localStorage.getItem("token");
    const IdToken = localStorage.getItem("IdToken");

    if (!token || !IdToken) {
      console.log("Authorization token missing.");
      return false;
    }

    const payload = {
      name: "newFacility",
      registerSystem: {
        systemName: stepTwoFormData.systemName,
        XRGINumber: stepTwoFormData.XRGINumber,
        model: stepTwoFormData.model,
      },
      location: {
        address: stepTwoFormData.address,
        postalCode: stepTwoFormData.postalCode,
        city: stepTwoFormData.city,
      },
      systemCost: {
        serviceCost: stepTwoFormData.serviceCost,
        vat: stepTwoFormData.vat,
        VATDeduction: stepTwoFormData.VATDeduction,
      },
      gasConsumption: {
        m3: stepTwoFormData.m3,
        gasType: stepTwoFormData.gasType,
        independentDKK: stepTwoFormData.independentDKK,
        dependentDKK: stepTwoFormData.dependentDKK,
      },
      electricityConsumption: {
        kWh: stepTwoFormData.kWh,
        electricityIndependentDKK: stepTwoFormData.electricityIndependentDKK,
        electricityDependentDKK: stepTwoFormData.electricityDependentDKK,
      },
    };

    try {
      await createFacility(token, IdToken, payload);
      console.log("Facility created successfully!");
      return true;
    } catch (err) {
      console.log("Error creating facility.");
      console.error("Error:", err);
      return false;
    }
  };

  return {
    stepTwoFormData,
    setStepTwoFormData,
    handleCreateFacility,
  };
}
