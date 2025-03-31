"use client";
import withAuth from "@/auth/authUtils";
import AdminSidebar from "@/components/dashboard/Sidebar";
import SubscriptionPage from "@/components/dashboard/subscription/Subscription";
import { useParams } from "next/navigation";

function Subscription() {
  const params = useParams();
  const facilityId = Array.isArray(params.id) ? params.id[0] : params.id || "";
  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar facilityId={facilityId} />
      <SubscriptionPage />
    </div>
  );
}

export default withAuth(Subscription);