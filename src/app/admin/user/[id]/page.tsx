"use client";
import withAuth from "@/auth/authUtils";
import Sidebar from "@/components/admin/sidebar";
import UserContent from "@/components/admin/user/userContent"
import { useParams } from "next/navigation";

function UserDetail() {
  const params  = useParams(); 
  const id = params.id;
  const userId: string[] = Array.isArray(id) ? id : id ? [id] : [];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <UserContent userId={userId} />
    </div>
  );
}

export default withAuth(UserDetail,true);