import React, { useState } from "react";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  termsContent: string[];
  onAccept: () => void;
  isChecked: boolean;
  setIsChecked: (value: boolean) => void;
}

const TermsModal: React.FC<TermsModalProps> = ({
  isOpen,
  onClose,
  title,
  termsContent,
  onAccept,
  isChecked,
  setIsChecked,
}) => {

  if (!isOpen) return null;

  const handleAccept = () => {
    if (isChecked) {
      onAccept();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex backdrop-blur-sm items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-lg min-w-[350px] w-full mx-4 text-left">
        <div className="flex justify-between items-center mb-4 border-b pb-3">
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        <div className="mt-2 h-64 overflow-y-auto border border-gray-200 rounded-md p-4 text-left bg-gray-50">
          {termsContent.map((para:any, idx:any) => (
            <div
              key={idx}
              className="mb-4 whitespace-pre-line text-sm text-gray-700"
            >
              {para}
            </div>
          ))}
        </div>

        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="acceptTerms"
              checked={isChecked}
              onChange={() => setIsChecked(!isChecked)}
              className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <label htmlFor="acceptTerms" className="text-gray-700 text-sm">
              I have read and agree to the Terms and Conditions
            </label>
          </div>

        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition text-sm font-medium"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className={`bg-blue-600 text-white py-2 px-4 rounded-md transition text-sm font-medium ${
              isChecked ? "hover:bg-blue-700" : "opacity-50 cursor-not-allowed"
            }`}
            onClick={handleAccept}
            disabled={!isChecked}
          >
            Accept Terms
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;
