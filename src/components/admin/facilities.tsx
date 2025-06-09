import { ArrowLeft, HelpCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiRequest } from "@/utils/authHelper";

interface Facility {
  userID: string;
  facilityId?: string;
  location?: { address: string };
  name: string;
  modelNumber: string;
  xrgiID: string;
  serviceProvider?: {
    name: string;
    mailAddress: string;
    phone: string;
  };
  EnergyCheck_plus?: {
    annualSavings: string;
    co2Savings: string;
    operatingHours: string;
    industry: string;
  };
}

export default function facilities({ facilityId }: { facilityId: string }) {
  const router = useRouter();
  const [facility, setFacility] = useState<Facility | null>(null);
  const [loading, setLoading] = useState(true);

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

  const facilityDetails = [
    { label: "Annual Savings", value: facility?.EnergyCheck_plus?.annualSavings  
      ? facility?.EnergyCheck_plus?.annualSavings ?? "-" : "-" },
    { label: "Annual CO₂ savings", value: facility?.EnergyCheck_plus?.co2Savings ? `${facility.EnergyCheck_plus.co2Savings}` : "-" },
    { label: "Operating hours per year", value: facility?.EnergyCheck_plus?.operatingHours ? `${facility.EnergyCheck_plus.operatingHours} hrs` : "-" },
    { label: "Industry", value: facility?.EnergyCheck_plus?.industry ? `${facility.EnergyCheck_plus.industry}` : "-" },
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
                href={`/admin/user/${facility?.userID}`}
                className="flex items-center gap-2 text-lg font-medium text-blue-600 no-underline transition-all duration-200 hover:text-blue-800 mb-4"
              >
                <div className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition">
                  <ArrowLeft size={20} className="text-blue-600" />
                </div>
                <span className="text-xl">Back</span>
              </Link>

              <h1 className="text-2xl font-semibold text-gray-800 ml-6">
                {facility?.facilityId || "Facility Details"}
              </h1>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-4 ml-6">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p>{facility?.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p>{facility?.location?.address}</p>
              </div>
            </div>
          </div>

          <div className="flex-1 p-6 overflow-auto ml-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg border p-6">
                <h2 className="text-lg font-medium mb-4">
                  Model {facility?.modelNumber}
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
                  <h2 className="text-lg font-medium">Basic Data</h2>
                  <button
                    className="text-blue-600 border border-blue-600 rounded px-3 py-1 text-sm"
                    onClick={() => router.push(`/admin/user/editFacilities/${facilityId}`)}
                  >
                    Edit
                  </button>
                </div>
                <div className="space-y-2">
                  {facilityDetails.map((item, index) => (
                    <div key={index}
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
          </div>
        </div>
      )}
    </>
  );
}
