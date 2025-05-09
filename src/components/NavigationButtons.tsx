import { useTranslation } from "react-i18next";

interface NavigationButtonsProps {
  step: number;
  nextStep: () => void;
  prevStep: () => void;
  saveForLater?: () => void;
  handleSubscription: () => void;
}

export default function NavigationButtons({ step, nextStep, prevStep, saveForLater, handleSubscription }: NavigationButtonsProps) {
  const {t} = useTranslation("CreateProfile")
  return (
    <div className="flex justify-between w-full max-w-7xl mt-6">
      {step > 1 && step < 4 ? (
        <button onClick={prevStep} className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-800 transition" >
          {t("back")}
        </button>
      ) : (
        <div></div>
      )}
      <div className="flex gap-4">
        {step === 2 && (
        <button onClick={saveForLater} className="border border-gray-400 text-white px-6 py-3 rounded-md hover:bg-blue-800 transition bg-blue-500"> 
          {t("saveForLater")}
        </button>
        )}
        <button onClick={step === 3 ? handleSubscription : nextStep} className="bg-blue-500 hover:bg-blue-800 text-white px-6 py-3 rounded-md transition ml-auto"> 
          {step === 3 ? t("save") : t("next")} 
        </button>
      </div>
    </div>
  );
}
