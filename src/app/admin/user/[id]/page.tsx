"use client";
import withAuth from "@/auth/authUtils";
// import Sidebar from "@/components/admin/sidebar";
// import Content from "@/components/admin/content";

import { useParams } from "next/navigation";

function UserDetail() {

  return (
    <div className="flex h-screen bg-gray-50">
      {/* <Sidebar />
      <Content /> */}
    </div>
  );
}

export default withAuth(UserDetail,true);