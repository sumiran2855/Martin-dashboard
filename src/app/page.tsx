"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import Image from "next/image";
import Link from "next/link";
import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/services/authService";
import { InputField } from "@/components/form/InputField";
import { setCookie, removeCookie } from "@/utils/cookies";
import { encryptData, decodeAccessToken } from "@/utils/encryption";
import { useRememberMe } from "@/controller/rememberMe";
import Modal from "@/components/modals/modal";
import EmailVarification from "@/components/emailVarification";
import { PasswordField } from "@/components/form/passwordField";
import { useTranslation } from "react-i18next";

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
  const [hasMounted, setHasMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { t, i18n } = useTranslation("login");
  const validationSchema = Yup.object({
    email: Yup.string()
      .email(t("invalidEmail"))
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        t("invalidEmail")
      )
      .required(t("emailRequired")),
    password: Yup.string()
      .min(8, t("passwordMin"))
      .required(t("passwordRequired")),
    rememberMe: Yup.boolean(),
  });

  useEffect(() => {
    setHasMounted(true);
    const savedLang = localStorage.getItem("language");
    if (savedLang && i18n.language !== savedLang) {
      i18n.changeLanguage(savedLang);
    }
  }, []);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("language", lng);
    localStorage.setItem("i18nextLng", lng);
  };

  const setupAndStoreUserData = async (result:any) => {
    if (result.data.tokens.accessToken) {
      localStorage.setItem("accessToken", result.data.tokens.accessToken);
    }
    
    if (result.data.tokens.refreshToken) {
      localStorage.setItem("refreshToken", result.data.tokens.refreshToken);
    }
    
    const journeyStatus = result.data.userData.journeyStatus;
    localStorage.setItem("journeyStatus", journeyStatus);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return journeyStatus;
  }

  const redirectUser = useCallback(
    async (accessToken: string, journeyStatus: string) => {
      const decodedToken = decodeAccessToken(accessToken);
      const isServiceTechnician = decodedToken?.["cognito:groups"]?.includes("ServiceTechnician");
      
      const redirectPath = isServiceTechnician 
        ? "/admin" 
        : journeyStatus === "completed"
          ? "/dashboard"
          : "/createProfile";
      
      router.push(redirectPath);
    },
    [router]
  );

  const handleSubmit = useCallback(
    async (values: LoginValues) => {
      setError("");
      setSuccessMessage("");
      setIsLoading(true);

      try {
        const result = await login(values.email, values.password);
        if (result?.data?.tokens?.sessionToken) {
          localStorage.setItem("SessionId", result.data.tokens.sessionToken);
          localStorage.setItem("email", result.data.userData.email);
          router.push("/admin/reset-password");
          return;
        }
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

        if (values.rememberMe) {
          setCookie("rememberedEmail", values.email, 1);
          setCookie("rememberedPassword", encryptData(values.password), 1);
        } else {
          removeCookie("rememberedEmail");
          removeCookie("rememberedPassword");
        }
        
        setSuccessMessage("Login successful! Redirecting...");
        
        const journeyStatus = await setupAndStoreUserData(result);     
        await redirectUser(result.data.tokens.accessToken, journeyStatus);
      } catch (err) {
        console.error("Login error:", err);
        setError("An unexpected error occurred. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [redirectUser]
  );

  const formik = useFormik<LoginValues>({
    initialValues: { email: "", password: "", rememberMe: false },
    validationSchema,
    onSubmit: handleSubmit,
  });

  useRememberMe(formik.setValues);
  if (!hasMounted) return null;

  const languages = [
    { code: "da", label: "Danish" },
    { code: "de", label: "German" },
    { code: "it", label: "Italian" },
    { code: "en", label: "English" },
  ];

  return (
    <div className="flex h-screen max-md:flex-col-reverse max-md:justify-center">
      <div className="w-full md:w-1/3 flex flex-col justify-center px-6 md:px-12 bg-white max-lg:w-2/4 max-md:w-full">
        {!isVerificationStep ? (
          <>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              {t("login")}
            </h2>
            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
            {successMessage && (
              <p className="text-green-600 text-sm mb-3">{successMessage}</p>
            )}

            <form onSubmit={formik.handleSubmit} noValidate>
              <InputField
                label={t("email")}
                type="email"
                formikKey="email"
                formikProps={formik}
              />
              <PasswordField
                label={t("password")}
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
                  {t("rememberMe")}
                </label>
                <Link
                  href="/forgetPassword"
                  className="text-blue-600 hover:underline"
                >
                  {t("forgotPassword")}
                </Link>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-900 text-white py-3 rounded-md hover:bg-blue-800 transition cursor-pointer"
                disabled={!formik.isValid || formik.isSubmitting || isLoading}
              >
                {t("login")}
              </button>
            </form>

            <p className="text-sm text-gray-600 mt-4">
              {t("createAccountPrompt")}{" "}
              <Link
                href="/signup"
                className="text-blue-700 font-semibold hover:underline"
              >
                {t("createAccountLink")}
              </Link>
            </p>
            <ul className="flex flex-wrap gap-2 font-sm justify-center">
              {languages.map(({ code, label }) => (
                <li key={code}>
                  <button
                    onClick={() => changeLanguage(code)}
                    className={`no-underline text-blue-900 relative focus:outline-none ${
                      i18n.language === code
                        ? "font-bold underline text-blue"
                        : ""
                    }`}
                  >
                    {label} {code !== "en" && "|"}
                  </button>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <EmailVarification email={unverifiedEmail} />
        )}
      </div>

      <div className="flex w-2/3 items-center justify-center bg-gray-100 relative max-lg:w-2/4 max-md:w-full max-md:h-48">
        <div className="w-[80%] h-[80%] relative max-md:h-52">
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
        title={t("verifyEmailTitle")}
        message={t("verifyEmailMessage")}
        primaryButton={t("verifyEmailButton")}
        onPrimaryClick={() => setIsVerificationStep(true)}
      />
    </div>
  );
}
