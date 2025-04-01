"use client";
import withAuth from "@/auth/authUtils";
import Sidebar from "@/components/admin/sidebar";
import ServicesPage from "@/components/admin/services/services";
import { useParams } from "next/navigation";

function Services() {
  const params = useParams();
  const id = params.id;
  const userId: string[] = Array.isArray(id) ? id : id ? [id] : [];
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userId={userId} />
      <ServicesPage />
    </div>
  );
}

export default withAuth(Services, true);
