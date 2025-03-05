"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Stepper from "@/components/Stepper";
import StepOne from "@/components/steps/StepOne";
import StepTwo from "@/components/steps/StepTwo";
import StepThree from "@/components/steps/StepThree";
import StepFour from "@/components/steps/StepFour";
import NavigationButtons from "@/components/NavigationButtons";
import withAuth from "@/components/Auth/authUtils";
import { useRouter } from "next/navigation";
function Dashboard() {
  const [step, setStep] = useState(1);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isStep1Valid, setIsStep1Valid] = useState(false);
  const [isStep2Valid, setIsStep2Valid] = useState(false);

  const router = useRouter();
  const [formData, setFormData] = useState({
    companyName: "",
    cvrNumber: "",
    address: "",
    postnr: "",
    city: "",
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
    contactEmail: "",
    contactPhone: "",
  });
  const [stepTwoFormData, setStepTwoFormData] = useState({
    systemName: "",
    XRGINumber: "",
    address: "",
    postalCode: "",
    city: "",
    serviceCost: "5.75",
    vat: "12",
    m3: "",
    independentDKK: "",
    dependentDKK: "",
    kWh: "",
    electricityIndependentDKK: "",
    electricityDependentDKK: "",
  });

  const handleSubscription = () => {
    setIsSubscribed(true);
  };

  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const IdToken = localStorage.getItem("IdToken");

      if (!token || !IdToken) {
        console.error("Authorization token missing.");
        return false;
      }
  
      const response = await fetch(`${apiUrl}/get-customer`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "x-id-token": IdToken,
        },
      });
  
      if (!response.ok) throw new Error("Failed to fetch profile");
  
      const result = await response.json();
      setFormData({
        companyName: result.companyInfo?.name || "",
        cvrNumber: result.companyInfo?.cvr_number || "",
        address: result.companyInfo?.address || "",
        postnr: result.companyInfo?.postal_code || "",
        city: result.companyInfo?.city || "",
        email: result.companyInfo?.email || "",
        phone: result.companyInfo?.phone || "",
        firstName: result.contactPerson?.firstName || "",
        lastName: result.contactPerson?.lastName || "",
        contactEmail: result.contactPerson?.email || "",
        contactPhone: result.contactPerson?.phone || "",
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };
  
  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    const IdToken = localStorage.getItem("IdToken");
    if (!token || !IdToken) {
      console.error("Authorization token missing.");
      return false;
    }
    const APIUrl = `${apiUrl}/create-Profile`;
    const payload = {
      companyInfo: {
        name: formData.companyName,
        cvr_number: formData.cvrNumber,
        address: formData.address,
        city: formData.city,
        postal_code: formData.postnr,
        email: formData.email,
        phone: formData.phone,
      },
      contactPerson: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.contactEmail,
        phone: formData.contactPhone,
      },
    };

    try {
      const response = await fetch(APIUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "x-id-token":`${IdToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to create profile");
      }

      const result = await response.json();
      console.log("Profile created successfully:", result);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const nextStep = async () => {
    if (step === 1) {
      await handleSubmit();
    }
    setStep((prev) => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
    if (step === 2) fetchProfile(); 
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
          <div className="flex items-center justify-center min-h-screen bg-gray-50 p-10">
            <div className="bg-white px-8 py-20 rounded-lg shadow w-full max-w-7xl text-center">
              <h2 className="text-3xl font-semibold text-gray-800">
                Subscription Activated! 🎉
              </h2>
              <p className="text-gray-600 mt-4">
                Your subscription has been successfully started. You now have
                access to all premium features.
              </p>
              <div className="mt-6">
                <button
                  className="bg-blue-900 text-white px-6 py-3 rounded-md hover:bg-blue-800 transition"
                  onClick={() => router.push("/dashboard")}
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <Stepper step={step} />
            <div className="bg-white p-6 rounded-lg shadow w-full max-w-7xl ">
              {step === 1 && (
                <StepOne
                  validateForm={setIsStep1Valid}
                  formData={formData}
                  setFormData={setFormData}
                />
              )}
              {step === 2 && (
                <StepTwo
                  validateForm={setIsStep2Valid}
                  stepTwoFormData={stepTwoFormData}
                  setStepTwoFormData={setStepTwoFormData}
                />
              )}
              {step === 3 && <StepThree />}
              {step === 4 && <StepFour />}
            </div>
            <NavigationButtons
              step={step}
              nextStep={nextStep}
              prevStep={prevStep}
              isNextDisabled={step === 1 && isStep1Valid}
              handleSubscription={handleSubscription}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default withAuth(Dashboard);
