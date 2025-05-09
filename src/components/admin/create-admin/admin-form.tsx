"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { useState, useMemo } from "react";
import { countryCodes } from "@/components/dashboard/staticData/Data";
import { createAdmin } from "@/services/authService";
import { InputField } from "@/components/form/InputField";
import Modal from "@/components/modals/modal";
import { useRouter } from "next/navigation";

const getPhoneValidationSchema = (countryCode: string) => {
  const phoneValidations: { [key: string]: Yup.StringSchema } = {
    "+91": Yup.string()
      .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
      .required("Phone number is required"),
    "+45": Yup.string()
      .matches(/^\d{8}$/, "Phone number must be exactly 8 digits")
      .required("Phone number is required"),
  };
  return phoneValidations[countryCode] || phoneValidations["+91"];
};

export default function AdminForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [countryCode, setCountryCode] = useState("+45");
  const [email, setEmail] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const phoneValidationSchema = useMemo(
    () => getPhoneValidationSchema(countryCode),
    [countryCode]
  );

  const validationSchema = useMemo(
    () =>
      Yup.object({
        firstname: Yup.string().required("First name is required"),
        lastname: Yup.string().required("Last name is required"),
        phone_number: phoneValidationSchema,
        email: Yup.string()
          .email("Invalid email address")
          .required("Email is required"),
      }),
    [phoneValidationSchema]
  );

  const formik = useFormik({
    initialValues: {
      firstname: "",
      lastname: "",
      phone_number: "",
      email: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setError("");
      setSuccess("");
      setEmail(values.email);
      const token = localStorage.getItem("token") || "";
      const IdToken = localStorage.getItem("IdToken") || "";
      const result = await createAdmin(
        values.email,
        values.firstname,
        values.lastname,
        countryCode,
        values.phone_number,
        token,
        IdToken
      );

      if (!result.success) {
        setError(result.message);
        return;
      }
      setSuccess(result.message);
      setIsOpen(true);
    },
  });

  return (
    <div className="flex-1 overflow-auto md:p-12">
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] px-4 bg-gray-50">
        <div className="w-full md:max-w-2xl bg-white p-6 sm:p-10 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Create new admin
          </h2>
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          {success && <p className="text-green-500 text-sm mb-3">{success}</p>}
          <form onSubmit={formik.handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
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
            <div className="mb-6">
              <InputField
                label="Email"
                type="email"
                name="email"
                formikKey="email"
                formikProps={formik}
              />
            </div>
            <div className="flex items-center w-full gap-2 mb-6">
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

            <button
              type="submit"
              className="w-full bg-blue-900 text-white py-3 rounded-md hover:bg-blue-800 transition cursor-pointer mt-4"
              disabled={!formik.isValid || formik.isSubmitting}
            >
              Create new admin
            </button>
          </form>
        </div>
      </div>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Admin created successfully"
        message="A temporary password has been sent to your email. Please use it to log in and update your password."
        primaryButton="OK"
        onPrimaryClick={() => router.push("/admin")}
      />
    </div>
  );
}
