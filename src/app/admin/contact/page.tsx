"use client";
import withAuth from "@/auth/authUtils";
import Sidebar from "@/components/admin/sidebar";
import ContactList from "@/components/admin/contact/contact";
import { useParams } from "next/navigation";

function Contact() {
    const params = useParams();
    const id = params.id;
    const userId: string[] = Array.isArray(id) ? id : id ? [id] : [];
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userId={userId} />
      <ContactList />
    </div>
  );
}

export default withAuth(Contact,true);