import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

interface Facility {
  facilityId?: number;
  name?: string;
  xrgiID?: string;
  modelNumber?: string;
  hasServiceContract?: boolean;
  featureAdded?: boolean;
  feature?: {
    method?: string;
  };
  serviceProvider?: {
    name?: string;
    mailAddress?: string;
    phone?: string;
  };
}

export default function listView({ facilities }: { facilities: Facility[] }) {
  const { t } = useTranslation("dashboard");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredFacilities = facilities.filter(
    (facility) => facility.featureAdded === true
  );

  const totalPages = Math.ceil(filteredFacilities.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const displayedFacilities = filteredFacilities.slice(startIndex, endIndex);
  const router = useRouter();

  return (
    <div className="bg-white border border-gray-200 rounded-md shadow-sm overflow-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t("name")}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t("xrgiFacility")}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t("model")}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t("superSaverX")}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t("services")}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {displayedFacilities.length > 0 ? (
            displayedFacilities.map((facility, index) => (
              <tr key={index} className="hover:bg-gray-50 transition">
                <td className="px-6 py-3 whitespace-nowrap flex items-center space-x-3">
                  <img src="/Box.png" alt="folder" className="w-7 h-7" />
                  <span className="text-gray-800 text-sm">{facility.name}</span>
                </td>
                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-600">
                  {facility.xrgiID}
                </td>
                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-600">
                  {facility.modelNumber}
                </td>
                <td className="px-6 py-3 whitespace-nowrap flex items-center space-x-2">
                  <img
                    src={
                      facility.featureAdded 
                        ? "/Active.png"
                        : "/Inactive.png"
                    }
                    alt={
                      facility.featureAdded 
                        ? "Active"
                        : "Inactive"
                    }
                    className="w-5 h-5"
                  />
                  <span className="text-sm text-gray-700">
                    {facility.featureAdded 
                      ? "Active"
                      : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-600">
                  {facility.hasServiceContract ? t("Available") : t("Unavailable") }
                </td>
                <td className="px-6 py-2 text-right">
                  <button
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() =>
                      router.push(
                        `/dashboard/facilities/${facility.facilityId}`
                      )
                    }
                  >
                    ➝
                  </button>
                </td>
              </tr>
            ))
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
                  <p className="text-gray-500">{t("noFacilities")}</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="flex items-center justify-between px-6 py-3 bg-white border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-700">{t("rowsPerPage")}</span>
          <div className="relative">
            <select
              className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 pl-3 pr-8 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition cursor-pointer"
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
            <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
              ▼
            </div>
          </div>
        </div>
        <div className="flex items-center">
          <span className="text-sm text-gray-700 mr-4">
            {filteredFacilities.length === 0
              ? "0-0 of 0"
              : `${startIndex + 1}-${Math.min(
                  endIndex,
                  filteredFacilities.length
                )} of ${filteredFacilities.length}`}
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
                currentPage === totalPages || filteredFacilities.length === 0
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-600 hover:text-gray-800"
              }`}
              disabled={
                currentPage === totalPages || filteredFacilities.length === 0
              }
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


