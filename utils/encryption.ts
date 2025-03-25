import CryptoJS from "crypto-js";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  scope?: string;
  [key: string]: any;
}
const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY || "";

export const encryptData = (data: string): string => {
  return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
};

export const decryptData = (cipherText: string): string => {
  try {
    return CryptoJS.AES.decrypt(cipherText, SECRET_KEY).toString(CryptoJS.enc.Utf8);
  } catch (err) {
    console.error("Error decrypting data:", err);
    return "";
  }
};

export const decodeAccessToken = (token: string): DecodedToken | null => {
  try {
    return jwtDecode<DecodedToken>(token);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};
