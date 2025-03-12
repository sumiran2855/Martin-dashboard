"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { forget_Password } from "@/services/authService";
import Link from "next/link";

export default function ForgetPasswordForm({
  onSuccess,
}: {
  onSuccess: (email:string) => void;
}) {
  const [error, setError] = useState("");

  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
    }),
    onSubmit: async (values) => {
      setError("");
      try {
        const response = await forget_Password(values.email);
        if (!response.success) {
          setError(response.message || "Something went wrong.");
          return;
        }
        onSuccess(values.email);
      } catch (err) {
        setError("Failed to send reset email. Please try again.");
      }
    },
  });

  return (
    <>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Forget Password
      </h2>
      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      <form onSubmit={formik.handleSubmit} noValidate>
        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-3 mb-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          {...formik.getFieldProps("email")}
        />
        {formik.touched.email && formik.errors.email && (
          <p className="text-red-500 text-sm mb-3">{formik.errors.email}</p>
        )}

        <button
          type="submit"
          className="w-full bg-blue-900 text-white py-3 rounded-md hover:bg-blue-800 transition cursor-pointer mt-3"
          disabled={!formik.isValid || formik.isSubmitting}
        >
          Forget Password
        </button>
      </form>
      <p className="text-sm text-gray-600 mt-4">
        Remembered your password?{" "}
        <Link href="/" className="text-blue-700 font-semibold hover:underline">
          Go back to login
        </Link>
      </p>
    </>
  );
}
