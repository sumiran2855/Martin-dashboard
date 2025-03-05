"use client"
import AdminSidebar from "@/components/dashboard/Sidebar";
import ProfileDetail from "@/components/dashboard/profile"
export default function profile() {
  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      <ProfileDetail/>
    </div>
  );
}
