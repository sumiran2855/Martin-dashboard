interface NavigationButtonsProps {
  step: number;
  nextStep: () => void;
  prevStep: () => void;
  isNextDisabled?: boolean;
  saveForLater?: () => void;
  handleSubscription: () => void;
}

export default function NavigationButtons({
  step,
  nextStep,
  prevStep,
  isNextDisabled,
  saveForLater,
  handleSubscription,
}: NavigationButtonsProps) {
  return (
    <div className="flex justify-between w-full max-w-7xl mt-6">
      {step > 1 && step < 4 ? (
        <button
          onClick={prevStep}
          className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-800 transition"
        >
          Back
        </button>
      ) : (
        <div></div>
      )}
      <div className="flex gap-4">
        {step === 2 && (
          <button
            onClick={saveForLater}
            className="border border-gray-400 text-white px-6 py-3 rounded-md hover:bg-blue-800 transition bg-blue-500"
          >
            Save for later
          </button>
        )}
        <button
          onClick={step === 4 ? handleSubscription : nextStep}
          disabled={isNextDisabled}
          className={`${
            isNextDisabled
              ? "bg-gray-400"
              : "bg-blue-500 text-white hover:bg-blue-800"
          } text-white px-6 py-3 rounded-md transition ml-auto`}
        >
          {step === 4 ? "Start Subscription" : "Next"}
        </button>
      </div>
    </div>
  );
}
