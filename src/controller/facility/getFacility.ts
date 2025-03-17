// third approach

import { useEffect, useState, useRef } from "react";
import { getAllFacility } from "@/services/stepperServices";

interface Facility {
  id?: number;
  name?: string;
  xrgi?: string;
  model?: string;
  status?: "Active";
}

export function useGetFacility() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
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
        const formattedFacilities = facilityData.map((facility) => ({
          id: facility.id,
          name: facility?.location?.address || "",
          xrgi: facility?.registerSystem?.XRGINumber || "",
          model: facility?.registerSystem?.model || "",
          status: facility?.status || "Active",
        }));

        setFacilities(formattedFacilities);
      } else {
        setFacilities([]);
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
    handleGetFacility,
  };
}
