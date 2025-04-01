"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { countryCodes } from "@/components/dashboard/staticData/Data";
import { signup } from "@/services/authService";
import { InputField } from "@/components/form/InputField";
import EmailVarification from "@/components/emailVarification";
import { PasswordField } from "@/components/form/passwordField";

export default function Signup() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [countryCode, setCountryCode] = useState("+45");
  const [isVerificationStep, setIsVerificationStep] = useState(false);
  const [email, setEmail] = useState("");
  const [phoneValidationSchema, setPhoneValidationSchema] = useState(Yup.string());

  useEffect(() => {
    const getPhoneValidation = () => {
      switch (countryCode) {
        case "+91": 
          return Yup.string()
            .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
            .required("Phone number is required");
        case "+45": 
          return Yup.string()
            .matches(/^\d{8}$/, "Phone number must be exactly 8 digits")
            .required("Phone number is required");
        default:
          return Yup.string()
            .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
            .required("Phone number is required");
      }
    };

    setPhoneValidationSchema(getPhoneValidation());
  }, [countryCode]);

  const validationSchema = Yup.object({
    firstname: Yup.string().required("firstname is required"),
    lastname: Yup.string().required("lastname is required"),
    phone_number: phoneValidationSchema,
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

      const result = await signup(
        values.firstname,
        values.lastname,
        countryCode,
        values.phone_number,
        values.email,
        values.password
      );

      if (!result.success) {
        setError(result.message);
        return;
      }

      setSuccess(result.message);
      setIsVerificationStep(true);
    },
  });

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
                  <InputField
                    label="First Name"
                    type="text"
                    name="firstname"
                    formikKey="firstname"
                    formikProps={formik}
                  />
                </div>
                <div>
                  <InputField
                    label="Last Name"
                    type="text"
                    name="lastname"
                    formikKey="lastname"
                    formikProps={formik}
                  />
                </div>
              </div>
              <InputField
                label="Email"
                type="email"
                name="email"
                formikKey="email"
                formikProps={formik}
              />
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

              <PasswordField
                label="Password"
                type="password"
                name="password"
                formikKey="password"
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
          <EmailVarification email={email} />
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