"use client";
import withAuth from "@/auth/authUtils";
import Sidebar from "@/components/admin/sidebar";
import Content from "@/components/admin/content";
import { useParams } from "next/navigation";

function AdminDashboard() {
  const params = useParams();
  const id = params.id;
  const userId: string[] = Array.isArray(id) ? id : id ? [id] : [];
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userId={userId} />
      <Content />
    </div>
  );
}

export default withAuth(AdminDashboard, true);
