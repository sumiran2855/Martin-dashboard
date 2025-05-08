"use client";
import withAuth from "@/auth/authUtils";
import Sidebar from "@/components/admin/sidebar";
import SubscriptionPage from "@/components/admin/subscription/SubscriptionPage";

function Subscription() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar/>
      <SubscriptionPage />
    </div>
  );
}

export default withAuth(Subscription,true);