import { apiRequest } from "@/utils/authHelper";
import { AUTH_API_ROUTES } from "@/routes/authRoutes";

// login
export const login = async (email: string, password: string) => {
  const result = await apiRequest(AUTH_API_ROUTES.LOGIN, "POST", {
    email,
    password,
  });

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
  return await apiRequest(AUTH_API_ROUTES.SIGNUP, "POST", {
    name: `${firstname} ${lastname}`,
    phone_number: `${countryCode}${phoneNumber}`,
    email,
    password,
  });
};

//create new admin
export const createAdmin = async (
  email: string,
  firstname: string,
  lastname: string,
  countryCode: string,
  phoneNumber: string,
  token: string,
  IdToken: string
) => {
  return await apiRequest(
    AUTH_API_ROUTES.CREATE_ADMIN,
    "POST",
    {
      email,
      name: `${firstname} ${lastname}`,
      phone_number: `${countryCode}${phoneNumber}`,
    },
    token,
    IdToken
  );
};

// change admin password
export const change_Admin_Password = async (
  email: string,
  newPassword: string,
  session: string
) => {
  return await apiRequest(AUTH_API_ROUTES.CHANGE_ADMIN_PASSWORD, "POST", {
    email,
    newPassword,
    session,
  });
};

// verify email
export const verifyEmail = async (email: string, verificationCode: string) => {
  console.log("🚀 ~ verifyEmail ~ email:", email);
  return await apiRequest(AUTH_API_ROUTES.VERIFY_EMAIL, "POST", {
    email,
    code: verificationCode,
  });
};

// resend verification code
export const resendVerificationCode = async (email: string) => {
  return await apiRequest(AUTH_API_ROUTES.RESEND_VERIFICATION, "POST", {
    email,
  });
};

// forget password
export const forget_Password = async (email: string) => {
  return await apiRequest(AUTH_API_ROUTES.FORGOT_PASSWORD, "POST", { email });
};

// reset password
export const resetPassword = async (
  email: string,
  newPassword: string,
  code: string
) => {
  return await apiRequest(AUTH_API_ROUTES.RESET_PASSWORD, "POST", {
    email,
    newPassword,
    code,
  });
};

// change password
export const change_Password = async (
  token: string,
  IdToken: string,
  payload: { oldPassword: string; newPassword: string }
) => {
  const result = await apiRequest(
    AUTH_API_ROUTES.CHANGE_PASSWORD,
    "POST",
    payload,
    token,
    IdToken
  );

  if (result.success) {
    return result.data;
  }
  throw new Error("Failed to change Password");
};
