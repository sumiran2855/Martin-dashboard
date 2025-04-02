"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Stepper from "@/components/Stepper";
import CreateProfile from "@/components/steps/createProfile";
import CreateFacility from "@/components/steps/createFacility";
import Installation from "@/components/steps/Installation";
import NavigationButtons from "@/components/NavigationButtons";
import withAuth from "@/auth/authUtils";
import { useRouter } from "next/navigation";
import Modal from "@/components/modals/modal";
import { createProfile, getCustomer } from "@/services/customerServices";
import { getFacility, createFacility } from "@/services/facilityServices";
import { termsText } from "@/components/dashboard/staticData/Data";
import TermsModal from "@/components/modals/acceptTerms";

function Dashboard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [setupSuperSaver, setSetupSuperSaver] = useState<boolean>(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [hasServiceProvider, setHasServiceProvider] = useState(false);
  const [facilityMethod, setFacilityMethod] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [partnerDetails, setPartnerDetails] = useState({
    name: "",
    mobile: "",
    email: "",
  });

  const getAuthTokens = () => {
    const token = localStorage.getItem("token");
    const IdToken = localStorage.getItem("IdToken");
    if (!token || !IdToken) {
      console.error("Authorization token missing.");
      return null;
    }
    return { token, IdToken };
  };

  useEffect(() => {
    const journeyStatus = localStorage.getItem("journeyStatus") || "";
    const journeyMapping: Record<string, () => void> = {
      profileInfo: () => {
        setStep(1);
        handleGetCustomer();
      },
      facilityInfo: () => {
        setStep(2);
        handleGetFacility();
      },
      installationInfo: () => setStep(3),
    };

    if (journeyMapping[journeyStatus]) {
      journeyMapping[journeyStatus]();
    } else {
      router.push("/dashboard");
    }
  }, []);

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

  const [stepTwoFormData, setStepTwoFormData] = useState({
    systemName: "",
    XRGINumber: "",
    model: "",
    status:"",
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
    serviceProviderName: "",
    serviceProviderMail: "",
    serviceProviderPhone: "",
    installationMethod : "",
    partnerName:"",
    partnerMobile:"",
    partnerEmail:""
  });

  const handleSubscription = async () => {
    setIsSubscribed(true);
    setIsOpen(true);

    if (selectedOption) {
      await handleCreateFacility();
    }
    localStorage.setItem("journeyStatus", "completed");
    await handleCreateProfile(true);
  };

  const handleCreateProfile = async (updateOnly = false) => {
    const auth = getAuthTokens();
    if (!auth) return false;

    const { token, IdToken } = auth;
    const journeyStatus = localStorage.getItem("journeyStatus");

    const formatPhoneNumber = (phone: string, countryCode: string) => {
      return countryCode + phone;
    };

    const payload = updateOnly
      ? { journeyStatus }
      : {
          companyInfo: {
            ...formData,
            phone: formatPhoneNumber(formData.phone, formData.countryCode),
          },
          contactPerson: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            personalEmail: formData.personalEmail,
            personalPhone: formatPhoneNumber(
              formData.personalPhone,
              formData.personalCountryCode
            ),
          },
          journeyStatus,
        };

    try {
      const response = await createProfile(token, IdToken, payload);
      console.log("create profile success:", response);

      if (!updateOnly) {
        localStorage.setItem("journeyStatus", "facilityInfo");
      } else if (journeyStatus === "facilityInfo") {
        localStorage.setItem("journeyStatus", "installationInfo");
      }
      return true;
    } catch (error) {
      console.error("Error submitting step 1:", error);
      return false;
    }
  };

  const handleCreateFacility = async () => {
    const token = localStorage.getItem("token");
    const IdToken = localStorage.getItem("IdToken");
    if (!token || !IdToken) {
      console.error("Authorization token missing.");
      return false;
    }

    const payload = {
      name: stepTwoFormData.systemName,
      xrgiID: stepTwoFormData.XRGINumber,
      modelNumber: stepTwoFormData.model,
      location: {
        address: stepTwoFormData.address,
        postalCode: stepTwoFormData.postalCode,
        city: stepTwoFormData.city,
      },
      serviceProvider: hasServiceProvider ? {
        name: stepTwoFormData.serviceProviderName,
        mailAddress: stepTwoFormData.serviceProviderMail,
        phone: stepTwoFormData.serviceProviderPhone,
      } : null,
      systemCosts: {
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
      isInstalled,
      DaSigned: isChecked,
      hasServiceContract: hasServiceProvider ? true : false,
      feature:
          setupSuperSaver
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

    try {
      const response = await createFacility(token, IdToken, payload);
      console.log("create facility success", response);

      await handleCreateProfile(true);
      return true;
    } catch (error) {
      console.error("Error submitting creating facility:", error);
      return false;
    }
  };

  const handleGetCustomer = async () => {
    const auth = getAuthTokens();
    if (!auth) return false;

    const { token, IdToken } = auth;
    const splitPhoneNumber = (fullPhoneNumber: string) => {
      if (!fullPhoneNumber) return { phone: "", countryCode: "" };
      const phone = fullPhoneNumber.slice(-10);
      const countryCode = fullPhoneNumber.slice(0, -10);
      return { phone, countryCode };
    };

    try {
      const customerData = await getCustomer(token, IdToken);
      if (customerData) {
        const { phone, countryCode } = splitPhoneNumber(customerData.phone);
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
    }
  };

  const handleGetFacility = async () => {
    const token = localStorage.getItem("token");
    const IdToken = localStorage.getItem("IdToken");

    if (!token || !IdToken) {
      console.error("Authorization token missing.");
      return;
    }

    try {
      const facilityData = await getFacility(token, IdToken);
      if (facilityData) {
        setStepTwoFormData({
          systemName: facilityData.name || "",
          XRGINumber: facilityData.xrgiID || "",
          model: facilityData.modelNumber || "",
          status: facilityData.status || "",
          address: facilityData.location.address || "",
          postalCode: facilityData.location.postalCode || "",
          city: facilityData.location.city || "",

          serviceCost: facilityData.systemCosts.serviceCost || "5.75",
          vat: facilityData.systemCosts.vat || "12",
          VATDeduction: facilityData.systemCosts.VATDeduction || "",

          m3: facilityData.gas_Consumption.m3 || "",
          gasType: facilityData.gas_Consumption.gasType || "",
          independentDKK: facilityData.gas_Consumption.independentDKK || "",
          dependentDKK: facilityData.gas_Consumption.dependentDKK || "",

          kWh: facilityData.electircity_Consumption.kWh || "",
          electricityIndependentDKK:
            facilityData.electircity_Consumption.electricityIndependentDKK ||
            "",
          electricityDependentDKK:
            facilityData.electircity_Consumption.electricityDependentDKK || "",
          serviceProviderName: facilityData.serviceProvider.name || "",
          serviceProviderMail: facilityData.serviceProvider.mailAddress || "",
          serviceProviderPhone: facilityData.serviceProvider.phone || "",
          installationMethod: facilityData.feature.method || "",
          partnerName: facilityData.feature.partner_details.name || "",
          partnerMobile: facilityData.feature.partner_details.mobile || "",
          partnerEmail: facilityData.feature.partner_details.email || "",
        });
      }

      if(facilityData?.isInstalled){
        setIsInstalled(facilityData.isInstalled);
        setFacilityMethod(facilityData.feature.method);
      }
      if(facilityData?.featureAdded){
        setSetupSuperSaver(facilityData.featureAdded);
      }

      const { serviceProvider } = facilityData || {};
      if (
        serviceProvider &&
        serviceProvider.name &&
        serviceProvider.mailAddress &&
        serviceProvider.phone
      ) {
        setHasServiceProvider(true);
      }
    } catch (error) {
      console.error("Error fetching facility data:", error);
    }
  };

  const handleAcceptTerms = async () => {
    setIsTermsOpen(false);

    const success = await handleCreateFacility();
    if (success) {
      setStep(3);
    }
  };

  const nextStep = async () => {
    if (step === 1) {
      await handleCreateProfile();
      await handleGetFacility();
      setStep((prev) => Math.min(prev + 1, 4));
    } else if (step === 2) {
      setIsTermsOpen(true);
    }
  };

  const prevStep = async () => {
    if (step === 2) {
      await handleGetCustomer();
    } else if (step === 3) {
      await handleGetFacility();
    }
    setStep((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className="flex bg-gray-50">
      {step === 1 && !isSubscribed && <Sidebar />}
      <div
        className={`flex-1 transition-all ${
          step === 1 ? "pl-[300px]" : "pl-0"
        } p-10 flex flex-col items-center`}
      >
        {isSubscribed ? (
          <Modal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            title="Subscription Activated! 🎉"
            message="Your subscription has been successfully started. You now have
               access to all premium features."
            primaryButton="Go to Dashboard"
            onPrimaryClick={() => {
              router.push("/dashboard");
            }}
          />
        ) : (
          <>
            <Stepper step={step} />
            <div className="bg-white p-6 rounded-lg shadow w-full max-w-7xl ">
              {step === 1 && (
                <CreateProfile formData={formData} setFormData={setFormData} />
              )}
              {step === 2 && (
                <CreateFacility
                  stepTwoFormData={stepTwoFormData}
                  setStepTwoFormData={setStepTwoFormData}
                  isInstalled={isInstalled}
                  setIsInstalled={setIsInstalled}
                  hasServiceProvider={hasServiceProvider}
                  setHasServiceProvider={setHasServiceProvider}
                />
              )}
              {step === 3 && (
                <Installation
                  selectedOption={selectedOption}
                  setSelectedOption={setSelectedOption}
                  partnerDetails={partnerDetails}
                  setPartnerDetails={setPartnerDetails}
                  setupSuperSaver={setupSuperSaver}
                  setSetupSuperSaver={setSetupSuperSaver}
                  facilityMethod={facilityMethod}
                  setFacilityMethod={setFacilityMethod}
                />
              )}
            </div>
            <NavigationButtons
              step={step}
              nextStep={nextStep}
              prevStep={prevStep}
              saveForLater={handleCreateFacility}
              handleSubscription={handleSubscription}
            />
          </>
        )}
      </div>

      <TermsModal
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
        title="Terms and Conditions"
        termsContent={termsText}
        onAccept={handleAcceptTerms}
        isChecked={isChecked}
        setIsChecked={setIsChecked}
      />
    </div>
  );
}

export default withAuth(Dashboard);
