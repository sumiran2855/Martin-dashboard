interface StepperProps {
  step: number;
}

export default function Stepper({ step }: StepperProps) {
  const steps = [
    "Create Profile",
    "Register First Plant",
    "Installation",
    // "Payment Info",
  ];

  return (
    <div className="flex items-center justify-center w-full mb-10 px-4 max-w-5xl mx-auto">
      <div className="flex items-center justify-between w-full">
        {steps.map((title, index) => (
          <div key={index} className="flex items-center flex-1">
            <div
              className={`w-12 h-12 flex items-center justify-center rounded-full font-bold ${
                step >= index + 1
                  ? "bg-yellow-500 text-white"
                  : "bg-gray-300 text-gray-600"
              }`}
            >
              {index + 1}
            </div>
            <span
              className={`ml-2 text-sm ${
                step === index + 1
                  ? "text-gray-800 font-semibold"
                  : "text-gray-400"
              }`}
            >
              {title}
            </span>
            {index < steps.length - 1 && (
              <div
                className={`h-1 flex-1 mx-2 ${
                  step > index + 1 ? "bg-yellow-500" : "bg-gray-300"
                }`}
              ></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
