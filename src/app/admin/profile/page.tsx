"use client";
import withAuth from "@/auth/authUtils";
import Sidebar from "@/components/admin/sidebar";
import ProfileDetail from "@/components/admin/profileDetail";
import { useParams } from "next/navigation";
function profile() {
  const params = useParams();
  const facilityId = Array.isArray(params.facilityId)
    ? params.facilityId[0]
    : params.facilityId || "";
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar facilityId={facilityId} />
      <ProfileDetail />
    </div>
  );
}

export default withAuth(profile);