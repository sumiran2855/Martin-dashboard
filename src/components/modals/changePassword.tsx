import { change_Password } from "@/services/authService";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface ChangePasswordProps {
  setChangePassword: (value: boolean) => void;
  changePassword: (value: boolean) => void;
}

const PasswordInput = ({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <label className="block text-gray-700 text-sm font-medium">{label}</label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
};

export default function ChangePassword({
  setChangePassword,
}: ChangePasswordProps) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const handleChangePassword = async () => {
    setError(null);
    setSuccess(null);

    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password must match.");
      return;
    }

    const payload = { oldPassword, newPassword };
    const token = localStorage.getItem("token");
    const IdToken = localStorage.getItem("IdToken");
    if (!token || !IdToken) {
      setError("Authorization token missing.");
      return;
    }

    try {
      const response = await change_Password(token, IdToken, payload);
      if (!response) {
        setError("Error changing password. Please try again.");
        return;
      }
      console.log("Password changed successfully");
      setSuccess("Your password has been changed successfully. Logging out...");

      setChangePassword(false);

      localStorage.removeItem("token");
      localStorage.removeItem("IdToken");
      setTimeout(() => {
        router.push("/");
      }, 3000);
    } catch (err: any) {
      setError("An error occurred. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-40 flex items-center justify-center px-4 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8 max-w-md w-full">
        <h2 className="text-xl font-semibold text-gray-900 text-center">
          Change Password
        </h2>
        <p className="text-gray-600 text-center text-sm mt-1">
          Enter your current password and set a new one.
        </p>

        {error && (
          <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm text-center">{error}</p>
          </div>
        )}

        {success && (
          <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-600 text-sm text-center">{success}</p>
          </div>
        )}

        <div className="mt-5 space-y-4">
          <PasswordInput
            label="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="Enter old password"
          />

          <PasswordInput
            label="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
          />

          <PasswordInput
            label="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-3 mt-6">
          <button
            onClick={() => setChangePassword(false)}
            className="w-full sm:w-auto border border-gray-400 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleChangePassword}
            className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-800 transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
