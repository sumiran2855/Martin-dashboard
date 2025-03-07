"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { countryCodes } from "@/components/dashboard/staticData/Data";

const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function Signup() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [countryCode, setCountryCode] = useState("+45");
  const [isVerificationStep, setIsVerificationStep] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [email, setEmail] = useState("");
  const [resendMessage, setResendMessage] = useState("");

  const validationSchema = Yup.object({
    firstname: Yup.string().required("firstname is required"),
    lastname: Yup.string().required("lastname is required"),
    phone_number: Yup.string()
      .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
      .required("Phone number is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), ""], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      firstname: "",
      lastname: "",
      phone_number: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setError("");
      setSuccess("");
      setEmail(values.email);

      try {
        const response = await fetch(`${apiUrl}/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: values.firstname + " " + values.lastname,
            phone_number: countryCode + values.phone_number,
            email: values.email,
            password: values.password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Signup failed");
        }

        setSuccess(
          "Signup successful! Please check your email for the verification code."
        );
        setIsVerificationStep(true);
      } catch (err: any) {
        setError(err.message);
      }
    },
  });

  const handleVerifyCode = async () => {
    setError("");
    setSuccess("");

    try {
      console.log(
        "🚀 ~ handleVerifyCode ~ verificationCode:",
        verificationCode
      );
      console.log("🚀 ~ handleVerifyCode ~ email:", email);
      const response = await fetch(`${apiUrl}/verifyEmail`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: verificationCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Verification failed");
      }

      setSuccess("Verification successful! Redirecting...");
      setTimeout(() => (window.location.href = "/"), 2000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleResendCode = async () => {
    setResendMessage("");
    setError("");

    try {
      const response = await fetch(`${apiUrl}/resendEmailVerificationCode`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to resend verification code");
      }

      setResendMessage("A new verification code has been sent to your email.");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="w-full md:w-1/3 flex flex-col justify-center px-6 md:px-12 bg-white">
        {!isVerificationStep ? (
          <>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Signup
            </h2>

            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
            {success && (
              <p className="text-green-500 text-sm mb-3">{success}</p>
            )}

            <form onSubmit={formik.handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                <div>
                  <input
                    type="text"
                    name="firstname"
                    placeholder="First Name"
                    className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.firstname}
                  />
                  {formik.touched.firstname && formik.errors.firstname && (
                    <p className="text-red-500 text-sm">
                      {formik.errors.firstname}
                    </p>
                  )}
                </div>
                <div>
                  <input
                    type="text"
                    name="lastname"
                    placeholder="Last Name"
                    className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.lastname}
                  />
                  {formik.touched.lastname && formik.errors.lastname && (
                    <p className="text-red-500 text-sm">
                      {formik.errors.lastname}
                    </p>
                  )}
                </div>
              </div>

              <input
                type="email"
                name="email"
                placeholder="Email"
                className="w-full px-4 py-3 mb-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 text-sm mb-3">
                  {formik.errors.email}
                </p>
              )}
              <div className="flex items-center w-full gap-2 mb-2">
                <div className="relative w-1/5">
                  <select
                    className="p-3 w-full border rounded-md outline-none bg-white cursor-pointer appearance-none pr-6"
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                  >
                    {countryCodes.map((country) => (
                      <option
                        key={country.code}
                        className="p-2 text-gray-700 bg-white hover:bg-gray-100"
                        value={country.code}
                      >
                        {country.flag} {country.code}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="w-4/5">
                  <input
                    type="phone_number"
                    name="phone_number"
                    placeholder="Phone Number"
                    className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.phone_number}
                  />
                </div>
              </div>
              {formik.touched.phone_number && formik.errors.phone_number && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.phone_number}
                </p>
              )}

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
              {formik.touched.confirmPassword &&
                formik.errors.confirmPassword && (
                  <p className="text-red-500 text-sm mb-3">
                    {formik.errors.confirmPassword}
                  </p>
                )}

              <button
                type="submit"
                className="w-full bg-blue-900 text-white py-3 rounded-md hover:bg-blue-800 transition cursor-pointer mt-4"
                disabled={!formik.isValid || formik.isSubmitting}
              >
                Signup
              </button>
            </form>

            <p className="text-sm text-gray-600 mt-4">
              Already have an account?{" "}
              <Link
                href="/"
                className="text-blue-700 font-semibold hover:underline"
              >
                Login
              </Link>
            </p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Verify Your Email
            </h2>
            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
            {success && (
              <p className="text-green-500 text-sm mb-3">{success}</p>
            )}
            {resendMessage && <p className="text-green-500 text-sm mb-3">{resendMessage}</p>}

            <input
              type="text"
              placeholder="Enter Verification Code"
              className="w-full px-4 py-3 mb-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              onChange={(e) => setVerificationCode(e.target.value)}
            />

            <button
              onClick={handleVerifyCode}
              className="w-full bg-blue-900 text-white py-3 rounded-md hover:bg-blue-800 transition cursor-pointer mt-4"
            >
              Verify Code
            </button>

            <p className="text-sm text-gray-600 mt-4">
              Didn't receive the code?{" "}
              <button
                onClick={handleResendCode}
                className="text-blue-700 font-semibold hover:underline focus:outline-none"
              >
                Resend Code
              </button>
            </p>
          </>
        )}
      </div>

      <div className="hidden md:flex w-2/3 items-center justify-center bg-gray-100 relative">
        <div className="w-[80%] h-[80%] relative">
          <Image
            src="/Green Industry.png"
            alt="Signup Illustration"
            layout="fill"
            objectFit="contain"
            className="rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
