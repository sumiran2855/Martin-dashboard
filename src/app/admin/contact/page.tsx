"use client";
import withAuth from "@/auth/authUtils";
import Sidebar from "@/components/admin/sidebar";
import ContactList from "@/components/admin/contact/contact";

function Contact() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <ContactList />
    </div>
  );
}

export default withAuth(Contact,true);