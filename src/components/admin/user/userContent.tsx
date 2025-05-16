import {
  Search,
  Filter,
  Grid,
  List,
  ChevronDown,
  ArrowLeft,
  User,
  Mail,
  Phone,
  Building,
} from "lucide-react";
import { useEffect, useState } from "react";
import GridView from "@/components/admin/user/view/gridView";
import ListView from "@/components/admin/user/view/listView";
import { getCustomerById } from "@/services/customerServices";
import { getAllUserFacility } from "@/services/facilityServices";
import Link from "next/link";

const statusOptions = ["All", "Active", "Data Missing", "Inactive"];

interface User {
  userId: string[];
  name?: string;
  status?: string;
}

export default function MainContent({ userId = [] }: User) {
  const [searchTerm, setSearchTerm] = useState("");
  const [view, setView] = useState("grid");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [userData, setuserData] = useState([]);
  const [customerData, setCustomerData] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleSelect = (selectedView: string) => {
    setView(selectedView);
    setIsOpen(false);
  };

  const handleStatusSelect = (status: string) => {
    setSelectedStatus(status);
    setSortDropdownOpen(false);
  };

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      const IdToken = localStorage.getItem("IdToken");

      if (token && IdToken && userId.length > 0) {
        try {
          const customersArray = await Promise.all(
            userId.map(async (id) => {
              try {
                return await getCustomerById(token, IdToken, id);
              } catch (error) {
                console.error(
                  `Error fetching customer profile for user ${id}`,
                  error
                );
                return null;
              }
            })
          );
          setCustomerData(customersArray.filter(Boolean));
        } catch (error) {
          console.error("Error fetching customer profiles", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [userId]);

  useEffect(() => {
    const fetchFacilities = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      const IdToken = localStorage.getItem("IdToken");

      if (token && IdToken && userId.length > 0) {
        try {
          const facilitiesArray = await Promise.all(
            userId.map(async (id) => {
              try {
                return await getAllUserFacility(token, IdToken, id);
              } catch (error) {
                console.error(
                  `Error fetching facilities for user ${id}`,
                  error
                );
                return [];
              }
            })
          );

          setuserData(facilitiesArray.flat());
        } catch (error) {
          console.error("Error fetching facilities", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchFacilities();
  }, [userId]);

  const filteredData = userData
    .filter((facility) =>
      facility.name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(
      (facility) =>
        selectedStatus === "All" || facility.status === selectedStatus
    );

  return (
    <>
      {loading && (
        <div className="fixed inset-0 flex justify-center items-center bg-white bg-opacity-75 z-50">
          <div
            className="loader animate-spin rounded-full border-4 border-gray-300 border-t-gray-900 h-12 w-12"
            role="status"
            aria-hidden="true"
          ></div>
        </div>
      )}
      {!loading && (
        <div className="flex-1 overflow-auto">
          <div className="p-4 md:p-8">
            <Link
              href="/admin"
              className="flex items-center gap-2 text-lg font-medium text-blue-600 no-underline transition-all duration-200 hover:text-blue-800 mb-4"
            >
              <div className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition">
                <ArrowLeft size={20} className="text-blue-600" />
              </div>
              <span className="text-xl">Back</span>
            </Link>

            {/* Company Details Section */}
{customerData[0] && (
              <div className="mb-8 overflow-hidden bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="px-6 py-4 bg-blue-50 border-b border-gray-100">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                    <Building className="mr-2 text-blue-600" size={22} />
                    Company Profile
                  </h2>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white p-4 rounded-lg border border-gray-100 hover:border-blue-200 transition-colors duration-200 hover:shadow-md cursor-pointer">
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                          <Building size={16} className="text-blue-600" />
                        </div>
                        <p className="text-sm font-medium text-gray-500">Company Name</p>
                      </div>
                      <p className="text-lg font-medium text-gray-800 truncate">
                        {customerData[0]?.companyName || "N/A"}
                      </p>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg border border-gray-100 hover:border-blue-200 transition-colors duration-200 hover:shadow-md cursor-pointer">
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                          <User size={16} className="text-indigo-600" />
                        </div>
                        <p className="text-sm font-medium text-gray-500">Contact Name</p>
                      </div>
                      <p className="text-lg font-medium text-gray-800 truncate">
                        {customerData[0]?.firstName || ""} {customerData[0]?.lastName || ""}
                      </p>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg border border-gray-100 hover:border-blue-200 transition-colors duration-200 hover:shadow-md cursor-pointer">
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                          <Mail size={16} className="text-green-600" />
                        </div>
                        <p className="text-sm font-medium text-gray-500">Email Address</p>
                      </div>
                      <p className="text-lg font-medium text-gray-800 truncate">
                        {customerData[0]?.email || "N/A"}
                      </p>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg border border-gray-100 hover:border-blue-200 transition-colors duration-200 hover:shadow-md cursor-pointer">
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                          <Phone size={16} className="text-purple-600" />
                        </div>
                        <p className="text-sm font-medium text-gray-500">Phone Number</p>
                      </div>
                      <p className="text-lg font-medium text-gray-800 truncate">
                        {customerData[0]?.phone || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* <h1 className="text-xl md:text-2xl font-medium text-gray-800 mb-2">
              {customerData[0]?.companyName?.toUpperCase() || "Company"}
            </h1> */}
            <p className="text-gray-600 mb-6">
              This is an overview of{" "}
              {customerData[0]?.companyName || "the company"} XRGI plants. You
              can manage and monitor all your plants from this dashboard.
            </p>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                <div className="relative">
                  <button
                    className="flex items-center px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 w-full md:w-auto"
                    onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                  >
                    <Filter size={16} className="mr-2" />
                    <span>Sort by</span>
                    <ChevronDown size={16} className="ml-2" />
                  </button>
                  {sortDropdownOpen && (
                    <div className="absolute left-0 mt-2 bg-white border border-gray-200 rounded-md shadow-md top-[38px] z-10 w-full">
                      {statusOptions.map((status) => (
                        <button
                          key={status}
                          onClick={() => handleStatusSelect(status)}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <button
                    className="flex items-center px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 w-full md:w-auto"
                    onClick={() => setIsOpen(!isOpen)}
                  >
                    {view === "list" ? (
                      <List size={16} className="mr-2" />
                    ) : (
                      <Grid size={16} className="mr-2" />
                    )}
                    <span>{view === "list" ? "List View" : "Grid View"}</span>
                  </button>

                  {isOpen && (
                    <div className="absolute left-0 mt-2 bg-white border border-gray-200 rounded-md shadow-md w-full z-10">
                      <button
                        onClick={() => handleSelect("list")}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <List size={16} className="mr-2" /> List View
                      </button>
                      <button
                        onClick={() => handleSelect("grid")}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Grid size={16} className="mr-2" /> Grid View
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center w-full md:w-auto">
                <div className="relative w-full md:w-auto">
                  <input
                    type="text"
                    placeholder="Search"
                    className="pl-10 pr-4 py-2 w-full md:w-96 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search size={16} className="text-gray-400" />
                  </div>
                </div>
              </div>
            </div>

            {view === "grid" ? (
              <GridView facilities={filteredData} />
            ) : (
              <ListView facilities={filteredData} />
            )}
          </div>
        </div>
      )}
    </>
  );
}
