"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { resendVerificationCode, resetPassword } from "@/services/authService";
import Link from "next/link";
import { PasswordField } from "../form/passwordField";

interface ChangePasswordFormProps {
  email: string;
  onSuccess: () => void;
}

export default function ChangePasswordForm({
  email,
  onSuccess,
}: ChangePasswordFormProps) {
  const [error, setError] = useState("");
  const router = useRouter();
  const formik = useFormik({
    initialValues: { code: "", newPassword: "", confirmPassword: "" },
    validationSchema: Yup.object({
      code: Yup.string()
        .min(6, "Code must be at least 6 characters")
        .required("Code is required"),
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
        const response = await resetPassword(
          email,
          values.newPassword,
          values.code
        );

        if (!response.success) {
          setError(response.message || "Failed to reset password. Try again.");
          return;
        }

        onSuccess();
      } catch (err) {
        setError("Something went wrong. Please try again.");
      }
    },
  });

  // need to fix
  const handleResendCode = async () => {
    setError("");

    try {
      const response = await resendVerificationCode(email);
      if (response.success) {
        console.log("A new verification code has been sent to your email.");
      } else {
        setError(response.message || "Failed to resend code. Try again.");
      }
    } catch (err) {
      setError("An error occurred while resending the code. Please try again.");
    }
  };

  return (
    <>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Change Password
      </h2>
      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      <form onSubmit={formik.handleSubmit} noValidate>
        <input
          type="text"
          //   name="code"
          placeholder="Verification code"
          className="w-full px-4 py-3 mb-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          {...formik.getFieldProps("code")}
        />
        {formik.touched.code && formik.errors.code && (
          <p className="text-red-500 text-sm mb-3">{formik.errors.code}</p>
        )}

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
        >
          Change Password
        </button>
      </form>
      {/* need to fix */}
      <p className="text-sm text-gray-600 mt-4">
        Didn’t receive the code?{" "}
        <button
          onClick={handleResendCode}
          className="text-blue-700 font-semibold hover:underline focus:outline-none"
        >
          Resend Code
        </button>
      </p>
    </>
  );
}
