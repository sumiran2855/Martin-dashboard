"use client";

import { FC } from "react";
import { Button, Modal } from "react-bootstrap";
import { X } from "lucide-react";

interface ModalProps {
  show: boolean;
  onHide: () => void;
}

const GenericModal: FC<ModalProps> = ({ show, onHide }) => {
  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header className="relative flex justify-center border-0">
        <Modal.Title className="text-xl font-semibold text-gray-900">
          XRGI ID Number
        </Modal.Title>
        <button
          onClick={onHide}
          className="absolute right-4 top-4 text-gray-600 hover:text-gray-800"
        >
          <X size={20} />
        </button>
      </Modal.Header>
      <Modal.Body className="text-center text-gray-700 px-6">
        <p>
          The XRGI ID number is located at the back of your system, right under
          the middle. You are welcome to contact us if you cannot find it on
          your machine.
        </p>
      </Modal.Body>
      <div className="flex justify-center">
        <img
          src="/_DialogImage_.png"
          alt="XRGI Machine"
          className="w-124 h-auto rounded-lg"
        />
      </div>
      <Modal.Footer className="border-0 flex justify-center">
        <Button
          variant="primary"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md w-full "
        >
          Contact Support
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default GenericModal;
