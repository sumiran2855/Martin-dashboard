import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputFieldProps {
  label: string;
  name?: string;
  type?: string;
  formikKey: string;
  formikProps?: any;
}

export const PasswordField = ({ label, type, formikKey, formikProps }: InputFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  
  return (
    <>
      <div className="relative mb-2">
        <input
          type={isPassword ? (showPassword ? "text" : "password") : type}
          placeholder={label}
          className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          {...formikProps.getFieldProps(formikKey)}
        />
        
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      
      {formikProps.touched[formikKey] && formikProps.errors[formikKey] && (
        <p className="text-red-500 text-sm mb-3">
          {formikProps.errors[formikKey]}
        </p>
      )}
    </>
  );
};