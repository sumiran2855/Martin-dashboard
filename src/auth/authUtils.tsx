// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// export default function withAuth(Component: React.FC) {
//   return function ProtectedRoute(props: any) {
//     const router = useRouter();
//     const [isAuthenticated, setIsAuthenticated] = useState(false);

//     useEffect(() => {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         router.replace("/");
//       } else {
//         setIsAuthenticated(true);
//       }
//     }, []);

//     if (!isAuthenticated) {
//       return null;
//     }

//     return <Component {...props} />;
//   };
// }


"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function withAuth(Component: React.FC) {
  return function ProtectedRoute(props: any) {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.replace("/");
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
