"use client";

import withAuth from "@/auth/authUtils";
import Sidebar from "@/components/admin/sidebar";
import EditFacilities from "@/components/admin/editFacilities";
import { useParams } from "next/navigation";
const EditFacilitiesPage = () => {
  const params = useParams();

  const id = params.id;
  const facilityId: string[] = Array.isArray(id) ? id : id ? [id] : [];
  return (
    <>
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <EditFacilities facilityId={facilityId} />
      </div>
    </>
  );
};

export default withAuth(EditFacilitiesPage);
