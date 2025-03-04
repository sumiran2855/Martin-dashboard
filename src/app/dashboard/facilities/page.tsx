"use client";

import withAuth from "@/components/Auth/authUtils";
import AdminSidebar from "@/components/dashboard/Sidebar";
import Facilities from "@/components/dashboard/facilities";
const FacilityDetailPage = ({ facilityId = "XRGI #567898340011" }) => {
  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      <Facilities facilityId={facilityId} />
    </div>
  );
};

export default withAuth(FacilityDetailPage);
