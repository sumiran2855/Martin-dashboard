"use client";
import withAuth from "@/auth/authUtils";
import Sidebar from "@/components/admin/sidebar";
import ServicesPage from "@/components/admin/services/services";

function Services() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <ServicesPage />
    </div>
  );
}

export default withAuth(Services, true);
