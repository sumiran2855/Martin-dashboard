"use client";

import withAuth from "@/auth/authUtils";
import AdminSidebar from "@/components/dashboard/Sidebar";
import EditFacilities from "@/components/dashboard/editFacilities";
import { useParams } from "next/navigation";
const EditFacilitiesPage = () => {
  const params = useParams();
  const facilityId = Array.isArray(params.id) ? params.id[0] : params.id || "";
  return (
    <>
      <div className="flex h-screen bg-gray-50">
        <AdminSidebar facilityId={facilityId} />
        <EditFacilities facilityId={facilityId} />
      </div>
    </>
  );
};

export default withAuth(EditFacilitiesPage);
