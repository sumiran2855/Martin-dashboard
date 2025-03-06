"use client";
import withAuth from "@/components/auth/authUtils";
import AdminSidebar from "@/components/dashboard/Sidebar";
import MainContent from "@/components/dashboard/mainContent";

function FacilitiesPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      <MainContent />
    </div>
  );
}

export default withAuth(FacilitiesPage);