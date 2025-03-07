import { apiRequest } from "@/utils/apiClient";

export const login = async (email: string, password: string) => {
  const result = await apiRequest("login", "POST", { email, password });

  if (result.success) {
    localStorage.setItem("token", result.data.accessToken);
    localStorage.setItem("IdToken", result.data.idToken);
  }

  return result;
};

export const signup = async (
  firstname: string,
  lastname: string,
  countryCode: string,
  phoneNumber: string,
  email: string,
  password: string
) => {
  return await apiRequest("signup", "POST", {
    name: `${firstname} ${lastname}`,
    phone_number: `${countryCode}${phoneNumber}`,
    email,
    password,
  });
};

export const verifyEmail = async (email: string, verificationCode: string) => {
  return await apiRequest("verifyEmail", "POST", {
    email,
    code: verificationCode,
  });
};

export const resendVerificationCode = async (email: string) => {
  return await apiRequest("resendEmailVerificationCode", "POST", { email });
};
