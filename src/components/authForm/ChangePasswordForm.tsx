"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { forget_Password, resetPassword } from "@/services/authService";
import { PasswordField } from "../form/passwordField";
import { useTranslation } from "react-i18next";

interface ChangePasswordFormProps {
  email: string;
  onSuccess: () => void;
}

export default function ChangePasswordForm({
  email,
  onSuccess,
}: ChangePasswordFormProps) {
  const [error, setError] = useState("");
  const { t } = useTranslation("signup");

  const formik = useFormik({
    initialValues: { code: "", newPassword: "", confirmPassword: "" },
    validationSchema: Yup.object({
      code: Yup.string()
        .min(6, t("changePassword.codeMin"))
        .required(t("changePassword.codeRequired")),
      newPassword: Yup.string()
        .min(8, t("changePassword.passwordMin"))
        .required(t("changePassword.passwordRequired")),
      confirmPassword: Yup.string()
        .oneOf(
          [Yup.ref("newPassword"), ""],
          t("changePassword.passwordsMustMatch")
        )
        .required(t("changePassword.confirmPasswordRequired")),
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
          setError(response.message || t("changePassword.resetFailed"));
          return;
        }
        onSuccess();
      } catch (err) {
        setError(t("changePassword.generalError"));
      }
    },
  });


  const handleResendCode = async () => {
    setError("");
    try {
      const response = await forget_Password(email);
      if (response.success) {
        console.log("A new verification code has been sent to your email.");
      } else {
        setError(response.message || t("changePassword.resendFailed"));
      }
    } catch (err) {
      setError(t("changePassword.resendError"));
    }
  };

  return (
    <>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        {t("changePassword.heading")}
      </h2>
      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      <form onSubmit={formik.handleSubmit} noValidate>
        <input
          type="text"
          placeholder={t("changePassword.codePlaceholder")}
          className="w-full px-4 py-3 mb-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          {...formik.getFieldProps("code")}
        />
        {formik.touched.code && formik.errors.code && (
          <p className="text-red-500 text-sm mb-3">{formik.errors.code}</p>
        )}

        <PasswordField
          label={t("changePassword.newPassword")}
          type="password"
          name="password"
          formikKey="newPassword"
          formikProps={formik}
        />
        <PasswordField
          label={t("changePassword.confirmPassword")}
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
          {t("changePassword.submit")}
        </button>
      </form>
      <p className="text-sm text-gray-600 mt-4">
        {t("changePassword.noCode")}{" "}
        <button
          onClick={handleResendCode}
          className="text-blue-700 font-semibold hover:underline focus:outline-none"
        >
          {t("changePassword.resend")}
        </button>
      </p>
    </>
  );
}
