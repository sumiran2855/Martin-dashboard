"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { change_Admin_Password } from "@/services/authService";
import { PasswordField } from "@/components/form/passwordField";
import Modal from "@/components/modals/modal";

export default function ChangeAdminPassword() {
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const formik = useFormik({
    initialValues: { code: "", newPassword: "", confirmPassword: "" },
    validationSchema: Yup.object({
      newPassword: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword"), ""], "Passwords must match")
        .required("Confirm Password is required"),
    }),
    onSubmit: async (values) => {
      setError("");
      try {
        const email = localStorage.getItem("email") || "";
        const session = localStorage.getItem("SessionId") || "";
        const response = await change_Admin_Password(
          email,
          values.newPassword,
          session
        );
        if (response.success) {
          localStorage.removeItem("email");
          localStorage.removeItem("SessionId");
          setIsOpen(true);
        }

        if (!response.success) {
          setError(response.message || "Failed to reset password. Try again.");
          return;
        }
      } catch (err) {
        setError("Something went wrong. Please try again.");
      }
    },
  });

  return (
    <>
      <div className="flex h-screen max-md:flex-col-reverse max-md:justify-center">
        <div className="w-full md:w-1/3 flex flex-col justify-center px-6 md:px-12 bg-white max-lg:w-2/4 max-md:w-full">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Change Password
          </h2>
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

          <form onSubmit={formik.handleSubmit} noValidate>
            <PasswordField
              label="newPassword"
              type="password"
              name="password"
              formikKey="newPassword"
              formikProps={formik}
            />
            <PasswordField
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              formikKey="confirmPassword"
              formikProps={formik}
            />

            <button
              type="submit"
              className="w-full bg-blue-900 text-white py-3 rounded-md hover:bg-blue-800 transition cursor-pointer mt-3"
              disabled={!formik.isValid || formik.isSubmitting}
              onClick={() => router.push("/admin")}
            >
              Change Password
            </button>
          </form>
        </div>
        <div className="flex w-2/3 items-center justify-center bg-gray-100 relative max-lg:w-2/4 max-md:w-full max-md:h-48">
          <div className="w-[100%] h-[100%] relative">
            <Image
              src="/ECP_XRGI_installation.jpg"
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
          title="Password Changed Successfully"
          message="You can now log in using your new password."
          primaryButton="Verify email"
          onPrimaryClick={() => router.push("/")}
        />
      </div>
    </>
  );
}
