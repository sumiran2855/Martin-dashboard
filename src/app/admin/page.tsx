"use client";
import withAuth from "@/auth/authUtils";
import Sidebar from "@/components/admin/sidebar";
import Content from "@/components/admin/content";

import { useParams } from "next/navigation";

function AdminDashboard() {
  const params = useParams();
  const facilityId = Array.isArray(params.id) ? params.id[0] : params.id || "";
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar facilityId={facilityId} />
      <Content />
    </div>
  );
}

export default withAuth(AdminDashboard);