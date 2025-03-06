"use client";

import withAuth from "@/components/auth/authUtils";
import AdminSidebar from "@/components/dashboard/Sidebar";
import EditFacilities from "@/components/dashboard/editFacilities";
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

// export default withAuth(EditFacilitiesPage);
export default EditFacilitiesPage;

