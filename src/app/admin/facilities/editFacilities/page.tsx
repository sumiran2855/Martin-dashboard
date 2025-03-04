"use client";

import AdminSidebar from "@/components/admin/Sidebar";
import EditFacilities from "@/components/admin/editFacilities";
const EditFacilitiesPage = () => {
  return (
    <>
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      <EditFacilities />
    </div>
    </>
  );
};

export default EditFacilitiesPage;
