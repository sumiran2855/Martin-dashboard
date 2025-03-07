"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Stepper from "@/components/Stepper";
import StepOne from "@/components/steps/StepOne";
import StepTwo from "@/components/steps/StepTwo";
import StepThree from "@/components/steps/StepThree";
import StepFour from "@/components/steps/StepFour";
import NavigationButtons from "@/components/NavigationButtons";
import withAuth from "@/auth/authUtils";
import { useRouter } from "next/navigation";
import useFormPersistence from "@/components/utils/useFormPersistence";
import Modal from "@/components/modals/modal";
import { createFacility, createProfile } from "@/services/stepperServices";

function Dashboard() {
  const router = useRouter();
  const [step, setStep] = useState(() => {
    return Number(localStorage.getItem("currentStep")) || 1;
  });
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [formData, setFormData] = useState(() => {
    const storedData = localStorage.getItem("formData");
    return storedData
      ? JSON.parse(storedData)
      : {
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
        };
  });

  const [stepTwoFormData, setStepTwoFormData] = useState(() => {
    const storedData = localStorage.getItem("stepTwoFormData");
    return storedData
      ? JSON.parse(storedData)
      : {
          systemName: "",
          XRGINumber: "",
          model: "",
          address: "",
          postalCode: "",
          city: "",
          serviceCost: "5.75",
          vat: "12",
          VATDeduction: "",
          m3: "",
          gasType: "",
          independentDKK: "",
          dependentDKK: "",
          kWh: "",
          electricityIndependentDKK: "",
          electricityDependentDKK: "",
        };
  });

  const handleSubscription = () => {
    setIsSubscribed(true);
    setIsOpen(true);
  };

  const { clearFormData } = useFormPersistence(step, formData, stepTwoFormData);

  const handleCreateProfile = async () => {
    const token = localStorage.getItem("token");
    const IdToken = localStorage.getItem("IdToken");
    if (!token || !IdToken) {
      console.error("Authorization token missing.");
      return false;
    }

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
      await createProfile(token, IdToken, payload);
      console.log("Step 1 submitted successfully");
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
      console.log("Step 2 submitted successfully");
      return true;
    } catch (error) {
      console.error("Error submitting step 2:", error);
      return false;
    }
  };

  const nextStep = async () => {
    if (step === 1) {
      await handleCreateProfile();
    } else if (step == 2) {
      await handleCreateFacility();
    }
    setStep((prev) => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
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
              clearFormData();
              router.push("/dashboard");
            }}
          />
        ) : (
          <>
            <Stepper step={step} />
            <div className="bg-white p-6 rounded-lg shadow w-full max-w-7xl ">
              {step === 1 && (
                <StepOne formData={formData} setFormData={setFormData} />
              )}
              {step === 2 && (
                <StepTwo
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
              handleSubscription={handleSubscription}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default withAuth(Dashboard);
