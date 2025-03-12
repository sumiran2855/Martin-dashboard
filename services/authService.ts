import { apiRequest } from "@/utils/apiClient";

// login
export const login = async (email: string, password: string) => {
  const result = await apiRequest("login", "POST", { email, password });

  if (result.success) {
    localStorage.setItem("token", result.data.tokens.accessToken);
    localStorage.setItem("IdToken", result.data.tokens.idToken);
    localStorage.setItem("userId", result.data.userData.id);
  }

  return result;
};

//signup
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

// verify email
export const verifyEmail = async (email: string, verificationCode: string) => {
  return await apiRequest("verifyEmail", "POST", {
    email,
    code: verificationCode,
  });
};

// resend verification code
export const resendVerificationCode = async (email: string) => {
  return await apiRequest("resendEmailVerificationCode", "POST", { email });
};

// forget password
export const forget_Password = async (email: string) => {
  return await apiRequest("forgot-password", "POST", { email });
};

// reset password
export const resetPassword = async (
  email: string,
  newPassword: string,
  code: string
) => {
  return await apiRequest("reset-password", "POST", { email, newPassword, code });
};
