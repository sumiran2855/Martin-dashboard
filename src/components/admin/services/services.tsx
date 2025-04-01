import { useEffect, useState } from "react";
import withAuth from "@/auth/authUtils";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getAllFacilityForAdmin } from "@/services/facilityServices";
import GridView from "@/components/dashboard/services/gridView";

interface Facility {
  facilityId?: number;
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
}

function ServicesPage() {
  const { t } = useTranslation("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [facilitiesData, setFacilitiesData] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFacilities = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      const IdToken = localStorage.getItem("IdToken");
      if (token && IdToken) {
        try {
          const data: Facility[] = await getAllFacilityForAdmin(token, IdToken);
          const filteredData = data.filter((facility) => facility.hasServiceContract === true);
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

  const filteredData = facilitiesData.filter((facility) =>
    facility.name?.toLowerCase().includes(searchTerm.toLowerCase())
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
        <div className="flex-1 overflow-auto p-8">
          <h1 className="text-2xl font-medium text-gray-800 mb-2">
            {t("facilitiesTitle")}
          </h1>
          <p className="text-gray-600 mb-6">{t("facilitiesDescription")}</p>

          {/* Search Input */}
          <div className="flex mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder={t("searchPlaceholder")}
                className="pl-10 pr-4 py-2 w-96 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
            </div>
          </div>

          {/* Grid View */}
         <GridView facilities={filteredData}/>
        </div>
      )}
    </>
  );
}

export default withAuth(ServicesPage);
