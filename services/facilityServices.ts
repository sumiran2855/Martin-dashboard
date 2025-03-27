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
      console.error(" No valid facility data found.");
      return null;
    }

    const facilityData = result.data[0];
    if (!facilityData || !facilityData.id) {
      console.error(" Facility ID is missing in API response.");
      return null;
    }

    return {
      facilityId: facilityData.id,
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

      systemCosts: {
        vat: facilityData.SystemCostsInfo?.VAT_Deduction_Percent || "",
        serviceCost: facilityData.SystemCostsInfo?.service_Costs || "",
        VATDeduction: facilityData.SystemCostsInfo?.VAT_Deduction || "",
      },

      gas_Consumption: {
        m3: facilityData.gas_Consumption?.annual_gas_consumption_m3 || "",
        gasType: facilityData.gas_Consumption?.xrgi_gas_type || "",
        independentDKK: facilityData.gas_Consumption?.gas_fixed_costs_dkk || "",
        dependentDKK:
          facilityData.gas_Consumption?.gas_variable_costs_dkk || "",
      },

      electircity_Consumption: {
        kWh:
          facilityData.electircity_Consumption?.annual_grid_consumption_kwh ||
          "",
        electricityIndependentDKK:
          facilityData.electircity_Consumption?.fixed_costs_dkk || "",
        electricityDependentDKK:
          facilityData.electircity_Consumption?.variable_costs_dkk || "",
      },

      serviceProvider: {
        name: facilityData.serviceProvider?.name || "",
        mailAddress: facilityData.serviceProvider?.mailAddress || "",
        phone: facilityData.serviceProvider?.phone || "",
      },

      feature: {
        method: facilityData.feature?.method || "",
        partner_details: {
          name: facilityData.feature?.partner_details?.name || "",
          mobile: facilityData.feature?.partner_details?.mobile || "",
          email: facilityData.feature?.partner_details?.email || "",
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
      throw new Error("No facility data available");
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
      systemCosts: {
        vat: facilityData.systemCosts?.VAT_Deduction_Percent || "",
        serviceCost: facilityData.systemCosts?.service_Costs || "",
        VATDeduction: facilityData.systemCosts?.VAT_Deduction || "",
      },

      gas_Consumption: {
        m3: facilityData.gas_Consumption?.annual_gas_consumption_m3 || "",
        gasType: facilityData.gas_Consumption?.xrgi_gas_type || "",
        independentDKK: facilityData.gas_Consumption?.gas_fixed_costs_dkk || "",
        dependentDKK:
          facilityData.gas_Consumption?.gas_variable_costs_dkk || "",
      },
      electircity_Consumption: {
        kWh:
          facilityData.electircity_Consumption?.annual_grid_consumption_kwh ||
          "",
        electricityIndependentDKK:
          facilityData.electircity_Consumption?.fixed_costs_dkk || "",
        electricityDependentDKK:
          facilityData.electircity_Consumption?.variable_costs_dkk || "",
      },
      serviceProvider: {
        name: facilityData.serviceProvider?.name,
        mailAddress: facilityData.serviceProvider?.mailAddress,
        phone: facilityData.serviceProvider?.phone,
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
      throw new Error("No facility data available");
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
      systemCosts: {
        vat: facilityData.systemCosts?.VAT_Deduction_Percent || "",
        serviceCost: facilityData.systemCosts?.service_Costs || "",
        VATDeduction: facilityData.systemCosts?.VAT_Deduction || "",
      },

      gas_Consumption: {
        m3: facilityData.gas_Consumption?.annual_gas_consumption_m3 || "",
        gasType: facilityData.gas_Consumption?.xrgi_gas_type || "",
        independentDKK: facilityData.gas_Consumption?.gas_fixed_costs_dkk || "",
        dependentDKK:
          facilityData.gas_Consumption?.gas_variable_costs_dkk || "",
      },
      electircity_Consumption: {
        kWh:
          facilityData.electircity_Consumption?.annual_grid_consumption_kwh ||
          "",
        electricityIndependentDKK:
          facilityData.electircity_Consumption?.fixed_costs_dkk || "",
        electricityDependentDKK:
          facilityData.electircity_Consumption?.variable_costs_dkk || "",
      },
      serviceProvider: {
        name: facilityData?.serviceProvider?.name,
        mailAddress: facilityData?.serviceProvider?.mailAddress,
        phone: facilityData?.serviceProvider?.phone,
      },
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
