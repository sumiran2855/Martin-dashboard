import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Check,
  X,
  AlertCircle,
} from "lucide-react";
import { getAllUserFacility } from "@/services/facilityServices";
import React from "react";

interface FacilityDetails {
  name: string;
  location: string;
  type: string;
  hasEnergyCheckPlus?: boolean;
  EnergyCheck_plus?: {
    annualSavings?: number | null;
    co2Savings?: number | null;
    industry?: string | null;
    operatingHours?: number | null;
  };
  smartPriceControlAdded?: boolean;
  smartPriceControl?: {
    method?: string;
  };
  hasServiceContract?: boolean;
  serviceProvider?: {
    name?: string;
    mailAddress?: string;
    phone?: string;
  };
}

interface Users {
  id?: number;
  companyName?: string;
  cvrNumber?: string;
  city?: string;
  status?: string;
  hasEnergyCheckPlus?: boolean;
  EnergyCheck_plus?: {
    annualSavings?: number | null;
    co2Savings?: number | null;
    industry?: string | null;
    operatingHours?: number | null;
  };
  smartPriceControlAdded?: boolean;
  smartPriceControl?: {
    method?: string;
  };
  hasServiceContract?: boolean;
  serviceProvider?: {
    name?: string;
    mailAddress?: string;
    phone?: string;
  };
  facilities?: FacilityDetails[];
}

export default function ListView({ users }: { users: Users[] }) {
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRowId, setExpandedRowId] = useState<number | null>(null);
  const [selectedFacilityIndex, setSelectedFacilityIndex] = useState<number | null>(null);
  const totalPages = Math.ceil(users.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const displayedUsers = users.slice(startIndex, endIndex);
  const [facilitiesMap, setFacilitiesMap] = useState<Record<number, FacilityDetails[]>>({});
  const [loadingFacilityId, setLoadingFacilityId] = useState<number | null>(null);

  const toggleRowExpansion = async (index: number, userId?: number) => {
    if (expandedRowId === index) {
      setExpandedRowId(null);
      setSelectedFacilityIndex(null);
    } else {
      setExpandedRowId(index);
      setSelectedFacilityIndex(null);
  
      if (userId && !facilitiesMap[userId]) {
        setLoadingFacilityId(userId);
        try {
          const token = localStorage.getItem("token") || "";
          const IdToken = localStorage.getItem("IdToken") || "";
  
          const facilities = await getAllUserFacility(
            token,
            IdToken,
            userId.toString()
          );
  
          console.log("Facilities received:", facilities);
  
          if (Array.isArray(facilities)) {
            const formattedFacilities = facilities.map(facility => {
              const formattedFacility = {
                ...facility,
                location: facility.location ? 
                  (typeof facility.location === 'object' ? 
                    `${facility.location.address}, ${facility.location.city}` : 
                    facility.location) : '',
                type: facility.modelNumber || "Unknown" 
              };
              return formattedFacility;
            });
  
            setFacilitiesMap((prev) => ({
              ...prev,
              [userId]: formattedFacilities,
            }));
          } else {
            console.warn("Unexpected response structure:", facilities);
          }
        } catch (error) {
          console.error("Failed to fetch facilities", error);
        } finally {
          setLoadingFacilityId(null);
        }
      }
    }
  };
  
  const toggleFacilityDetails = (facilityIndex: number) => {
    if (selectedFacilityIndex === facilityIndex) {
      setSelectedFacilityIndex(null);
    } else {
      setSelectedFacilityIndex(facilityIndex);
    }
  };

  const hasEnergyCheckPlusDetails = (facility: FacilityDetails) => {
    return (
      facility.EnergyCheck_plus &&
      (facility.EnergyCheck_plus.annualSavings !== null ||
        facility.EnergyCheck_plus.co2Savings !== null ||
        facility.EnergyCheck_plus.industry !== null ||
        facility.EnergyCheck_plus.operatingHours !== null)
    );
  };

  const hassmartPriceControlDetails = (facility: FacilityDetails) => {
    return facility.smartPriceControl && facility.smartPriceControl.method;
  };

  const hasServiceContractDetails = (facility: FacilityDetails) => {
    return (
      facility.serviceProvider &&
      (facility.serviceProvider.name ||
        facility.serviceProvider.mailAddress ||
        facility.serviceProvider.phone)
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-md shadow-sm overflow-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              XRGi Facility
            </th>
            <th className="hidden sm:table-cell px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              City
            </th>
            <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Details
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {displayedUsers.length > 0 ? (
            displayedUsers.map((user, index) => (
              <React.Fragment key={`user-${user.id || index}`}>
                <tr className="hover:bg-gray-50 transition">
                  <td className="px-4 md:px-6 py-3 whitespace-nowrap flex items-center space-x-3">
                    <img src="/Box.png" alt="folder" className="w-6 h-6 md:w-7 md:h-7" />
                    <span className="text-gray-800 text-xs md:text-sm">
                      {user.companyName}
                    </span>
                  </td>
                  <td className="px-4 md:px-6 py-3 whitespace-nowrap text-xs md:text-sm text-gray-600">
                    {user.cvrNumber}
                  </td>
                  <td className="hidden sm:table-cell px-4 md:px-6 py-3 whitespace-nowrap text-xs md:text-sm text-gray-600">
                    {user.city}
                  </td>
                  <td className="px-4 md:px-6 py-3 whitespace-nowrap flex items-center space-x-2">
                    <img
                      src={
                        user.status === "Data Missing"
                          ? "/Missing.png"
                          : user.status === "Inactive"
                          ? "/Inactive.png"
                          : user.status === "Maintenance"
                          ? "/Maintenance.jpg"
                          : "/Active.png"
                      }
                      alt={user.status}
                      className="w-4 h-4 md:w-5 md:h-5"
                    />
                    <span className="text-xs md:text-sm text-gray-700">{user.status}</span>
                  </td>
                  <td className="px-4 md:px-6 py-2 text-right">
                    <button
                      className="text-gray-500 hover:text-gray-700 flex items-center justify-end space-x-1"
                      onClick={() => toggleRowExpansion(index, user.id)}
                    >
                      <span className="text-xs md:text-sm">Details</span>
                      <ChevronDown
                        size={16}
                        className={`transform transition-transform ${
                          expandedRowId === index ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </td>
                </tr>

                {expandedRowId === index && (
                  <tr key={`expanded-${user.id || index}`}>
                    <td
                      colSpan={5}
                      className="px-0 py-0 border-b border-gray-200"
                    >
                      <div className="bg-gray-50 px-4 md:px-6 py-4 border-t border-gray-200">
                        <h3 className="text-sm font-medium text-gray-800 mb-3">
                          Facilities
                        </h3>

                        {loadingFacilityId === user.id ? (
                          <div className="text-gray-500 text-sm">
                            Loading facilities...
                          </div>
                        ) : facilitiesMap[user.id || 0]?.length > 0 ? (
                          <div className="space-y-3">
                            {facilitiesMap[user.id || 0]?.map((facility, facIndex) => (
                              <div
                                key={`facility-${user.id || 0}-${facIndex}`}
                                className="bg-white rounded-lg shadow-sm border border-gray-100"
                              >
                                <div 
                                  className="p-3 cursor-pointer hover:bg-gray-50"
                                  onClick={() => toggleFacilityDetails(facIndex)}
                                >
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <h4 className="font-medium text-sm text-gray-800">
                                        {facility.name}
                                      </h4>
                                      <div className="mt-1 text-xs text-gray-600">
                                        <span className="mr-4">Location: {facility.location}</span>
                                        <span>Type: {facility.type}</span>
                                      </div>
                                    </div>
                                    <ChevronDown
                                      size={16}
                                      className={`transform transition-transform ${
                                        selectedFacilityIndex === facIndex ? "rotate-180" : ""
                                      }`}
                                    />
                                  </div>
                                </div>

                                {selectedFacilityIndex === facIndex && (
                                  <div className="p-3 pt-0 border-t border-gray-100">
                                    <div className="bg-gray-50 p-4 rounded-md">
                                      <h5 className="text-sm font-medium text-gray-800 mb-3">
                                        Services
                                      </h5>
                                      
                                      <div className="space-y-4">
                                        {/* Performance Report */}
                                        <div>
                                          <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs md:text-sm font-medium text-gray-700">
                                              EnergyCheck Plus
                                            </span>
                                            <div className="flex items-center">
                                              {facility.hasEnergyCheckPlus ? (
                                                hasEnergyCheckPlusDetails(facility) ? (
                                                  <Check
                                                    size={16}
                                                    className="text-green-500"
                                                  />
                                                ) : (
                                                  <AlertCircle
                                                    size={16}
                                                    className="text-yellow-500"
                                                  />
                                                )
                                              ) : (
                                                <X size={16} className="text-red-500" />
                                              )}
                                            </div>
                                          </div>

                                          {facility.hasEnergyCheckPlus &&
                                            !hasEnergyCheckPlusDetails(facility) && (
                                              <div className="text-xs text-yellow-600">
                                                Requested, but no details available
                                              </div>
                                            )}
                                        </div>

                                        <div>
                                          <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs md:text-sm font-medium text-gray-700">
                                               Smart PriceControl
                                            </span>
                                            <div className="flex items-center">
                                              {facility.smartPriceControlAdded ? (
                                                hassmartPriceControlDetails(facility) ? (
                                                  <Check
                                                    size={16}
                                                    className="text-green-500"
                                                  />
                                                ) : (
                                                  <AlertCircle
                                                    size={16}
                                                    className="text-yellow-500"
                                                  />
                                                )
                                              ) : (
                                                <X size={16} className="text-red-500" />
                                              )}
                                            </div>
                                          </div>

                                          {facility.smartPriceControlAdded &&
                                            !hassmartPriceControlDetails(facility) && (
                                              <div className="text-xs text-yellow-600">
                                                Requested, but no details available
                                              </div>
                                            )}
                                        </div>

                                        <div>
                                          <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs md:text-sm font-medium text-gray-700">
                                              Service Contract
                                            </span>
                                            <div className="flex items-center">
                                              {facility.hasServiceContract ? (
                                                hasServiceContractDetails(facility) ? (
                                                  <Check
                                                    size={16}
                                                    className="text-green-500"
                                                  />
                                                ) : (
                                                  <AlertCircle
                                                    size={16}
                                                    className="text-yellow-500"
                                                  />
                                                )
                                              ) : (
                                                <X size={16} className="text-red-500" />
                                              )}
                                            </div>
                                          </div>

                                          {facility.hasServiceContract &&
                                            !hasServiceContractDetails(facility) && (
                                              <div className="text-xs text-yellow-600">
                                                Requested, but no details available
                                              </div>
                                            )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="bg-white p-4 rounded-md text-center text-gray-500">
                            No facilities found
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="px-6 py-16 text-center">
                <div className="flex flex-col items-center justify-center">
                  <div className="relative w-48 md:w-64 h-24 md:h-32 mb-4">
                    <div className="absolute transform -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
                      <img
                        src="/Folder Not Found.png"
                        alt=""
                        className="w-48 md:w-64 h-24 md:h-32"
                      />
                    </div>
                  </div>
                  <p className="text-gray-500">No users</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 md:px-6 py-3 bg-white border-t border-gray-200">
        <div className="flex items-center space-x-3 mb-3 sm:mb-0">
          <span className="text-xs md:text-sm text-gray-700">Rows per page:</span>
          <div className="relative">
            <select
              className="appearance-none bg-white border border-gray-300 text-gray-700 py-1 md:py-2 pl-2 md:pl-3 pr-6 md:pr-8 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition cursor-pointer text-xs md:text-sm"
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-xs">
              ▼
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <span className="text-xs md:text-sm text-gray-700 mr-4">
            {users.length === 0
              ? "0-0 of 0"
              : `${startIndex + 1}-${Math.min(endIndex, users.length)} of ${
                  users.length
                }`}
          </span>
          <div className="flex">
            <button
              className={`p-1 rounded-md ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-600 hover:text-gray-800"
              }`}
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              <ArrowLeft size={16} />
            </button>

            <button
              className={`p-1 rounded-md ${
                currentPage === totalPages || users.length === 0
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-600 hover:text-gray-800"
              }`}
              disabled={currentPage === totalPages || users.length === 0}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}