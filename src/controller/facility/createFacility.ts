import { useState } from "react";
import { addFacility } from "@/services/stepperServices";

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
      SystemCostsInfo: {
        service_Costs: parseFloat(stepTwoFormData.serviceCost),
        VAT_Deduction_Percent: parseFloat(stepTwoFormData.vat),
        VAT_Deduction: stepTwoFormData.VATDeduction === "Yes",
      },
      gas_Consumption: {
        annual_gas_consumption_m3: parseFloat(stepTwoFormData.m3),
        xrgi_gas_type: stepTwoFormData.gasType,
        gas_fixed_costs_dkk: stepTwoFormData.independentDKK,
        gas_variable_costs_dkk: stepTwoFormData.dependentDKK,
      },
      electircity_Consumption: {
        annual_grid_consumption_kwh: stepTwoFormData.kWh,
        fixed_costs_dkk: stepTwoFormData.electricityIndependentDKK,
        variable_costs_dkk: stepTwoFormData.electricityDependentDKK,
      },
    };

    try {
      await addFacility(token, IdToken, payload);
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
