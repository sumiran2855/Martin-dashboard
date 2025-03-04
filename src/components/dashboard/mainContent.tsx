import { Search, Filter, Grid, List, ChevronDown } from "lucide-react";
import { useState } from "react";
import GridView from "@/components/dashboard/view/gridView";
import ListView from "@/components/dashboard/view/listView";
import facilitiesData from "./staticData/facilitiesData";

const statusOptions = [
  "All",
  "Active",
  "Maintenance",
  "Missing Data",
  "Inactive",
];

export default function mainContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [view, setView] = useState("grid");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  const handleSelect = (selectedView: string) => {
    setView(selectedView);
    setIsOpen(false);
  };

  const handleStatusSelect = (status: string) => {
    setSelectedStatus(status);
    setSortDropdownOpen(false);
  };

  const filteredData = facilitiesData
    .filter((facility) =>
      facility.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(
      (facility) =>
        selectedStatus === "All" || facility.status === selectedStatus
    );

  return (
    <>
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <h1 className="text-2xl font-medium text-gray-800 mb-2">
            Your Facilities
          </h1>
          <p className="text-gray-600 mb-6">
            This is an overview of your XRGi facilities. Your facilities must be
            added here in order to receive SuperXSaver service.
          </p>

          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button
                  className="flex items-center px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                  onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                >
                  <Filter size={16} className="mr-2" />
                  <span>Sort by</span>
                  <ChevronDown size={16} className="ml-2" />
                </button>
                {sortDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-md">
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
                  className="flex items-center px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
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
                  <div className="absolute left-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-md">
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

            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search"
                  className="pl-10 pr-4 py-2 w-64 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search size={16} className="text-gray-400" />
                </div>
              </div>

              <button className="px-4 py-2 text-sm text-white bg-blue-800 rounded-md hover:bg-blue-900">
                Register more facilities
              </button>
            </div>
          </div>

          {view == "grid" ? (
            <GridView facilities={filteredData} />
          ) : (
            <ListView facilities={filteredData} />
          )}
        </div>
      </div>
    </>
  );
}
