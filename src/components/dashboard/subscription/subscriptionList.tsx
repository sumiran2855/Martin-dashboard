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
import { useTranslation } from "react-i18next";

interface Facility {
  name: string;
  xrgiID: string;
  modelNumber: string;
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
  };
  hasServiceContract?: boolean;
  serviceProvider?: {
    name?: string;
    mailAddress?: string;
    phone?: string;
  };
}

export default function ListView({ facilities }: { facilities: Facility[] }) {
  const { t } = useTranslation("subscription");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);

  const totalPages = Math.ceil(facilities.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const displayedFacilities = facilities.slice(startIndex, endIndex);

  const toggleRowExpansion = (absoluteIndex: number) => {
    setExpandedRows((prevExpandedRows) =>
      prevExpandedRows.includes(absoluteIndex)
        ? prevExpandedRows.filter((index) => index !== absoluteIndex)
        : [...prevExpandedRows, absoluteIndex]
    );
  };

  const hasFeatureDetails = (facility: Facility) => {
    return facility.feature && facility.feature.method;
  };

  const hasPerformanceReportDetails = (facility: Facility) => {
    return (
      facility.performance_report &&
      facility.performance_report.annualSavings !== null &&
      facility.performance_report.co2Savings !== null &&
      facility.performance_report.industry !== null &&
      facility.performance_report.operatingHours !== null
    );
  };

  const getSubscriptionStatus = (facility: Facility) => {
    if (facility.hasPerformanceReport && facility.hasServiceContract) {
      return t("added");
    }
    return t("unavailable");
  };

  return (
    <div className="bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t("tableHeaders.name")}
              </th>
              <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t("tableHeaders.facility")}
              </th>
              <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t("tableHeaders.model")}
              </th>
              <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t("tableHeaders.subscription")}
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
                          <span className="text-gray-800 text-sm truncate">
                            {facility.name}
                          </span>
                        </div>
                      </td>
                      <td className="hidden sm:table-cell px-6 py-3 whitespace-nowrap text-sm text-gray-600">
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
                                    {t("facilityDetails")}:
                                  </h4>
                                  <div className="flex justify-between text-sm py-1 border-b border-gray-100">
                                    <span className="font-medium text-gray-600">
                                      {t("xrgiFacility")};
                                    </span>
                                    <span>{facility.xrgiID}</span>
                                  </div>
                                  <div className="flex justify-between text-sm py-1 border-b border-gray-100">
                                    <span className="font-medium text-gray-600">
                                      {t("model")}:
                                    </span>
                                    <span>{facility.modelNumber}</span>
                                  </div>
                                  <div className="flex justify-between text-sm py-1">
                                    <span className="font-medium text-gray-600">
                                      {t("service")}:
                                    </span>
                                    <span>
                                      {facility.hasServiceContract
                                        ? t("added")
                                        : t("unavailable")}
                                    </span>
                                  </div>
                                </div>

                                <div className="space-y-5">
                                  <h4 className="font-medium text-sm text-gray-700 mb-3">
                                    {t("statusOverview")}
                                  </h4>

                                  {/* Smart PriceControl Card */}
                                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                    <div className="flex items-center justify-between mb-3">
                                      <span className="text-sm font-medium text-gray-700">
                                        {t("smartPriceControl")}
                                      </span>
                                      <div className="flex items-center">
                                        {facility.featureAdded ? (
                                          hasFeatureDetails(facility) ? (
                                            <div className="flex items-center bg-green-50 text-green-600 px-2 py-1 rounded-full">
                                              <Check
                                                size={14}
                                                className="mr-1"
                                              />
                                              <span className="text-xs font-medium">
                                                {t("active")}
                                              </span>
                                            </div>
                                          ) : (
                                            <div className="flex items-center bg-yellow-50 text-yellow-600 px-2 py-1 rounded-full">
                                              <AlertCircle
                                                size={14}
                                                className="mr-1"
                                              />
                                              <span className="text-xs font-medium">
                                                {t("processing")}
                                              </span>
                                            </div>
                                          )
                                        ) : (
                                          <div className="flex items-center bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
                                            <X size={14} className="mr-1" />
                                            <span className="text-xs font-medium">
                                              {t("notActive")}
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                    {facility.featureAdded &&
                                      !hasFeatureDetails(facility) && (
                                        <div className="text-xs text-yellow-600 bg-yellow-50 p-2 rounded">
                                          {t("requestPending")}
                                        </div>
                                      )}
                                  </div>

                                  {/* HealthCheck Plus Card */}
                                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                    <div className="flex items-center justify-between mb-3">
                                      <span className="text-sm font-medium text-gray-700">
                                        {t("energyCheckPlus")}
                                      </span>
                                      <div className="flex items-center">
                                        {facility.hasPerformanceReport ? (
                                          hasPerformanceReportDetails(
                                            facility
                                          ) ? (
                                            <div className="flex items-center bg-green-50 text-green-600 px-2 py-1 rounded-full">
                                              <Check
                                                size={14}
                                                className="mr-1"
                                              />
                                              <span className="text-xs font-medium">
                                                {t("active")}
                                              </span>
                                            </div>
                                          ) : (
                                            <div className="flex items-center bg-yellow-50 text-yellow-600 px-2 py-1 rounded-full">
                                              <AlertCircle
                                                size={14}
                                                className="mr-1"
                                              />
                                              <span className="text-xs font-medium">
                                                {t("processing")}
                                              </span>
                                            </div>
                                          )
                                        ) : (
                                          <div className="flex items-center bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
                                            <X size={14} className="mr-1" />
                                            <span className="text-xs font-medium">
                                              {t("notActive")}
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                    {facility.hasPerformanceReport &&
                                      !hasPerformanceReportDetails(
                                        facility
                                      ) && (
                                        <div className="text-xs text-yellow-600 bg-yellow-50 p-2 rounded">
                                          {t("requestPending")}
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
                    <p className="text-gray-500">{t("noRegisteredFacilities")}</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 sm:px-6 py-3 bg-white border-t border-gray-200">
        <div className="flex items-center space-x-3 mb-3 sm:mb-0">
          <span className="text-sm text-gray-700">{t("rowsPerPage")}</span>
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
            {facilities.length === 0
              ? "0-0 of 0"
              : `${startIndex + 1}-${Math.min(
                  endIndex,
                  facilities.length
                )} of ${facilities.length}`}
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
                currentPage === totalPages || facilities.length === 0
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-600 hover:text-gray-800"
              }`}
              disabled={currentPage === totalPages || facilities.length === 0}
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
