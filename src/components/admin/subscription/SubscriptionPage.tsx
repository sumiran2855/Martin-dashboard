import { useEffect, useState } from "react";
import withAuth from "@/auth/authUtils";
import { Search, Filter, ChevronDown, FileDown } from "lucide-react";
import ListView from "@/components/dashboard/subscription/listView";
import { getAllFacilityForAdmin } from "@/services/facilityServices";
import {
  exportSuperSaverData,
  getCustomerById,
} from "@/services/customerServices";
import ListView2 from "@/components/dashboard/subscription/listView2";

interface Facility {
  userID?: string;
  id?: number;
  name?: string;
  xrgiID?: string;
  status?: string;
  modelNumber?: string;
  isInstalled: boolean;
  daSigned: boolean;
  location?: {
    city: string;
    address: string;
    postal_code: string;
  };
  hasPerformanceReport?: boolean;
  performance_report?: {
    annualSavings?: number | null;
    co2Savings?: number | null;
    industry?: string | null;
    operatingHours?: number | null;
  };
  featureAdded?: boolean;
  feature?: {
    method?: string;
    partner_details?: {
      name: string;
      mobile: string;
      email: string;
      countryCode: string;
    };
  };

  hasServiceContract?: boolean;
  serviceProvider?: {
    name?: string;
    mailAddress?: string;
    phone?: string;
  };
}

const superSaverOptions = ["All", "Have SuperSaverX", "Want SuperSaverX"];
const performanceOptions = ["All", "Want a Report", "Don’t want a report"];

function SubscriptionPage() {
  const [facilitiesData, setFacilitiesData] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  // SuperSaverX states
  const [superSearch, setSuperSearch] = useState("");
  const [superFilter, setSuperFilter] = useState("All");
  const [superDropdownOpen, setSuperDropdownOpen] = useState(false);

  // Performance Report states
  const [reportSearch, setReportSearch] = useState("");
  const [reportFilter, setReportFilter] = useState("All");
  const [reportDropdownOpen, setReportDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchFacilities = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      const IdToken = localStorage.getItem("IdToken");
      if (token && IdToken) {
        try {
          const data: Facility[] = await getAllFacilityForAdmin(token, IdToken);
          setFacilitiesData(data);
        } catch (error) {
          console.error("Error fetching facilities", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchFacilities();
  }, []);

  const filterFacilities = (
    data: Facility[],
    search: string,
    filter: string,
    type: "super" | "report"
  ) => {
    return data
      .filter((facility) =>
        facility.name?.toLowerCase().includes(search.toLowerCase())
      )
      .filter((facility) => {
        if (type === "super") {
          switch (filter) {
            case "Have SuperSaverX":
              return facility.featureAdded && facility.feature?.method;
            case "Want SuperSaverX":
              return facility.featureAdded && !facility.feature?.method;
            default:
              return facility.featureAdded;
          }
        } else {
          if (!facility.hasPerformanceReport) return false;

          const report = facility.performance_report;
          const allNull =
            report &&
            report.annualSavings == null &&
            report.co2Savings == null &&
            report.industry == null &&
            report.operatingHours == null;

          switch (filter) {
            case "Want a Report":
              return allNull;
            case "Don’t want a report":
              return !allNull;
            default:
              return true;
          }
        }
      });
  };

  const handleExportExcelForSuperSaverX = async (data: Facility[]) => {
    try {
      setIsExporting(true);
      if (!Array.isArray(data)) {
        throw new Error("Data is not an array");
      }

      const token = localStorage.getItem("token") || "";
      const IdToken = localStorage.getItem("IdToken") || "";

      const refinedData = await Promise.all(
        data.map(async (item) => {
          const customer = await getCustomerById(token, IdToken, item.userID!);
          const isLocalPartner = item.feature?.method === "local_partner";

          return {
            userId: item.userID,
            facilityId: item.id,
            plantName: item.name,
            modelNumber: item.modelNumber,
            xrgiID: item.xrgiID,
            status: item.status,
            city: item.location?.city,
            address: item.location?.address,
            isInstalled: item.isInstalled ? "YES" : "NO",
            AgreementSigned: item.daSigned ? "YES" : "NO",
            hasServiceContract: item.hasServiceContract
              ? "has a service contract"
              : "want a service contract",
            serviceProvider_name: item.serviceProvider?.name,
            serviceProvider_email: item.serviceProvider?.mailAddress,
            serviceProvider_Phone: item.serviceProvider?.phone,
            SuperSaverX:
              item.featureAdded && item.feature?.method
                ? "Has SuperSaverX"
                : "Wants SuperSaverX",
            SuperSaverX_method: isLocalPartner
              ? "Local Partner"
              : item.feature?.method,
            ...(isLocalPartner && {
              partner_Name: item.feature?.partner_details?.name || "",
              partner_email: item.feature?.partner_details?.email || "",
              partner_phone: item.feature?.partner_details?.mobile || "",
            }),
            hasPerformanceReport: item.hasPerformanceReport
              ? "Wants report"
              : "Don’t want report",
            annual_Savings: item.performance_report?.annualSavings,
            co2Savings: item.performance_report?.co2Savings,
            industry: item.performance_report?.industry,
            operatingHours: item.performance_report?.operatingHours,
            customer_email: customer?.email || "",
            customer_phone: customer?.phone || "",
          };
        })
      );

      const blob = await exportSuperSaverData(refinedData, token, IdToken);
      if (!(blob instanceof Blob)) {
        throw new Error("The response is not a valid Blob.");
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "SuperSaverX.xlsx");

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export error:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportExcelForReport = async (data: Facility[]) => {
    try {
      setIsExporting(true);
      if (!Array.isArray(data)) {
        throw new Error("Data is not an array");
      }
      const token = localStorage.getItem("token") || "";
      const IdToken = localStorage.getItem("IdToken") || "";
      const refinedData = await Promise.all(
        data.map(async (item) => {
          const customer = await getCustomerById(token, IdToken, item.userID!);
          const isLocalPartner = item.feature?.method === "local_partner";

          return {
            userId: item.userID,
            facilityId: item.id,
            plantName: item.name,
            modelNumber: item.modelNumber,
            xrgiID: item.xrgiID,
            status: item.status,
            city: item.location?.city,
            address: item.location?.address,
            isInstalled: item.isInstalled ? "YES" : "NO",
            AgreementSigned: item.daSigned ? "YES" : "NO",
            hasServiceContract: item.hasServiceContract
              ? "has a service contract"
              : "want a service contract",
            serviceProvider_name: item.serviceProvider?.name,
            serviceProvider_email: item.serviceProvider?.mailAddress,
            serviceProvider_Phone: item.serviceProvider?.phone,
            SuperSaverX:
              item.featureAdded && item.feature?.method
                ? "Has SuperSaverX"
                : "Wants SuperSaverX",
            SuperSaverX_method: isLocalPartner
              ? "Local Partner"
              : item.feature?.method,
            ...(isLocalPartner && {
              partner_Name: item.feature?.partner_details?.name || "",
              partner_email: item.feature?.partner_details?.email || "",
              partner_phone: item.feature?.partner_details?.mobile || "",
            }),
            hasPerformanceReport: item.hasPerformanceReport
              ? "Wants report"
              : "Don’t want report",
            annual_Savings: item.performance_report?.annualSavings,
            co2Savings: item.performance_report?.co2Savings,
            industry: item.performance_report?.industry,
            operatingHours: item.performance_report?.operatingHours,
            customer_email: customer?.email || "",
            customer_phone: customer?.phone || "",
          };
        })
      );

      const blob = await exportSuperSaverData(refinedData, token, IdToken);
      if (!(blob instanceof Blob)) {
        throw new Error("The response is not a valid Blob.");
      }
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Performance_report.xlsx");

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export error:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const superSaverData = filterFacilities(
    facilitiesData,
    superSearch,
    superFilter,
    "super"
  );
  const reportData = filterFacilities(
    facilitiesData,
    reportSearch,
    reportFilter,
    "report"
  );

  return (
    <>
      {loading && (
        <div className="fixed inset-0 flex justify-center items-center bg-white/70 backdrop-blur-sm z-50">
          <div className="loader animate-spin rounded-full border-4 border-gray-300 border-t-gray-900 h-12 w-12"></div>
        </div>
      )}
      {isExporting && (
        <div className="fixed inset-0 flex justify-center items-center bg-white/70 backdrop-blur-sm z-50">
          <div className="loader animate-spin rounded-full border-4 border-gray-300 border-t-gray-900 h-12 w-12" />
        </div>
      )}
      {!loading && (
        <div className="flex-1 overflow-auto p-8">
          <section className="mb-12">
            <h1 className="text-2xl font-medium text-gray-800 mb-2">
              SuperSaverX Overview
            </h1>
            <p className="text-gray-600 mb-6">
              View and manage SuperSaverX access for all facilities.
            </p>

            <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
              <div className="relative">
                <button
                  onClick={() => setSuperDropdownOpen(!superDropdownOpen)}
                  className="flex items-center px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <Filter size={16} className="mr-2" />
                  Sort By
                  <ChevronDown size={16} className="ml-2" />
                </button>
                {superDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-white border rounded-md shadow-md z-10">
                    {superSaverOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setSuperFilter(option);
                          setSuperDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-4 items-center">
                <div className="relative">
                  <input
                    type="text"
                    value={superSearch}
                    onChange={(e) => setSuperSearch(e.target.value)}
                    placeholder="Search by facility name"
                    className="pl-10 pr-4 py-2 w-80 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search size={16} className="text-gray-400" />
                  </div>
                </div>
                <button
                  onClick={() =>
                    handleExportExcelForSuperSaverX(superSaverData)
                  }
                  className="flex items-center px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                >
                  <FileDown size={16} className="mr-2" />
                  export file
                </button>
              </div>
            </div>

            <ListView facilities={superSaverData} />
          </section>

          <section>
            <h2 className="text-2xl font-medium text-gray-800 mb-2">
              Performance Report Overview
            </h2>
            <p className="text-gray-600 mb-6">
              View and manage performance report access for all facilities.
            </p>

            <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
              <div className="relative">
                <button
                  onClick={() => setReportDropdownOpen(!reportDropdownOpen)}
                  className="flex items-center px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <Filter size={16} className="mr-2" />
                  Sort By
                  <ChevronDown size={16} className="ml-2" />
                </button>
                {reportDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-white border rounded-md shadow-md z-10">
                    {performanceOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setReportFilter(option);
                          setReportDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-4 items-center">
                <div className="relative">
                  <input
                    type="text"
                    value={reportSearch}
                    onChange={(e) => setReportSearch(e.target.value)}
                    placeholder="Search by facility name"
                    className="pl-10 pr-4 py-2 w-80 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search size={16} className="text-gray-400" />
                  </div>
                </div>
                <button
                  onClick={() => handleExportExcelForReport(reportData)}
                  className="flex items-center px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                >
                  <FileDown size={16} className="mr-2" />
                  export file
                </button>
              </div>
            </div>

            <ListView2 facilities={reportData} />
          </section>
        </div>
      )}
    </>
  );
}

export default withAuth(SubscriptionPage, true);
