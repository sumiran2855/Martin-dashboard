"use client";
import withAuth from "@/auth/authUtils";
import Sidebar from "@/components/admin/sidebar";
import Content from "@/components/admin/content";

function AdminDashboard() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <Content />
    </div>
  );
}

export default withAuth(AdminDashboard, true);
