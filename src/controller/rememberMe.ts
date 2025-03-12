import { useEffect } from "react";
import { getCookie } from "@/utils/cookies";
import { decryptData } from "@/utils/encryption";

export const useRememberMe = (setValues: any) => {
  useEffect(() => {
    const savedEmail = getCookie("rememberedEmail");
    const encryptedPassword = getCookie("rememberedPassword");

    if (savedEmail && encryptedPassword) {
      const decryptedPassword = decryptData(encryptedPassword);
      setValues({ email: savedEmail, password: decryptedPassword, rememberMe: true });
    }
  }, [setValues]);
};
