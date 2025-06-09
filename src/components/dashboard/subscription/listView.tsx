import React from "react";
import { useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronRight,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/utils/authHelper";
import { FACILITY_API_ROUTES } from "@/routes/facilityRoutes";

interface Facility {
  id: string;
  name: string;
  xrgiID: string;
  modelNumber: string;
  hasEnergyCheckPlus?: boolean;
  EnergyCheck_plus?: {
    annualSavings?: number | null;
    co2Savings?: number | null;
    industry?: string | null;
    operatingHours?: number | null;
  };
  smartPriceControlAdded?: boolean;
  installedSmartPriceController?: boolean;
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

const createFacility = async (
  token: string,
  IdToken: string,
  payload: any,
  id: string
) => {
  try {
      const result = await apiRequest(
        `${FACILITY_API_ROUTES.CREATE_FACILITY}?id=${id}`,
        "POST",
        payload,
        token,
        IdToken
      );

      if (result?.success) {
        return result.data;
      }

      throw new Error(" Failed to update facility");
    } catch (error) {
      console.error(" Error in createFacility:", error);
      return null;
    }
  };

interface ListViewProps {
  facilities: Facility[];
  onFacilityUpdate?: (updatedFacilities: Facility[]) => void;
  token?: string;
  IdToken?: string;
}

export default function ListView({ 
  facilities, 
  onFacilityUpdate,
  token,
  IdToken 
}: ListViewProps) {
  const router = useRouter();
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({});
  const [localFacilities, setLocalFacilities] = useState<Facility[]>(facilities);

  const totalPages = Math.ceil(localFacilities.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const displayedFacilities = localFacilities.slice(startIndex, endIndex);

  const toggleRowExpansion = (absoluteIndex: number) => {
    setExpandedRows((prevExpandedRows) =>
      prevExpandedRows.includes(absoluteIndex)
        ? prevExpandedRows.filter((index) => index !== absoluteIndex)
        : [...prevExpandedRows, absoluteIndex]
    );
  };

  const hassmartPriceControlDetails = (facility: Facility) => {
    return facility.smartPriceControl && facility.smartPriceControl.method;
  };

  const getSubscriptionStatus = (facility: Facility) => {
    if (facility.installedSmartPriceController) {
      return "Added";
    }
    return "Not Added";
  };

  const getSmartPriceControlStatus = (facility: Facility) => {
    if (facility.smartPriceControlAdded) {
      if (facility.installedSmartPriceController) {
        return "Installed";
      } else {
        return "Wants Smart Pricing";
      }
    }
    return "Not Active";
  };

  const handleInstallSmartPriceController = async (facilityId: string) => {
    const token = localStorage.getItem("token");
    const IdToken = localStorage.getItem("IdToken");
    if (!token || !IdToken) {
      console.error("Authentication tokens are required");
      return;
    }

    const currentFacility = localFacilities.find(f => f.id === facilityId);
    if (!currentFacility) {
      console.error("Facility not found");
      return;
    }

    setLoadingStates(prev => ({ ...prev, [facilityId]: true }));

    try {
      const payload = {
        ...currentFacility,
        installedSmartPriceController: true,
        status: "Active",
      };

      const result = await createFacility(token, IdToken, payload, facilityId);

      if (result) {
        const updatedFacilities = localFacilities.map(facility =>
          facility.id === facilityId
            ? { ...facility, installedSmartPriceController: true }
            : facility
        );
        
        setLocalFacilities(updatedFacilities);
        
        if (onFacilityUpdate) {
          onFacilityUpdate(updatedFacilities);
        }
      } else {
        console.error("Failed to update facility");
      }
    } catch (error) {
      console.error("Error updating facility:", error);
    } finally {
      setLoadingStates(prev => ({ ...prev, [facilityId]: false }));
    }
  };

  React.useEffect(() => {
    setLocalFacilities(facilities);
  }, [facilities]);

  return (
    <div className="bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                XRGi Facility
              </th>
              <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Model
              </th>
              <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subscription
              </th>
              <th className="px-4 py-3 w-12"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {displayedFacilities.length > 0 ? (
              displayedFacilities.map((facility, index) => {
                const absoluteIndex = startIndex + index;
                return (
                  <React.Fragment key={`facility-${absoluteIndex}`}>
                    <tr className="hover:bg-gray-50 transition">
                      <td className="px-4 sm:px-6 py-3 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <img
                            src="/Box.png"
                            alt="folder"
                            className="w-6 h-6"
                          />
                          <span className="text-gray-800 text-sm truncate cursor-pointer" onClick={() => router.push(`/admin/user/plantDetail/${facility.id}`)}>
                            {facility.name}
                          </span>
                        </div>
                      </td>
                      <td className="hidden sm:table-cell px-6 py-3 whitespace-nowrap text-sm text-gray-600 cursor-pointer" onClick={() => router.push(`/admin/user/plantDetail/${facility.id}`)}>
                        {facility.xrgiID}
                      </td>
                      <td className="hidden md:table-cell px-6 py-3 whitespace-nowrap text-sm text-gray-600">
                        {facility.modelNumber}
                      </td>
                      <td className="hidden sm:table-cell px-6 py-3 whitespace-nowrap text-sm text-gray-600">
                        {getSubscriptionStatus(facility)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => toggleRowExpansion(absoluteIndex)}
                          className="text-gray-500 hover:text-gray-700 focus:outline-none p-1 rounded"
                          aria-label="Toggle details"
                        >
                          {expandedRows.includes(absoluteIndex) ? (
                            <ChevronDown size={16} />
                          ) : (
                            <ChevronRight size={16} />
                          )}
                        </button>
                      </td>
                    </tr>

                    {expandedRows.includes(absoluteIndex) && (
                      <tr className="bg-gray-50 border-t border-b border-gray-200">
                        <td colSpan={5} className="px-0 py-0">
                          <div className="mx-4 sm:mx-6 my-4 bg-white rounded-lg shadow-sm border border-gray-100">
                            <div className="p-4 sm:p-6">
                              <div className="grid grid-cols-1 md:grid-rows-1 gap-6">
                                <div className="md:hidden space-y-3 p-2 bg-gray-50 rounded-md">
                                  <h4 className="font-medium text-sm text-gray-700 mb-2">
                                    Facility Details
                                  </h4>
                                  <div className="flex justify-between text-sm py-1 border-b border-gray-100">
                                    <span className="font-medium text-gray-600">
                                      XRGi Facility:
                                    </span>
                                    <span>{facility.xrgiID}</span>
                                  </div>
                                  <div className="flex justify-between text-sm py-1 border-b border-gray-100">
                                    <span className="font-medium text-gray-600">
                                      Model:
                                    </span>
                                    <span>{facility.modelNumber}</span>
                                  </div>
                                  <div className="flex justify-between text-sm py-1">
                                    <span className="font-medium text-gray-600">
                                      Services:
                                    </span>
                                    <span>
                                      {facility.hasServiceContract
                                        ? "Added"
                                        : "Not added"}
                                    </span>
                                  </div>
                                </div>

                                <div className="space-y-5">
                                  <h4 className="font-medium text-sm text-gray-700 mb-3">
                                    Status Overview
                                  </h4>

                                  {/* Smart PriceControl Card */}
                                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                    <div className="flex items-center justify-between mb-3">
                                      <span className="text-sm font-medium text-gray-700">
                                        Smart PriceControl
                                      </span>
                                      <div className="flex items-center">
                                        {facility.smartPriceControlAdded ? (
                                          facility.installedSmartPriceController ? (
                                            <div className="flex items-center bg-green-50 text-green-600 px-2 py-1 rounded-full">
                                              <Check
                                                size={14}
                                                className="mr-1"
                                              />
                                              <span className="text-xs font-medium">
                                                Installed
                                              </span>
                                            </div>
                                          ) : (
                                            <div className="flex items-center bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
                                              <AlertCircle
                                                size={14}
                                                className="mr-1"
                                              />
                                              <span className="text-xs font-medium">
                                                Wants Smart Pricing
                                              </span>
                                            </div>
                                          )
                                        ) : (
                                          <div className="flex items-center bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
                                            <X size={14} className="mr-1" />
                                            <span className="text-xs font-medium">
                                              Not Active
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                    {facility.smartPriceControlAdded && !facility.installedSmartPriceController && (
                                      <div className="flex items-center justify-between bg-blue-50 p-3 rounded">
                                        <span className="text-xs text-blue-600">
                                          Customer wants smart pricing installation
                                        </span>
                                        <button
                                          onClick={() => handleInstallSmartPriceController(facility.id)}
                                          disabled={loadingStates[facility.id]}
                                          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-3 py-1 rounded text-xs font-medium transition-colors duration-200"
                                        >
                                          {loadingStates[facility.id] ? (
                                            <div className="flex items-center">
                                              <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent mr-1"></div>
                                              Installing...
                                            </div>
                                          ) : (
                                            "Mark as Installed"
                                          )}
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="relative w-64 h-32 mb-4">
                      <div className="absolute transform -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
                        <img
                          src="/Folder Not Found.png"
                          alt=""
                          className="w-64 h-32"
                        />
                      </div>
                    </div>
                    <p className="text-gray-500">No registered facilities</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 sm:px-6 py-3 bg-white border-t border-gray-200">
        <div className="flex items-center space-x-3 mb-3 sm:mb-0">
          <span className="text-sm text-gray-700">Row per Page</span>
          <div className="relative">
            <select
              className="appearance-none bg-white border border-gray-300 text-gray-700 py-1 pl-3 pr-8 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition cursor-pointer"
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
                setExpandedRows([]);
              }}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
              <ChevronDown size={14} />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto">
          <span className="text-sm text-gray-700 mr-4">
            {localFacilities.length === 0
              ? "0-0 of 0"
              : `${startIndex + 1}-${Math.min(
                  endIndex,
                  localFacilities.length
                )} of ${localFacilities.length}`}
          </span>
          <div className="flex">
            <button
              className={`p-1 rounded-md ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-600 hover:text-gray-800"
              }`}
              disabled={currentPage === 1}
              onClick={() => {
                setCurrentPage((prev) => prev - 1);
                setExpandedRows([]);
              }}
            >
              <ArrowLeft size={16} />
            </button>
            <button
              className={`p-1 rounded-md ${
                currentPage === totalPages || localFacilities.length === 0
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-600 hover:text-gray-800"
              }`}
              disabled={currentPage === totalPages || localFacilities.length === 0}
              onClick={() => {
                setCurrentPage((prev) => prev + 1);
                setExpandedRows([]);
              }}
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}