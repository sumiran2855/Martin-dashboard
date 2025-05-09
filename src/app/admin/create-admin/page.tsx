"use client";
import AdminForm from "@/components/admin/create-admin/admin-form";
import Sidebar from "@/components/admin/sidebar";

export default function newAdmin() {
  return (
    <div className="flex h-screen bg-gray-50">
         <Sidebar />
         <AdminForm/>
       </div>
  );
}
