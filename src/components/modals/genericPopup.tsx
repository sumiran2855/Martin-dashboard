"use client";

import { FC, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { X, Mail, Phone, HelpCircle } from "lucide-react";

interface ModalProps {
  show: boolean;
  onHide: () => void;
}

const GenericModal: FC<ModalProps> = ({ show, onHide }) => {
  const [showContactInfo, setShowContactInfo] = useState(false);

  const toggleContactInfo = () => {
    setShowContactInfo(!showContactInfo);
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered className="border-0">
      <Modal.Header className="relative flex items-center justify-center border-0 bg-white rounded-t-lg py-4">
        <Modal.Title className="text-xl font-bold text-gray-900 flex items-center">
          <span className="mr-2">XRGI ID Number</span>
        </Modal.Title>
        <button
          onClick={onHide}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1"
          aria-label="Close"
        >
          <X size={20} />
        </button>
      </Modal.Header>

      <Modal.Body className="text-center text-gray-700 px-6 py-2 bg-white">
        <p className="text-lg mb-4">
          The XRGI ID number is located at the back of your system, right under
          the middle. You are welcome to contact us if you cannot find it on
          your machine.
        </p>

        <div className="flex justify-center mb-6">
          <div className="relative w-full md:w-4/5 lg:w-3/4 overflow-hidden rounded-lg shadow-md">
            <img
              src="/XRGIID.png"
              alt="XRGI Machine"
              className="w-full h-auto"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent text-white text-xs py-1 px-2 text-center">
              XRGI ID Location
            </div>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer className="flex flex-col gap-4 px-6 pb-2 pt-0 border-0 bg-white rounded-b-lg">
        {showContactInfo && (
          <div className="w-full bg-blue-50 rounded-lg p-4 border border-blue-100 transition-all duration-300 ease-in-out">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <HelpCircle size={20} className="text-blue-600 mr-2" />
              Support Contact Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <Mail className="text-blue-600" size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-500">
                    Email Support
                  </span>
                  <a href="mailto:support@ecpower.dk"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    support@ecpower.dk
                  </a>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <Phone className="text-blue-600" size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-500">
                    Phone Support
                  </span>
                  <a
                    href="tel:+18005551234"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                   +4587414300
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        <Button
          onClick={toggleContactInfo}
          className={`w-full py-3 rounded-lg font-semibold shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            showContactInfo
              ? "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500 border border-gray-300"
              : "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"
          }`}
        >
          {showContactInfo ? "Hide Contact Information" : "Contact Support"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default GenericModal;
