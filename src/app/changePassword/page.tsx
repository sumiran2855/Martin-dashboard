"use client";
import { useFormik } from "formik";
import * as Yup from "yup";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/modals/modal";

interface Values {
  password: string;
  confirmPassword: string;
}

export default function changePassword() {
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();

  const validationSchema = Yup.object({
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), ""], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const formik = useFormik<Values>({
    initialValues: { password: "", confirmPassword: "" },
    validationSchema,
    onSubmit: async (values) => {
      setError("");
      setIsOpen(true);
    },
  });
  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="w-full md:w-1/3 flex flex-col justify-center px-6 md:px-12 bg-white">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Change Password
        </h2>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <form onSubmit={formik.handleSubmit} noValidate>
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full px-4 py-3 mb-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
          />
          {formik.touched.password && formik.errors.password && (
            <p className="text-red-500 text-sm mb-3">
              {formik.errors.password}
            </p>
          )}

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            className="w-full px-4 py-3 mb-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.confirmPassword}
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <p className="text-red-500 text-sm mb-3">
              {formik.errors.confirmPassword}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-900 text-white py-3 rounded-md hover:bg-blue-800 transition cursor-pointer mt-3"
            disabled={!formik.isValid || formik.isSubmitting}
            onClick={() => setIsOpen(true)}
          >
            Change Password
          </button>
        </form>
      </div>

      <div className="hidden md:flex w-2/3 items-center justify-center bg-gray-100 relative">
        <div className="w-[80%] h-[80%] relative">
          <Image
            src="/Green Industry.png"
            alt="Login Illustration"
            layout="fill"
            objectFit="contain"
            className="rounded-lg"
          />
        </div>
      </div>

      
       <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Password Changed"
        message="Your password has been successfully changed."
        primaryButton="Ok"
        onPrimaryClick={() => router.push("/")}
        />

    </div>
  );
}
