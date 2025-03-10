"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/services/authService";
import { InputField } from "@/components/form/InputField";

interface LoginValues {
  email: string;
  password: string;
}

export default function Login() {
  const [error, setError] = useState("");
  const router = useRouter();

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Invalid email format"
      )
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
  });

  const formik = useFormik<LoginValues>({
    initialValues: { email: "", password: "" },
    validationSchema,
    onSubmit: async (values) => {
      setError("");

      const result = await login(values.email, values.password);
      const journeyStatus = result.data.userData.journeyStatus;
      localStorage.setItem("journeyStatus", journeyStatus);

      if (!result.success) {
        setError(result.message);
        return;
      }
      
      if (journeyStatus === "completed") {
        router.push("/dashboard");
      } else {
        router.push("/createProfile");
      }
    },
  });

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="w-full md:w-1/3 flex flex-col justify-center px-6 md:px-12 bg-white">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Login</h2>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <form onSubmit={formik.handleSubmit} noValidate>
          <InputField
            label="Email"
            type="email"
            formikKey="email"
            formikProps={formik}
          />
          <InputField
            label="Password"
            type="password"
            formikKey="password"
            formikProps={formik}
          />

          <div className="flex items-center justify-between text-sm mb-6">
            <label className="flex items-center cursor-pointer">
              <input type="checkbox" className="mr-2" /> Remember me
            </label>
            <Link
              href="/forgetPassword"
              className="text-blue-600 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-900 text-white py-3 rounded-md hover:bg-blue-800 transition cursor-pointer"
            disabled={!formik.isValid || formik.isSubmitting}
          >
            Login
          </button>
        </form>

        <p className="text-sm text-gray-600 mt-4">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="text-blue-700 font-semibold hover:underline"
          >
            Create an account
          </Link>
        </p>
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
    </div>
  );
}
