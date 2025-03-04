"use client";
import { useFormik } from "formik";
import * as Yup from "yup";
import Image from "next/image";
// import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Values {
  email: string;
}

export default function forgetPassword() {
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Invalid email format"
      )
      .required("Email is required"),
  });

  const formik = useFormik<Values>({
    initialValues: { email: "" },
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
            onClick={() => setIsOpen(true)}
          >
            Forget Password
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
      {isOpen && (
        <div className="fixed inset-0 bg-opacity-30 flex backdrop-blur-sm items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96 text-center">
            <h3 className="text-lg font-semibold">Email Sent</h3>
            <p className="text-gray-600 mt-2">
              An email has been sent to you to reset your password.
            </p>
            <button
              className="mt-4 w-full bg-blue-900 text-white py-2 rounded-md hover:bg-blue-800 transition"
              onClick={() => {
                setIsOpen(false);
                router.push("/");
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
