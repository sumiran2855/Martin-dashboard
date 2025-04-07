import { useState } from "react";
import { addFacility } from "@/services/facilityServices";

export function useCreateFacility() {
  const [stepTwoFormData, setStepTwoFormData] = useState({
    systemName: "",
    XRGINumber: "",
    model: "",
    address: "",
    postalCode: "",
    city: "",
    status: "",
    annualSavings:"",
    co2Savings:"",
    operatingHours:"",
    industry:"",
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
    hasServiceProvider?: boolean,
    setupSuperSaver?: boolean,
    hasPerformanceReport?:boolean,
    selectedOption?:string,
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
      performance_report:{
        annualSavings:stepTwoFormData.annualSavings,
        co2Savings:stepTwoFormData.co2Savings,
        operatingHours:stepTwoFormData.operatingHours,
        industry:stepTwoFormData.industry,
      },
      hasPerformanceReport:hasPerformanceReport || false,
      isInstalled: isInstalled || false,
      DaSigned: DaSigned || false,
      hasServiceContract : hasServiceProvider || false,
      feature: setupSuperSaver
          ? {
              method: selectedOption || "",
              partner_details:
                selectedOption === "local_partner"
                  ? {
                      name: partnerDetails.name || "",
                      mobile: partnerDetails.mobile || "",
                      email: partnerDetails.email || "",
                    }
                  : undefined,
            }
          : null,
      featureAdded: setupSuperSaver ? true : false,
    };

    if (hasServiceProvider) {
      payload.serviceProvider = {
        name: stepTwoFormData.serviceProviderName || "",
        mailAddress: stepTwoFormData.serviceProviderMail || "",
        phone: stepTwoFormData.serviceProviderPhone || "",
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
    partnerDetails,
    setPartnerDetails,
  };
}
