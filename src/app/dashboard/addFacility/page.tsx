"use client";

import AddFacility from "@/components/dashboard/AddFacility";
import Sidebar from "@/components/dashboard/Sidebar";
import withAuth from "@/auth/authUtils";
import { useParams } from "next/navigation";

function addFacility() {
  const params = useParams();
  const facilityId = Array.isArray(params.facilityId)
    ? params.facilityId[0]
    : params.facilityId || "";
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar facilityId={facilityId} />
      <AddFacility />
    </div>
  );
}

export default withAuth(addFacility);
