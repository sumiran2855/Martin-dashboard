"use client";

import AdminSidebar from "@/components/admin/Sidebar";
import Facilities from "@/components/admin/facilities";
const FacilityDetailPage = ({ facilityId = "XRGI #567898340011" }) => {
  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      <Facilities facilityId={facilityId} />
    </div>
  );
};

export default FacilityDetailPage;
