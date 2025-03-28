"use client";

import withAuth from "@/auth/authUtils";
import Facilities from "@/components/admin/facilities";
import Sidebar from "@/components/admin/sidebar";
import { useParams } from "next/navigation";
const FacilityDetailPage = () => {
  const params = useParams();
  const facilityId = Array.isArray(params.facilityId)
  ? params.facilityId[0]
  : params.facilityId || "";

  const id = params.id;
  const userId: string[] = Array.isArray(id) ? id : id ? [id] : [];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userId={userId} />
      <Facilities facilityId={facilityId} />
    </div>
  );
};

export default withAuth(FacilityDetailPage);
