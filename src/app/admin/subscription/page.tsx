"use client";
import withAuth from "@/auth/authUtils";
import Sidebar from "@/components/admin/sidebar";
import SubscriptionPage from "@/components/admin/subscription/SubscriptionPage";
import { useParams } from "next/navigation";

function Subscription() {
    const params = useParams();
    const id = params.id;
    const userId: string[] = Array.isArray(id) ? id : id ? [id] : [];
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userId={userId} />
      <SubscriptionPage />
    </div>
  );
}

export default withAuth(Subscription,true);