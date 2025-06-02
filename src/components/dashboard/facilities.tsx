import { ArrowLeft, HelpCircle, Download, Calendar, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiRequest } from "@/utils/authHelper";
import { useTranslation } from "react-i18next";

interface Facility {
  facilityId?: string;
  location?: { address: string };
  name: string;
  modelNumber: string;
  xrgiID: string;
  performance_report?: {
    annualSavings: string;
    co2Savings: string;
    operatingHours: string;
    industry: string;
    email: string;
  };
}

interface HealthCheckData {
  XRGI_ID: string;
  energy_check_plus_saving: number;
  createdAt: string;
  address: string;
  url: string;
  annualSavings: string;
  city: string;
  runtimeHours: string;
  service_Provider_Name: string;
  userId: string;
  updatedAt: string;
  service_Provider_Phone: string;
  service_Provider_MailAddress: string;
  operatingHours: string;
  id: string;
  facilityId: string;
  postalCode: string;
}

interface GroupedHealthCheckData {
  [month: string]: HealthCheckData[];
}

export default function facilities({ facilityId }: { facilityId: string }) {
  const router = useRouter();
  const { t } = useTranslation("facility");
  const [facility, setFacility] = useState<Facility | null>(null);
  const [healthCheckData, setHealthCheckData] = useState<HealthCheckData[]>([]);
  const [groupedHealthCheckData, setGroupedHealthCheckData] =
    useState<GroupedHealthCheckData>({});
  const [loading, setLoading] = useState(true);
  const [healthCheckLoading, setHealthCheckLoading] = useState(false);

  useEffect(() => {
    async function fetchFacility() {
      setLoading(true);
      const token = localStorage.getItem("token") || "";
      const IdToken = localStorage.getItem("IdToken") || "";

      try {
        const response = await apiRequest(
          `get-facility?id=${facilityId}`,
          "GET",
          undefined,
          token,
          IdToken
        );

        if (!response.success || !response.data) {
          return;
        }

        setFacility(response.data);
      } catch (error) {
        console.error("Error fetching facility details:", error);
      } finally {
        setLoading(false);
      }
    }

    if (facilityId) {
      fetchFacility();
    }
  }, [facilityId]);

  useEffect(() => {
    async function fetchHealthCheck() {
      if (!facility?.xrgiID) return;
      console.log("Fetching health check for XRGI ID:", facility.xrgiID);
      setHealthCheckLoading(true);
      const token = localStorage.getItem("token") || "";
      const IdToken = localStorage.getItem("IdToken") || "";
      const x_api_token = process.env.NEXT_PUBLIC_X_API_TOKEN || "";

      try {
        const response = await apiRequest(
          `get-healthCheck/${facility.xrgiID}`,
          "GET",
          undefined,
          token,
          IdToken,
          x_api_token
        );

        if (response.success && response.data) {
          const healthCheckArray = Array.isArray(response.data)
            ? response.data
            : [response.data];
          setHealthCheckData(healthCheckArray);

          // Group data by month
          const grouped = groupDataByMonth(healthCheckArray);
          setGroupedHealthCheckData(grouped);
        }
      } catch (error) {
        console.error("Error fetching health check details:", error);
      } finally {
        setHealthCheckLoading(false);
      }
    }

    fetchHealthCheck();
  }, [facility]);

  const groupDataByMonth = (
    data: HealthCheckData[]
  ): GroupedHealthCheckData => {
    const grouped: GroupedHealthCheckData = {};

    data.forEach((item) => {
      const date = new Date(item.createdAt);
      const monthYear = date.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });

      if (!grouped[monthYear]) {
        grouped[monthYear] = [];
      }
      grouped[monthYear].push(item);
    });

    return grouped;
  };

  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isLowRuntimeHours = (runtimeHours: string): boolean => {
    const hours = parseFloat(runtimeHours);
    return !isNaN(hours) && hours < 200;
  };

  const facilityDetails = [
    { label: t("facilityDetail.annualSavings"), value: facility?.performance_report?.annualSavings  
      ? facility?.performance_report?.annualSavings ?? "-" : "-" },
    { label: t("facilityDetail.co2Savings"), value: facility?.performance_report?.co2Savings ? `${facility.performance_report.co2Savings}` : "-" },
    { label: t("facilityDetail.operatingHours"), value: facility?.performance_report?.operatingHours ? `${facility.performance_report.operatingHours} hrs` : "-" },
    { label: t("facilityDetail.industry"), value: facility?.performance_report?.industry ? `${facility.performance_report.industry}` : "-" },
    {label:t("facilityDetail.email"),value:facility?.performance_report?.email ? `${facility.performance_report.email}` : "-" }
  ];  

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
          <div className=" px-6 py-4">
            <div className="flex flex-col">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-lg font-medium text-blue-600 no-underline transition-all duration-200 hover:text-blue-800 mb-4"
              >
                <div className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition">
                  <ArrowLeft size={20} className="text-blue-600" />
                </div>
                <span className="text-xl">{t("back")}</span>
              </Link>

              <h1 className="text-2xl font-semibold text-gray-800 ml-6">
                {facility?.facilityId || t("facilityDetails")}
              </h1>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-4 ml-6">
              <div>
                <p className="text-sm text-gray-500">{t("name")}</p>
                <p>{facility?.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">{t("address")}</p>
                <p>{facility?.location?.address}</p>
              </div>
            </div>
          </div>

          <div className="flex-1 p-6 overflow-auto ml-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-lg border p-6">
                <h2 className="text-lg font-medium mb-4">
                  {t("model")} {facility?.modelNumber}
                </h2>
                <div className="flex justify-center">
                  <img
                    src="/ECP_Productshots_XRGI_9_closed_pointing_right 1.png"
                    alt="Facility model"
                    className="w-64 h-64"
                  />
                </div>
              </div>

              <div className="bg-white rounded-lg border p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium">{t("basicData")}</h2>
                  <button
                    className="text-blue-600 border border-blue-600 rounded px-3 py-1 text-sm hover:bg-blue-50 transition"
                    onClick={() =>
                      router.push(
                        `/dashboard/facilities/editFacilities/${facilityId}`
                      )
                    }
                  >
                    {t("edit")}
                  </button>
                </div>
                <div className="space-y-2">
                  {facilityDetails.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between py-2 border-b border-gray-100"
                    >
                      <span className="text-gray-600">{item.label}</span>
                      <span className="font-medium text-gray-800">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Energy Check Plus Section */}
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center gap-2 mb-6">
                <HelpCircle className="text-blue-600" size={24} />
                <h2 className="text-xl font-semibold text-gray-800">
                  Energy Check Plus Details
                </h2>
              </div>

              {healthCheckLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="loader animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 h-8 w-8"></div>
                </div>
              ) : Object.keys(groupedHealthCheckData).length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <HelpCircle
                    size={48}
                    className="mx-auto mb-4 text-gray-300"
                  />
                  <p>No Energy Check Plus data available</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {Object.entries(groupedHealthCheckData)
                    .sort(
                      ([a], [b]) =>
                        new Date(b).getTime() - new Date(a).getTime()
                    )
                    .map(([month, data]) => (
                      <div
                        key={month}
                        className="border rounded-lg overflow-hidden"
                      >
                        <div className="bg-gray-50 px-4 py-3 border-b">
                          <div className="flex items-center gap-2">
                            <Calendar size={20} className="text-blue-600" />
                            <h3 className="text-lg font-medium text-gray-800">
                              {month}
                            </h3>
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                              {data.length} record{data.length > 1 ? "s" : ""}
                            </span>
                          </div>
                        </div>

                        {data.some((item) => isLowRuntimeHours(item.runtimeHours)) && (
                          <div className="bg-orange-50 border-l-4 border-orange-400 p-4">
                            <div className="flex items-center">
                              <AlertTriangle className="text-orange-400 mr-3" size={20} />
                              <div>
                                <p className="text-sm text-orange-800 font-medium">
                                  Low runtime hours detected. Please contact your service provider.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Desktop View */}
                        <div className="hidden md:block">
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    XRGI ID
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Expected Annual Savings
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Monthly Savings
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Operational Hours
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Service Provider
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Report
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {data.map((item, index) => (
                                  <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                      {item.XRGI_ID}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                      $ {item.annualSavings}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                      $ {item.energy_check_plus_saving}
                                    </td>
                                    <td className={`px-4 py-4 whitespace-nowrap text-sm ${
                                      isLowRuntimeHours(item.runtimeHours) 
                                        ? 'text-orange-600 font-medium' 
                                        : 'text-gray-900'
                                    }`}>
                                      {item.runtimeHours ?? "N/A"} hrs
                                      {isLowRuntimeHours(item.runtimeHours) && (
                                        <AlertTriangle className="inline ml-1" size={14} />
                                      )}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                      {item.service_Provider_Name ?? "N/A"}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                      <button
                                        onClick={() =>
                                          handleDownload(
                                            item.url,
                                            `health-check-${item.XRGI_ID}.pdf`
                                          )
                                        }
                                        className="inline-flex items-center gap-2 px-3 py-1 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition text-sm"
                                      >
                                        <Download size={14} />
                                        Download PDF
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Mobile View */}
                        <div className="md:hidden">
                          <div className="divide-y divide-gray-200">
                            {data.map((item, index) => (
                              <div key={index} className="p-4 space-y-3">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <div className="text-sm font-medium text-gray-900">
                                      XRGI ID: {item.XRGI_ID}
                                    </div>
                                    <div className="text-sm text-gray-500 mt-1">
                                      Annual Savings: ${item.annualSavings}
                                    </div>
                                    <div className={`text-sm mt-1 ${
                                      isLowRuntimeHours(item.runtimeHours) 
                                        ? 'text-orange-600 font-medium' 
                                        : 'text-gray-500'
                                    }`}>
                                      Runtime Hours: {item.runtimeHours ?? "N/A"} hrs
                                      {isLowRuntimeHours(item.runtimeHours) && (
                                        <AlertTriangle className="inline ml-1" size={14} />
                                      )}
                                    </div>
                                  </div>
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    ECP: ${item.energy_check_plus_saving}
                                  </span>
                                </div>

                                <div className="text-sm text-gray-900">
                                  <span className="text-gray-500">
                                    Service Provider:
                                  </span>{" "}
                                  {item.service_Provider_Name}
                                </div>

                                <div className="flex justify-end">
                                  <button
                                    onClick={() =>
                                      handleDownload(
                                        item.url,
                                        `health-check-${item.XRGI_ID}.pdf`
                                      )
                                    }
                                    className="inline-flex items-center gap-2 px-3 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition text-sm"
                                  >
                                    <Download size={14} />
                                    Download PDF
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
