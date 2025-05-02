"use client";

import { useState } from "react";
import Image from "next/image";
import ForgetPasswordForm from "@/components/authForm/ForgetPasswordForm";
import ChangePasswordForm from "@/components/authForm/ChangePasswordForm";
import Modal from "@/components/modals/modal";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

export default function AuthPage() {
  const { t } = useTranslation("login");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    action: () => {},
  });
  const router = useRouter();
  const handleModal = (title: string, message: string, action: () => void) => {
    setModalContent({ title, message, action: action || (() => {}) });
    setIsOpen(true);
  };

  return (
    <div className="flex h-screen max-md:flex-col-reverse max-md:justify-center">
      <div className="w-full md:w-1/3 flex flex-col justify-center px-6 md:px-12 bg-white max-lg:w-2/4 max-md:w-full">
        {isChangingPassword ? (
          <ChangePasswordForm
            email={email}
            onSuccess={() =>
              handleModal(
                t("passwordChanged"),
                t("passwordChangedMessage"),
                () => router.push("/")
              )
            }
          />
        ) : (
          <ForgetPasswordForm
            onSuccess={(enteredEmail) => {
              setEmail(enteredEmail);
              handleModal(
                t("emailSent"),
                t("emailSentMessage"),
                () => setIsChangingPassword(true)
              );
            }}
          />
        )}
      </div>

      <div className="flex w-2/3 items-center justify-center bg-gray-100 relative max-lg:w-2/4 max-md:w-full max-md:h-48">
        <div className="w-[80%] h-[80%] relative">
          <Image
            src="/Green Industry.png"
            alt="Illustration"
            layout="fill"
            objectFit="contain"
            className="rounded-lg"
          />
        </div>
        
      </div>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={modalContent.title}
        message={modalContent.message}
        primaryButton="Ok"
        onPrimaryClick={() => {
          modalContent.action();
          setIsOpen(false);
        }}
      />
    </div>
  );
}


