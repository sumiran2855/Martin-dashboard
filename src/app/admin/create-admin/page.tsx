"use client";
import AdminForm from "@/components/admin/create-admin/admin-form";
import Sidebar from "@/components/admin/sidebar";
import { useParams } from "next/navigation";

export default function newAdmin() {
     const params = useParams();
      const id = params.id;
      const userId: string[] = Array.isArray(id) ? id : id ? [id] : [];
  return (
    <div className="flex h-screen bg-gray-50">
         <Sidebar userId={userId} />
         <AdminForm/>
       </div>
  );
}
