import { useEffect, useState } from "react";
import withAuth from "@/auth/authUtils";
import { ChevronDown, FileDown, Filter, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getAllFacilityForAdmin } from "@/services/facilityServices";
import GridView from "@/components/dashboard/services/gridView";
import {
  exportSuperSaverData,
  getCustomerById,
} from "@/services/customerServices";

interface Facility {
  userID?:string,
  id?: number;
  name?: string;
  xrgiID?: string;
  status?:string;
  modelNumber?: string;
  isInstalled:boolean;
  daSigned:boolean;
  location?:{
    city:string,
    address:string,
    postal_code:string
  }
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

const statusOptions = ["All", "Active", "Inactive", "MissingData", "WithProvider", "WithoutProvider"];

function ServicesPage() {
  const { t } = useTranslation("subscription");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [facilitiesData, setFacilitiesData] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const handleStatusSelect = (status: string) => {
    setSelectedStatus(status);
    setSortDropdownOpen(false);
  };

  useEffect(() => {
    const fetchFacilities = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      const IdToken = localStorage.getItem("IdToken");
      if (token && IdToken) {
        try {
          const data: Facility[] = await getAllFacilityForAdmin(token, IdToken);
          const filteredData = data.filter(
            (facility) => facility.hasServiceContract === true
          );
          setFacilitiesData(filteredData);
        } catch (error) {
          console.error("Error fetching facilities", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchFacilities();
  }, []);

  const filteredData = facilitiesData
    .filter((facility) =>
      facility.name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((facility) => {
      if (selectedStatus === "All") return true;
      if (selectedStatus === "Active") return facility.status === "Active";
      if (selectedStatus === "Inactive") return facility.status === "Inactive";
      if (selectedStatus === "MissingData")
        return facility.status === "Data Missing";
      if (selectedStatus === "WithProvider") {
        return (
          facility.hasServiceContract &&
          facility.serviceProvider &&
          facility.serviceProvider.name &&
          facility.serviceProvider.mailAddress &&
          facility.serviceProvider.phone
        );
      }
      if (selectedStatus === "WithoutProvider") {
        return (
          facility.hasServiceContract &&
          (!facility.serviceProvider ||
            (!facility.serviceProvider.name &&
              !facility.serviceProvider.mailAddress &&
              !facility.serviceProvider.phone))
        );
      }
      return false;
    });

  const handleExportExcelForServiceProvider = async (data: Facility[]) => {
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
            hasServiceContract: item.hasServiceContract && item.serviceProvider &&
            item.serviceProvider.name &&
            item.serviceProvider.mailAddress &&
            item.serviceProvider.phone
              ? "has a service contract"
              : "want a service contract",
            serviceProvider_name: item.serviceProvider?.name,
            serviceProvider_email: item.serviceProvider?.mailAddress,
            serviceProvider_Phone: item.serviceProvider?.phone,
            SuperSaverX: item.featureAdded && item.feature?.method
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
      link.setAttribute("download", "serviceProvider.xlsx");

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

  return (
    <>
      {loading && (
        <div className="fixed inset-0 flex justify-center items-center bg-white/70 backdrop-blur-sm z-50">
          <div
            className="loader animate-spin rounded-full border-4 border-gray-300 border-t-gray-900 h-12 w-12"
            role="status"
            aria-hidden="true"
          ></div>
        </div>
      )}
      {isExporting && (
        <div className="fixed inset-0 flex justify-center items-center bg-white/70 backdrop-blur-sm z-50">
          <div className="loader animate-spin rounded-full border-4 border-gray-300 border-t-gray-900 h-12 w-12" />
        </div>
      )}
      {!loading && (
        <div className="flex-1 overflow-auto p-8">
          <h1 className="text-2xl font-medium text-gray-800 mb-2">
            {t("services.servicesTitle")}
          </h1>
          <p className="text-gray-600 mb-6">
            {t("services.servicesDescription")}
          </p>

          <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
            <div className="flex items-center space-x-4">
              <div className="relative w-64">
                <button
                  className="flex items-center px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 "
                  onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                >
                  <Filter size={16} className="mr-2" />
                  <span>{t("sortBy")}</span>
                  <ChevronDown size={16} className="ml-2" />
                </button>
                {sortDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-md">
                    {statusOptions.map((status) => (
                      <button
                        key={status}
                        onClick={() => handleStatusSelect(status)}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {t(`statusOptions.${status}`)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder={t("services.searchPlaceholder")}
                  className="pl-10 pr-4 py-2 w-96 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search size={16} className="text-gray-400" />
                </div>
              </div>
              <button
                  onClick={() => handleExportExcelForServiceProvider(filteredData)}
                className="flex items-center px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md"
              >
                <FileDown size={16} className="mr-2" />
                export file
              </button>
            </div>
          </div>

          {/* Grid View */}
          <GridView facilities={filteredData} />
        </div>
      )}
    </>
  );
}

export default withAuth(ServicesPage);
