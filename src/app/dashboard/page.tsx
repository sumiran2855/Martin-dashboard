"use client";
import withAuth from "@/auth/authUtils";
import Sidebar from "@/components/dashboard/Sidebar";
import MainContent from "@/components/dashboard/mainContent";
import { useParams } from "next/navigation";

function FacilitiesPage() {
  const params = useParams();
  const facilityId = Array.isArray(params.id) ? params.id[0] : params.id || "";
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar facilityId={facilityId} />
      <MainContent />
    </div>
  );
}

export default withAuth(FacilitiesPage);