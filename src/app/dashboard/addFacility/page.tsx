"use client"

import AddFacility from "@/components/dashboard/AddFacility";
import AdminSidebar from "@/components/dashboard/Sidebar";

function addFacility(){
    return(
       <div className="flex h-screen bg-gray-50">
             <AdminSidebar />
             <AddFacility />
           </div>
    )
}

export default addFacility;