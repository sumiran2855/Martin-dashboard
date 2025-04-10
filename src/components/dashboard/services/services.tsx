import { useEffect, useState } from "react";
import withAuth from "@/auth/authUtils";
import { ChevronDown, Filter, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getAllFacility } from "@/services/facilityServices";
import GridView from "./gridView";

interface Facility {
  id?: number;
  name?: string;
  xrgiID?: string;
  modelNumber?: string;
  hasServiceContract?: boolean;
  featureAdded?: boolean;
  serviceProvider?: {
    name?: string;
    mailAddress?: string;
    phone?: string;
  };
  status: string;
}

const statusOptions = ["All", "Active", "Inactive", "MissingData"];

function SubscriptionPage() {
  const { t } = useTranslation("subscription");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [facilitiesData, setFacilitiesData] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);

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
          const data: Facility[] = await getAllFacility(token, IdToken);
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
      return false;
    });

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
        <div className="flex-1 overflow-auto p-8">
          <h1 className="text-2xl font-medium text-gray-800 mb-2">
            {t("services.servicesTitle")}
          </h1>
          <p className="text-gray-600 mb-6">
            {t("services.servicesDescription")}
          </p>

          <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button
                  className="flex items-center px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                  onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                >
                  <Filter size={16} className="mr-2" />
                  <span>{t("sortBy")}</span>
                  <ChevronDown size={16} className="ml-2" />
                </button>
                {sortDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-md top-[38px]  z-10 w-full">
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
            </div>
          </div>

          {/* Grid View */}
          <GridView facilities={filteredData} />
        </div>
      )}
    </>
  );
}

export default withAuth(SubscriptionPage);
