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
import TermsModal from "@/components/modals/acceptTerms";
import { useTranslation } from "react-i18next";

function Dashboard() {
  const { t: term, i18n } = useTranslation("term");
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
  const [hasPerformanceReport, setHasPerformanceReport] = useState(false);
  const [wantsServiceContract, setWantsServiceContract] = useState(false);
  const [serviceContractChoice, setServiceContractChoice] = useState("");
  const [serviceContractWantedChoice, setServiceContractWantedChoice] =
    useState("");
  const [partnerDetails, setPartnerDetails] = useState({
    name: "",
    mobile: "",
    email: "",
    countryCode: "",
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
    annualSavings:"",
    co2Savings:"",
    operatingHours:"",
    industry:"",
    email:"",
    hasPerformanceReport:"",
    needServiceContract:"",
    serviceProviderName: "",
    serviceProviderMail: "",
    serviceProviderPhone: "",
    serviceProviderCountryCode:"",
    installationMethod : "",
    partnerName:"",
    partnerMobile:"",
    partnerEmail:"",
    partnerCountryCode:"",
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
            cvrNumber:formData.cvrNumber,
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
        countryCode:stepTwoFormData.serviceProviderCountryCode
      } : null,
      performance_report:{
        annualSavings:stepTwoFormData.annualSavings,
        co2Savings:stepTwoFormData.co2Savings,
        operatingHours:stepTwoFormData.operatingHours,
        industry:stepTwoFormData.industry,
        email:stepTwoFormData.email
      },
      hasPerformanceReport:hasPerformanceReport,
      needServiceContract : wantsServiceContract ,
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
                    countryCode: partnerDetails.countryCode || "",
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
          annualSavings: facilityData.performance_report.annualSavings || "",
          co2Savings: facilityData.performance_report.co2Savings || "",
          operatingHours: facilityData.performance_report.operatingHours || "",
          industry: facilityData.performance_report.industry || "",
          email: facilityData.performance_report.email || "",
          hasPerformanceReport:facilityData.hasPerformanceReport || false,   
          needServiceContract : facilityData.needServiceContract || false,    
          serviceProviderName: facilityData.serviceProvider.name || "",
          serviceProviderMail: facilityData.serviceProvider.mailAddress || "",
          serviceProviderPhone: facilityData.serviceProvider.phone || "",
          serviceProviderCountryCode:facilityData.serviceProvider.countryCode || "",
          installationMethod: facilityData.feature.method || "",
          partnerName: facilityData.feature.partner_details.name || "",
          partnerMobile: facilityData.feature.partner_details.mobile || "",
          partnerEmail: facilityData.feature.partner_details.email || "",
          partnerCountryCode:facilityData.feature.partner_details.countryCode || "",
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

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("language", lng);
    localStorage.setItem("i18nextLng", lng);
  };

  const languages = [
    { code: "da", label: "Danish" },
    { code: "de", label: "German" },
    { code: "it", label: "Italian" },
    { code: "en", label: "English" },
  ];

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {step === 1 && !isSubscribed}
      
      <div className="fixed top-0 right-0 z-50 p-4">
        <div className="bg-white rounded-lg shadow-sm border px-4 py-2">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 font-medium">Language:</span>
            <div className="flex items-center gap-2">
              {languages.map(({ code, label }, index) => (
                <div key={code} className="flex items-center">
                  <button
                    onClick={() => changeLanguage(code)}
                    className={`text-sm transition-colors duration-200 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded px-2 py-1 ${
                      i18n.language === code 
                        ? "font-semibold text-blue-600 bg-blue-50" 
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {label}
                  </button>
                  {index < languages.length - 1 && (
                    <span className="text-gray-300 mx-1">|</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div
        className={`flex-1 transition-all duration-300 ${
          step === 1 && !isSubscribed ? "pl-[300px]" : "pl-0"
        } p-10 pt-20 flex flex-col items-center`}
      >
        {isSubscribed ? (
          <Modal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            title=""
            message={term("model.message")}
            primaryButton={term("model.primaryButton")}
            onPrimaryClick={() => {
              router.push("/dashboard");
            }} />
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
                  hasPerformanceReport={hasPerformanceReport}
                  setHasPerformanceReport={setHasPerformanceReport}
                  setWantsServiceContract={setWantsServiceContract}
                  setServiceContractChoice={setServiceContractChoice}
                  setServiceContractWantedChoice={setServiceContractWantedChoice}
                  serviceContractChoice={serviceContractChoice}
                  serviceContractWantedChoice={serviceContractWantedChoice}

                />
              )}
              {step === 3 && (
                <Installation
                 stepTwoFormData={stepTwoFormData}
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
        title={term("title")}
        termsContent={term("termsAndConsent", { returnObjects: true }) as string[] }
        onAccept={handleAcceptTerms}
        isChecked={isChecked}
        setIsChecked={setIsChecked}
      />
    </div>
  );
}

export default withAuth(Dashboard);
