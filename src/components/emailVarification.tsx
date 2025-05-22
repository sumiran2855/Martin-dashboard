import { resendVerificationCode, verifyEmail } from "@/services/authService";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Modal from "./modals/modal";

export default function emailVarification({ 
  email, 
  onVerificationSuccess,
  onResendSuccess
}: { 
  email: string;
  onVerificationSuccess?: () => void;
  onResendSuccess?:() => void;
}) {
  const { t } = useTranslation("login");
  const [verificationCode, setVerificationCode] = useState("");
  const [resendMessage, setResendMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  const handleVerifyCode = async () => {
    setError("");
    setSuccess("");
    const result = await verifyEmail(email, verificationCode);

    if (!result.success) {
      setError(result.message);
      return;
    }
    
    setSuccess(result.message);

    if (onVerificationSuccess) {
      onVerificationSuccess();
    }
  };

  const handleResendCode = async () => {
    setResendMessage("");
    setError("");
    const result = await resendVerificationCode(email);
    if (!result.success) {
      setError(result.message);
      return;
    }
    
    if (onResendSuccess) {
      onResendSuccess();
    } 
    setResendMessage(result.message);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleModalPrimaryClick = () => {
    if (modalTitle === t("emailVerifiedTitle")) {
      setTimeout(() => (window.location.href = "/"), 500);
    }
  };

  return (
    <>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        {t("verifyEmailTitle")}
      </h2>
      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
      {success && <p className="text-green-500 text-sm mb-3">{success}</p>}
      {resendMessage && (
        <p className="text-green-500 text-sm mb-3">{resendMessage}</p>
      )}

      <input
        type="text"
        placeholder={t("verifyEmailPlaceholder")}
        className="w-full px-4 py-3 mb-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
        onChange={(e) => setVerificationCode(e.target.value)}
      />

      <button
        onClick={handleVerifyCode}
        className="w-full bg-blue-900 text-white py-3 rounded-md hover:bg-blue-800 transition cursor-pointer mt-4"
      >
        {t("VerifyEmailButton")}
      </button>

      <p className="text-sm text-gray-600 mt-4">
        {t("didNotreceiveCode")}{" "}
        <button
          onClick={handleResendCode}
          className="text-blue-700 font-semibold hover:underline focus:outline-none"
        >
          {t("ResendCode")}
        </button>
      </p>

      <Modal
        isOpen={showModal}
        onClose={handleModalClose}
        title={modalTitle}
        message={modalMessage}
        primaryButton="OK"
        onPrimaryClick={handleModalPrimaryClick}
      />
    </>
  );
}