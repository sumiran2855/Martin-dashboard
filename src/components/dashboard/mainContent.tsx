"use client";
import { Search, Filter, Grid, List, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import GridView from "@/components/dashboard/view/gridView";
import ListView from "@/components/dashboard/view/listView";
import { useRouter } from "next/navigation";
import { getAllFacility } from "@/services/facilityServices";
import { useTranslation } from "react-i18next";

const statusOptions = ["All", "Active", "Data Missing", "Inactive"];
interface Facility {
  facilityId?: number;
  name?: string;
  xrgiID?: string;
  modelNumber?: string;
  status?: string;
  hasServiceContract?: boolean;
  featureAdded?: boolean;
  serviceProvider?: {
    name?: string;
    mailAddress?: string;
    phone?: string;
  };
}

export default function MainContent() {
  const router = useRouter();
  const { t } = useTranslation("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [view, setView] = useState("grid");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [facilitiesData, setFacilitiesData] = useState<Facility[]>([]);
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
    const fetchFacilities = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      const IdToken = localStorage.getItem("IdToken");
      if (token && IdToken) {
        try {
          const data = await getAllFacility(token, IdToken);
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

  const filteredData = facilitiesData
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
          <div className="p-8">
            <h1 className="text-2xl font-medium text-gray-800 mb-2">
              {t("facilitiesTitle")}
            </h1>
            <p className="text-gray-600 mb-6">{t("facilitiesDescription")}</p>

            <div className="flex justify-between items-center mb-6">
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
                    <div className="absolute left-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-md">
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
                    <span>
                      {view === "list" ? t("listView") : t("gridView")}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="absolute left-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-md">
                      <button
                        onClick={() => handleSelect("list")}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <List size={16} className="mr-2" /> {t("listView")}
                      </button>
                      <button
                        onClick={() => handleSelect("grid")}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Grid size={16} className="mr-2" /> {t("gridView")}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder={t("searchPlaceholder")}
                    className="pl-10 pr-4 py-2 w-64 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search size={16} className="text-gray-400" />
                  </div>
                </div>

                <button
                  onClick={() => router.push("/dashboard/addFacility")}
                  className="px-4 py-2 text-sm text-white bg-blue-800 rounded-md hover:bg-blue-900"
                >
                  {t("registerFacilities")}
                </button>
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
