import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  primaryButton: string;
  onPrimaryClick: () => void;
  secondaryButton?: string;
  onSecondaryClick?: () => void;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  primaryButton,
  onPrimaryClick,
  secondaryButton,
  onSecondaryClick,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-30 flex backdrop-blur-sm items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg min-w-[300px] w-auto text-center">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-gray-600 mt-2 break-words">{message}</p>
        <div className={`mt-4 flex ${secondaryButton ? "justify-between" : "justify-center"} gap-3`}>
          {secondaryButton && onSecondaryClick && (
            <button
              className="border border-gray-400 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-100 transition"
              onClick={() => {
                onSecondaryClick();
                onClose();
              }}
            >
              {secondaryButton}
            </button>
          )}
          <button
            className="bg-blue-900 text-white py-2 px-4 rounded-md hover:bg-blue-800 transition"
            onClick={() => {
              onPrimaryClick();
              onClose();
            }}
          >
            {primaryButton}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
