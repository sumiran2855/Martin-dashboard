"use client";

import { useState } from "react";
import Image from "next/image";
import ForgetPasswordForm from "@/components/authForm/ForgetPasswordForm";
import ChangePasswordForm from "@/components/authForm/ChangePasswordForm";
import Modal from "@/components/modals/modal";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [modalContent, setModalContent] = useState({ title: "", message: "", action: () => {} });
  const router = useRouter();
  const handleModal = (title: string, message: string, action: () => void) => {
    setModalContent({ title, message,  action: action || (() => {}) });
    setIsOpen(true);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="w-full md:w-1/3 flex flex-col justify-center px-6 md:px-12 bg-white">
        {isChangingPassword ? (
          <ChangePasswordForm  email={email} onSuccess={() => handleModal("Password Changed", "Your password has been successfully changed.", () => router.push("/") )} />
        ) : (
          <ForgetPasswordForm
            onSuccess={(enteredEmail) =>{setEmail(enteredEmail); handleModal("Email Sent", "An email has been sent to reset your password.", () => setIsChangingPassword(true))}}
          />
        )}
      </div>

      <div className="hidden md:flex w-2/3 items-center justify-center bg-gray-100 relative">
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


