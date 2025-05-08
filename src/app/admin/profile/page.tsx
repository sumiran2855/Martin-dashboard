"use client";
import withAuth from "@/auth/authUtils";
import Sidebar from "@/components/admin/sidebar";
import ProfileDetail from "@/components/admin/profileDetail";
function profile() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <ProfileDetail />
    </div>
  );
}

export default withAuth(profile,true);