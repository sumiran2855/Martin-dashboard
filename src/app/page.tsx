"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/services/authService";
import { InputField } from "@/components/form/InputField";
import { setCookie, removeCookie } from "@/utils/cookies";
import { encryptData } from "@/utils/encryption";
import { useRememberMe } from "@/controller/rememberMe";
import { decodeAccessToken } from "@/utils/encryption";
import Modal from "@/components/modals/modal";
import EmailVarification from "@/components/emailVarification";

interface LoginValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

export default function Login() {
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isVerificationStep, setIsVerificationStep] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState("");
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
    rememberMe: Yup.boolean(),
  });

  const formik = useFormik<LoginValues>({
    initialValues: { email: "", password: "", rememberMe: false },
    validationSchema,
    onSubmit: async (values) => {
      setError("");
      setSuccessMessage("");

      const result = await login(values.email, values.password);
      if (!result.success) {
        if (
          result.message ===
          "User is not confirmed. Please verify your account."
        ) {
          setUnverifiedEmail(values.email);
          setIsOpen(true);
          return;
        }
        setError(result.message || "Invalid email or password.");
        return;
      }

      const journeyStatus = result.data.userData.journeyStatus;
      localStorage.setItem("journeyStatus", journeyStatus);
      setSuccessMessage("Login successful! Redirecting...");

      if (values.rememberMe) {
        setCookie("rememberedEmail", values.email, 1);
        setCookie("rememberedPassword", encryptData(values.password), 1);
      } else {
        removeCookie("rememberedEmail");
        removeCookie("rememberedPassword");
      }

      const accessToken = result.data.tokens.accessToken;
      const decodedToken = decodeAccessToken(accessToken);
      if (decodedToken?.["cognito:groups"]?.includes("ServiceTechnician")) {
        router.push("/admin");
      } else {
        router.push(
          journeyStatus === "completed" ? "/dashboard" : "/createProfile"
        );
      }
    },
  });

  useRememberMe(formik.setValues);

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="w-full md:w-1/3 flex flex-col justify-center px-6 md:px-12 bg-white">
        {!isVerificationStep ? (
          <>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Login</h2>

            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
            {successMessage && (
              <p className="text-green-600 text-sm mb-3">{successMessage}</p>
            )}

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
                  <input
                    checked={formik.values.rememberMe}
                    onChange={(e) =>
                      formik.setFieldValue("rememberMe", e.target.checked)
                    }
                    type="checkbox"
                    className="mr-2"
                  />{" "}
                  Remember me
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
          </>
        ) : (
          <EmailVarification email={unverifiedEmail} />
        )}
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
        title="Verify Your Email"
        message="Your account is not verified. Please verify your email to continue."
        primaryButton="Verify email"
        onPrimaryClick={() => setIsVerificationStep(true)}
      />
    </div>
  );
}
