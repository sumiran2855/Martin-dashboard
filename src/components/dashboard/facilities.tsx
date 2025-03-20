import { ArrowLeft, HelpCircle } from "lucide-react";
import Link from "next/link";
import BarChart from "@/components/barChart";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiRequest } from "@/utils/apiClient";

interface Facility {
  facilityId?: string;
  location?: { address: string };
  name: string;
  modelNumber: string;
  xrgiID: string;
  systemCosts?: { service_Costs: string ,VAT_Deduction_Percent:string};
  gas_Consumption?: {
    annual_gas_consumption_m3: string;
    xrgi_gas_type: string;
    gas_fixed_costs_dkk: string;
    gas_variable_costs_dkk: string;
  };
  serviceProvider?: {
    name: string;
    mailAddress: string;
    phone: string;
  };
  electircity_Consumption?: {
    annual_grid_consumption_kwh: string;
    fixed_costs_dkk: string;
    variable_costs_dkk: string;
  };
}

export default function facilities({ facilityId }: { facilityId: string }) {
  const router = useRouter();

  const [facility, setFacility] = useState<Facility | null>(null);

  useEffect(() => {
    async function fetchFacility() {
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
        console.log("🚀 ~ fetchFacility ~ response:", response);

        if (!response.success || !response.data) {
          throw new Error("Failed to fetch facility data");
        }

        setFacility(response.data);
      } catch (error) {
        console.error("Error fetching facility details:", error);
      }
    }

    if (facilityId) {
      fetchFacility();
    }
  }, [facilityId]);

  const facilityDetails = [
    {
      label: "Service costs per operating hour",
      value: facility?.systemCosts?.service_Costs,
    },
    {
      label: "VAT Deduction Percentage",
      value: facility?.systemCosts?.VAT_Deduction_Percent,
    },
    { label: "Gas supply", value: facility?.gas_Consumption?.xrgi_gas_type },
    {
      label: "Consumption-dependent costs, gas",
      value: facility?.gas_Consumption?.gas_variable_costs_dkk + " m³",
    },
    {
      label: "Consumption-Independent costs, gas",
      value: facility?.gas_Consumption?.gas_fixed_costs_dkk + " m³",
    },
    {
      label: "Annual gas consumption",
      value: facility?.gas_Consumption?.annual_gas_consumption_m3 + " m³",
    },
    {
      label: "Consumption-dependent costs, electricity",
      value: facility?.electircity_Consumption?.variable_costs_dkk + " kWh",
    },
    {
      label: "Consumption-Independent costs, electricity",
      value:
        facility?.electircity_Consumption?.fixed_costs_dkk + " kWh",
    },
    {
      label: "Annual electricity consumption",
      value: facility?.electircity_Consumption?.annual_grid_consumption_kwh + " kWh",
    },
  ];

  return (
    <>
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
                  onClick={() =>
                    router.push(
                      `/dashboard/facilities/editFacilities/${facilityId}`
                    )
                  }
                >
                  Edit
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

          <div className="bg-white rounded-lg border mt-6 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">SuperSaverX Consumption</h2>
              <HelpCircle size={20} className="text-gray-400" />
            </div>
            <BarChart />
            <div className="flex justify-center space-x-6 mt-4 text-sm">
              <div className="flex items-center">
                <span className="w-3 h-3 bg-yellow-300 rounded-full inline-block mr-2"></span>
                <span className="text-gray-700">XRGI</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 bg-blue-900 rounded-full inline-block mr-2"></span>
                <span className="text-gray-700">Tariffs</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 bg-blue-400 rounded-full inline-block mr-2"></span>
                <span className="text-gray-700">Flex Price</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 bg-gray-300 rounded-full inline-block mr-2"></span>
                <span className="text-gray-700">VAT</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
