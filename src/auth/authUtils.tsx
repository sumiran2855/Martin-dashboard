"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { decodeAccessToken } from "@/utils/encryption";

const restrictedForAdmin = [
  "/createProfile",
  "/dashboard",
  "/dashboard/addFacility",
  "/dashboard/facilities/editFacilities/",
  "/profile",
];

export default function withAuth(
  Component: React.FC,
  requiresAdmin: boolean = false
) {
  return function ProtectedRoute(props: any) {
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.replace("/");
        return;
      }

      const decodedToken = decodeAccessToken(token);

      const isRestrictedPath = restrictedForAdmin.some(
        (restricted) =>
          pathname.startsWith(restricted) ||
          pathname.startsWith("/dashboard/facilities/editFacilities/")
      );

      // Redirect admin if accessing a restricted page
      if (
        decodedToken?.["cognito:groups"]?.includes("ServiceTechnician") &&
        isRestrictedPath
      ) {
        router.replace("/admin");
        return;
      }

      if (
        requiresAdmin &&
        !decodedToken?.["cognito:groups"]?.includes("ServiceTechnician")
      ) {
        router.replace("/dashboard");
        return;
      }

      setIsAuthenticated(true);

      const loginTime = localStorage.getItem("loginTime");
      if (!loginTime) {
        localStorage.setItem("loginTime", Date.now().toString());
      } else {
        const elapsedTime = Date.now() - parseInt(loginTime, 10);
        if (elapsedTime >= 60 * 60 * 1000) {
          localStorage.clear();
          router.replace("/");
        }
      }

      const timeout = setTimeout(() => {
        localStorage.clear();
        router.replace("/");
      }, 60 * 60 * 1000);

      return () => clearTimeout(timeout);
    }, []);

    if (!isAuthenticated) {
      return null;
    }

    return <Component {...props} />;
  };
}
