"use client"
import withAuth from "@/auth/authUtils";
import AdminSidebar from "@/components/dashboard/Sidebar";
import ProfileDetail from "@/components/dashboard/profile"
function profile() {
  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      <ProfileDetail/>
    </div>
  );
}

export default withAuth(profile);