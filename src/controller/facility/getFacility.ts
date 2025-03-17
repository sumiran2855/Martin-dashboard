// import { useEffect, useState, useRef } from "react";
// import { getAllFacility } from "@/services/stepperServices";

// export function useGetFacility() {
//   const [stepTwoFormData, setStepTwoFormData] = useState({
//     systemName: "",
//     XRGINumber: "",
//     model: "",
//     address: "",
//     postalCode: "",
//     city: "",
//     serviceCost: "5.75",
//     vat: "12",
//     VATDeduction: "Yes",
//     m3: "",
//     gasType: "",
//     independentDKK: "",
//     dependentDKK: "",
//     kWh: "",
//     electricityIndependentDKK: "",
//     electricityDependentDKK: "",
//     status:"Active"
//   });

//   const isFetching = useRef(false);

//   const handleGetFacility = async () => {
//     if (isFetching.current) return;
//     isFetching.current = true;

//     const token = localStorage.getItem("token");
//     const IdToken = localStorage.getItem("IdToken");

//     if (!token || !IdToken) {
//       console.error("Authorization token missing.");
//       isFetching.current = false;
//       return;
//     }

//     try {
//       const facilityData = await getAllFacility(token, IdToken);
//       if (facilityData) {
//         setStepTwoFormData((prev) => ({
//           ...prev,
//           systemName: facilityData?.registerSystem?.systemName || "",
//           XRGINumber: facilityData?.registerSystem?.XRGINumber || "",
//           model: facilityData?.registerSystem?.model || "",

//           address: facilityData?.location?.address || "",
//           postalCode: facilityData?.location?.postalCode || "",
//           city: facilityData?.location?.city || "",

//           serviceCost: facilityData?.systemCost?.serviceCost || "5.75",
//           vat: facilityData?.systemCost?.vat || "12",
//           VATDeduction: facilityData?.systemCost?.VATDeduction || "",

//           m3: facilityData?.gasConsumption?.m3 || "",
//           gasType: facilityData?.gasConsumption?.gasType || "",
//           independentDKK: facilityData?.gasConsumption?.independentDKK || "",
//           dependentDKK: facilityData?.gasConsumption?.dependentDKK || "",

//           kWh: facilityData?.electricityConsumption?.kWh || "",
//           electricityIndependentDKK:
//             facilityData?.electricityConsumption?.electricityIndependentDKK || "",
//           electricityDependentDKK:
//             facilityData?.electricityConsumption?.electricityDependentDKK || "",
//         }));
//       }
//     } catch (error) {
//       console.error("Error fetching facility data:", error);
//     } finally {
//       isFetching.current = false;
//     }
//   };

//   useEffect(() => {
//     handleGetFacility();
//   }, []);

//   return { stepTwoFormData, handleGetFacility };
// }

import { useEffect, useState, useRef } from "react";
import { getAllFacility } from "@/services/stepperServices";

interface Facility {
  registerSystem?: {
    systemName?: string;
    XRGINumber?: string;
    model?: string;
  };
  location?: {
    address?: string;
    postalCode?: string;
    city?: string;
  };
  systemCost?: {
    serviceCost?: string;
    vat?: string;
    VATDeduction?: string;
  };
  gasConsumption?: {
    m3?: string;
    gasType?: string;
    independentDKK?: string;
    dependentDKK?: string;
  };
  electricityConsumption?: {
    kWh?: string;
    electricityIndependentDKK?: string;
    electricityDependentDKK?: string;
  };
  status?: string;
  id?: string;
}

export function useGetFacility() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const isFetching = useRef(false);

  const handleGetFacility = async () => {
    if (isFetching.current) return;
    isFetching.current = true;

    try {
      const token = localStorage.getItem("token");
      const IdToken = localStorage.getItem("IdToken");

      if (!token || !IdToken) throw new Error("Authorization token missing.");

      const facilityData = await getAllFacility(token, IdToken);

      if (Array.isArray(facilityData) && facilityData.length > 0) {
        setFacilities(facilityData);
        setSelectedFacility(facilityData[0]);
      } else {
        setFacilities([]);
        setSelectedFacility(null);
      }
    } catch (error) {
      console.error("Error fetching facility data:", error);
    } finally {
      isFetching.current = false;
    }
  };

  useEffect(() => {
    handleGetFacility();
  }, []);

  return {
    facilities,
    selectedFacility,
    setSelectedFacility,
    handleGetFacility,
  };
}
