"use client";

import withAuth from "@/auth/authUtils";
import Sidebar from "@/components/dashboard/Sidebar";
import Facilities from "@/components/dashboard/facilities";
import { useParams } from "next/navigation";
const FacilityDetailPage = () => {
  const params  = useParams(); 
  const facilityId = Array.isArray(params.facilityId) ? params.facilityId[0] : params.facilityId || "";

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar facilityId={facilityId}/>
      <Facilities facilityId={facilityId} />
    </div>
  );
};

export default withAuth(FacilityDetailPage);
