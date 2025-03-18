"use client";
import withAuth from "@/auth/authUtils";
import AdminSidebar from "@/components/dashboard/Sidebar";
import ProfileDetail from "@/components/dashboard/profile";
import { useParams } from "next/navigation";
function profile() {
  const params = useParams();
  const facilityId = Array.isArray(params.facilityId)
    ? params.facilityId[0]
    : params.facilityId || "";
  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar facilityId={facilityId} />
      <ProfileDetail />
    </div>
  );
}

export default withAuth(profile);