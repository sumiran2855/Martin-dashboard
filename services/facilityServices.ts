import { FACILITY_API_ROUTES } from "@/routes/facilityRoutes";
import { apiRequest } from "@/utils/authHelper";

// create facility
export const createFacility = async (
  token: string,
  IdToken: string,
  payload: any
) => {
  try {
    const existingFacility = await getFacility(token, IdToken);

    if (existingFacility && existingFacility.facilityId) {
      const result = await apiRequest(
        `${FACILITY_API_ROUTES.CREATE_FACILITY}?id=${existingFacility.facilityId}`,
        "POST",
        payload,
        token,
        IdToken
      );

      if (result?.success) {
        return result.data;
      }

      throw new Error(" Failed to update facility");
    }

    const result = await apiRequest(
      FACILITY_API_ROUTES.CREATE_FACILITY,
      "POST",
      payload,
      token,
      IdToken
    );

    if (result?.success) {
      return result.data;
    }

    throw new Error(" Failed to create facility");
  } catch (error) {
    console.error(" Error in createFacility:", error);
    return null;
  }
};

// get facility
export const getFacility = async (token: string, IdToken: string) => {
  const userId = localStorage.getItem("userId");
  if (!userId) {
    console.error(" No userId found in localStorage.");
    return null;
  }

  try {
    const result = await apiRequest(
      `${FACILITY_API_ROUTES.GET_FACILITY}?id=${userId}`,
      "GET",
      undefined,
      token,
      IdToken
    );

    if (
      !result ||
      !result.success ||
      !result.data ||
      result.data.length === 0
    ) {
      console.log(" No valid facility data found.");
      return null;
    }

    const facilityData = result.data[0];
    if (!facilityData || !facilityData.id) {
      console.error(" Facility ID is missing in API response.");
      return null;
    }

    return {
      facilityId: facilityData.id || "",
      name: facilityData.name || "",
      modelNumber: facilityData.modelNumber || "",
      xrgiID: facilityData.xrgiID || "",
      userID: facilityData.userID || "",
      status: facilityData.status || "",
      createdAt: facilityData.createdAt || "",
      updatedAt: facilityData.updatedAt || "",
      DaSigned: facilityData.DaSigned || false,
      isInstalled: facilityData.isInstalled || false,
      location: {
        address: facilityData.location?.address || "",
        postalCode: facilityData.location?.postalCode || "",
        city: facilityData.location?.city || "",
      },

      EnergyCheck_plus:{
        annualSavings: facilityData.EnergyCheck_plus?.annualSavings || "",
        co2Savings: facilityData.EnergyCheck_plus?.co2Savings || "",
        operatingHours: facilityData.EnergyCheck_plus?.operatingHours || "",
        industry: facilityData.EnergyCheck_plus?.industry || "",
        email: facilityData.EnergyCheck_plus?.email || "",
      },
      hasEnergyCheckPlus:facilityData.hasEnergyCheckPlus || false,
      serviceProvider: {
        name: facilityData.serviceProvider?.name || "",
        mailAddress: facilityData.serviceProvider?.mailAddress || "",
        phone: facilityData.serviceProvider?.phone || "",
        countryCode:facilityData.serviceProvider?.countryCode || "",
      },
      hasServiceContract: facilityData.hasServiceContract || false,
      needServiceContract:facilityData.needServiceContract || false,
      smartPriceControlAdded: facilityData.smartPriceControlAdded || false,
      smartPriceControl: {
        method: facilityData.smartPriceControl?.method || "",
        partner_details: {
          name: facilityData.smartPriceControl?.partner_details?.name || "",
          mobile: facilityData.smartPriceControl?.partner_details?.mobile || "",
          email: facilityData.smartPriceControl?.partner_details?.email || "",
          countryCode: facilityData.smartPriceControl?.partner_details?.countryCode || "",
        },
      },
    };
  } catch (error) {
    console.error(" Error fetching facility data:", error);
    return null;
  }
};

// get all facility
export const getAllFacility = async (token: string, IdToken: string) => {
  const userId = localStorage.getItem("userId");

  try {
    const result = await apiRequest(
      `${FACILITY_API_ROUTES.GET_FACILITY}?id=${userId}`,
      "GET",
      undefined,
      token,
      IdToken
    );

    if (!result || !result.success || !result.data) {
      console.log("No facility data available");
    }

    return result.data.map((facilityData: any) => ({
      facilityId: facilityData.id || "",
      name: facilityData.name || "",
      modelNumber: facilityData.modelNumber || "",
      xrgiID: facilityData.xrgiID || "",
      userID: facilityData.userID || "",
      status: facilityData.status || "",
      createdAt: facilityData.createdAt || "",
      updatedAt: facilityData.updatedAt || "",
      DaSigned: facilityData.DaSigned || false,
      isInstalled: facilityData.isInstalled || false,
      location: {
        address: facilityData.location?.address || "",
        postalCode: facilityData.location?.postalCode || "",
        city: facilityData.location?.city || "",
      },
      serviceProvider: {
        name: facilityData.serviceProvider?.name || "",
        mailAddress: facilityData.serviceProvider?.mailAddress || "",
        phone: facilityData.serviceProvider?.phone || "",
      },
      EnergyCheck_plus:{
        annualSavings: facilityData.EnergyCheck_plus?.annualSavings || "",
        co2Savings: facilityData.EnergyCheck_plus?.co2Savings || "",
        operatingHours: facilityData.EnergyCheck_plus?.operatingHours || "",
        industry: facilityData.EnergyCheck_plus?.industry || "",
      },
      hasEnergyCheckPlus:facilityData.hasEnergyCheckPlus || false,
      hasServiceContract: facilityData.hasServiceContract || false,
      smartPriceControlAdded: facilityData.smartPriceControlAdded || false,
      smartPriceControl: {
        method: facilityData.smartPriceControl?.method || "",
        partner_details: {
          name: facilityData.smartPriceControl?.partner_details?.name || "",
          mobile: facilityData.smartPriceControl?.partner_details?.mobile || "",
          email: facilityData.smartPriceControl?.partner_details?.email || "",
        },
      },
    }));
  } catch (error) {
    console.error("Error fetching facility data:", error);
    return [];
  }
};

// get all user facility
export const getAllUserFacility = async (
  token: string,
  IdToken: string,
  userId: string
) => {
  try {
    const result = await apiRequest(
      `${FACILITY_API_ROUTES.GET_FACILITY}?id=${userId}`,
      "GET",
      undefined,
      token,
      IdToken
    );

    if (!result || !result.success || !result.data) {
      console.log("No facility data available");
    }

    return result.data.map((facilityData: any) => ({
      facilityId: facilityData.id || "",
      name: facilityData.name || "",
      modelNumber: facilityData.modelNumber || "",
      xrgiID: facilityData.xrgiID || "",
      userID: facilityData.userID || "",
      status: facilityData.status || "",
      createdAt: facilityData.createdAt || "",
      updatedAt: facilityData.updatedAt || "",
      location: {
        address: facilityData.location?.address || "",
        postalCode: facilityData.location?.postalCode || "",
        city: facilityData.location?.city || "",
      },
      hasServiceContract:facilityData.hasServiceContract || false,
      serviceProvider: {
        name: facilityData?.serviceProvider?.name || "",
        mailAddress: facilityData?.serviceProvider?.mailAddress || "",
        phone: facilityData?.serviceProvider?.phone || "",
      },
      EnergyCheck_plus:{
        annualSavings: facilityData.EnergyCheck_plus?.annualSavings || "",
        co2Savings: facilityData.EnergyCheck_plus?.co2Savings || "",
        operatingHours: facilityData.EnergyCheck_plus?.operatingHours || "",
        industry: facilityData.EnergyCheck_plus?.industry || "",
      },
      hasEnergyCheckPlus:facilityData.hasEnergyCheckPlus || false,
      smartPriceControlAdded: facilityData.smartPriceControlAdded || false,
      smartPriceControl: {
        method: facilityData.smartPriceControl?.method || "",
        partner_details: {
          name: facilityData.smartPriceControl?.partner_details?.name || "",
          mobile: facilityData.smartPriceControl?.partner_details?.mobile || "",
          email: facilityData.smartPriceControl?.partner_details?.email || "",
        }
      }
    }));
  } catch (error) {
    console.error("Error fetching facility data:", error);
    return [];
  }
};

// add facility
export const addFacility = async (
  token: string,
  IdToken: string,
  payload: any
) => {
  const result = await apiRequest(
    FACILITY_API_ROUTES.CREATE_FACILITY,
    "POST",
    payload,
    token,
    IdToken
  );

  if (result.success) {
    return result.data;
  }
  throw new Error("Failed to create facility");
};

// get all facility for admin
export const getAllFacilityForAdmin = async (
  token: string,
  IdToken: string
) => {
  const result = await apiRequest(
    `${FACILITY_API_ROUTES.GET_ALL_FACILITY}`,
    "GET",
    undefined,
    token,
    IdToken
  )
  if (result.success) {
    return result.data;
  }
  throw new Error("Failed to get facility");
};