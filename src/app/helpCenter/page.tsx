"use client";
import withAuth from "@/auth/authUtils";
import AdminSidebar from "@/components/dashboard/Sidebar";
import HelpCenterForm from "@/components/dashboard/helpCenterForm";
import { useParams } from "next/navigation";

function HelpCenter() {
  const params = useParams();
  const facilityId = Array.isArray(params.id) ? params.id[0] : params.id || "";
  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar facilityId={facilityId} />
      <HelpCenterForm />
    </div>
  );
}

export default withAuth(HelpCenter);