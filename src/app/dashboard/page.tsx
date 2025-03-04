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
function Dashboard() {
  const [step, setStep] = useState(1);

  const [isStep1Valid, setIsStep1Valid] = useState(false);
  const [isStep2Valid, setIsStep2Valid] = useState(false);

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

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
  const [stepTwoFormData , setStepTwoFormData] = useState({
    systemName:"",
    XRGINumber:"",
    address:"",
    postalCode:"",
    city:"",
    serviceCost:"5.75",
    vat:"12",
    m3:"",
    independentDKK:"",
    dependentDKK:"",
    kWh:"",
    electricityIndependentDKK:"",
    electricityDependentDKK:""
  })

  return (
    <div className="flex bg-gray-50">
      {step === 1 && <Sidebar />}
      <div className={`flex-1 transition-all ${step === 1 ? "pl-[300px]" : "pl-0"} p-10 flex flex-col items-center`}>
        <Stepper step={step} />
        <div className="bg-white p-6 rounded-lg shadow w-full max-w-7xl ">
          {step === 1 && <StepOne validateForm={setIsStep1Valid} formData={formData} setFormData={setFormData} />}
          {step === 2 && <StepTwo validateForm={setIsStep2Valid} stepTwoFormData={stepTwoFormData} setStepTwoFormData={setStepTwoFormData}/>}
          {step === 3 && <StepThree />}
          {step === 4 && <StepFour />}
        </div>
        <NavigationButtons step={step} nextStep={nextStep} prevStep={prevStep} isNextDisabled={(step === 1 && isStep1Valid)}/>
      </div>
    </div>
  );
}

export default withAuth(Dashboard);