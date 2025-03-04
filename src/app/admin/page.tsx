"use client";
import AdminSidebar from "@/components/admin/Sidebar";
import MainContent from "@/components/admin/mainContent";

export default function FacilitiesPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      <MainContent />
    </div>
  );
}
