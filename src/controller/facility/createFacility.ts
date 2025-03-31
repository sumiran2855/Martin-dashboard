import { useState } from "react";
import { addFacility } from "@/services/facilityServices";

export function useCreateFacility() {
  const [selectedOption, setSelectedOption] = useState("");
  const [stepTwoFormData, setStepTwoFormData] = useState({
    systemName: "",
    XRGINumber: "",
    model: "",
    address: "",
    postalCode: "",
    city: "",
    status: "",
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
    hasServiceProvider: "",
    serviceProviderName: "",
    serviceProviderMail: "",
    serviceProviderPhone: "",
    installationMethod: "",
    partnerName: "",
    partnerMobile: "",
    partnerEmail: "",
  });

  const [partnerDetails, setPartnerDetails] = useState({
    name: "",
    mobile: "",
    email: "",
  });

  const handleCreateFacility = async (
    DaSigned?: boolean,
    isInstalled?: boolean,
    hasServiceProvider?: boolean
  ) => {
    const token = localStorage.getItem("token");
    const IdToken = localStorage.getItem("IdToken");

    if (!token || !IdToken) {
      console.log("Authorization token missing.");
      return false;
    }

    const payload: Record<string, any> = {
      name: stepTwoFormData.systemName || "",
      xrgiID: stepTwoFormData.XRGINumber || "",
      modelNumber: stepTwoFormData.model || "",
      location: {
        address: stepTwoFormData.address || "",
        postalCode: stepTwoFormData.postalCode || "",
        city: stepTwoFormData.city || "",
      },
      systemCosts: {
        service_Costs: parseFloat(stepTwoFormData.serviceCost) || 0,
        VAT_Deduction_Percent: parseFloat(stepTwoFormData.vat) || 0,
        VAT_Deduction: stepTwoFormData.VATDeduction === "Yes",
      },
      gas_Consumption: {
        annual_gas_consumption_m3: parseFloat(stepTwoFormData.m3) || 0,
        xrgi_gas_type: stepTwoFormData.gasType || "",
        gas_fixed_costs_dkk: parseFloat(stepTwoFormData.independentDKK) || 0,
        gas_variable_costs_dkk: parseFloat(stepTwoFormData.dependentDKK) || 0,
      },
      electricity_Consumption: {
        annual_grid_consumption_kwh: parseFloat(stepTwoFormData.kWh) || 0,
        fixed_costs_dkk: parseFloat(stepTwoFormData.electricityIndependentDKK) || 0,
        variable_costs_dkk: parseFloat(stepTwoFormData.electricityDependentDKK) || 0,
      },
      isInstalled: isInstalled || false,
      DaSigned: DaSigned || false,
      hasServiceProvider: hasServiceProvider || false,
    };

    if (hasServiceProvider) {
      payload.serviceProvider = {
        name: stepTwoFormData.serviceProviderName || "",
        mailAddress: stepTwoFormData.serviceProviderMail || "",
        phone: stepTwoFormData.serviceProviderPhone || "",
      };
    }

    if (selectedOption === "local_partner") {
      payload.feature = {
        method: selectedOption,
        partner_details: {
          name: partnerDetails.name || "",
          mobile: partnerDetails.mobile || "",
          email: partnerDetails.email || "",
        },
      };
    }

    try {
      await addFacility(token, IdToken, payload);
      console.log("Facility created successfully!");
      return true;
    } catch (err) {
      console.log("Error creating facility:", err);
      return false;
    }
  };

  return {
    stepTwoFormData,
    setStepTwoFormData,
    handleCreateFacility,
    selectedOption,
    setSelectedOption,
    partnerDetails,
    setPartnerDetails,
  };
}
