import { apiRequest } from "@/utils/apiClient";

// create profile (step 1)
export const createProfile = async (
  token: string,
  IdToken: string,
  payload: any
) => {
  const result = await apiRequest(
    "create-profile",
    "POST",
    payload,
    token,
    IdToken
  );

  if (result.success) {
    return result.data;
  }

  throw new Error("Failed to create profile");
};

// get facility 
export const getFacility = async (token: string, IdToken: string) => {
  const userId = localStorage.getItem("userId");
  if (!userId) {
    console.error("❌ No userId found in localStorage.");
    return null;
  }

  try {
    const result = await apiRequest(
      `get-user-facility?id=${userId}`,
      "GET",
      undefined,
      token,
      IdToken
    );
    console.log("🚀 ~ getFacility ~ result:", result)

    if (!result || !result.success || !result.data || result.data.length === 0) {
      console.error("❌ No valid facility data found.");
      return null;
    }

    const facilityData = result.data[0];
    if (!facilityData || !facilityData.id) {
      console.error("❌ Facility ID is missing in API response.");
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
        dependentDKK: facilityData.gas_Consumption?.gas_variable_costs_dkk || "",
      },

      electircity_Consumption: {
        kWh: facilityData.electircity_Consumption?.annual_grid_consumption_kwh || "",
        electricityIndependentDKK:
          facilityData.electircity_Consumption?.fixed_costs_dkk || "",
        electricityDependentDKK:
          facilityData.electircity_Consumption?.variable_costs_dkk || "",
      },

      serviceProvider: {
        name: facilityData.serviceProvider?.name || "",
        mailAddress: facilityData.serviceProvider?.mailAddress || "",
        phone: facilityData.serviceProvider?.phone || "",
      }
    };
  } catch (error) {
    console.error("❌ Error fetching facility data:", error);
    return null;
  }
};

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
        `create-facility?id=${existingFacility.facilityId}`, 
        "POST",
        payload,
        token,
        IdToken
      );

      if (result?.success) {
        return result.data;
      }

      throw new Error("❌ Failed to update facility");
    }

    const result = await apiRequest(
      "create-facility",
      "POST",
      payload,
      token,
      IdToken
    );

    if (result?.success) {
      return result.data;
    }

    throw new Error("❌ Failed to create facility");
  } catch (error) {
    console.error("❌ Error in createFacility:", error);
    return null;
  }
};

// create addFeature
export const addFeature = async (
  token: string,
  IdToken: string,
  payload: any
) => {
  const result = await apiRequest(
    "add-Feature",
    "POST",
    payload,
    token,
    IdToken
  );

  if (result.success) {
    return result.data;
  }

  throw new Error("Failed to create profile");
};

// get customer
export const getCustomer = async (token: string, IdToken: string) => {
  try {
    const result = await apiRequest(
      "get-customer",
      "GET",
      undefined,
      token,
      IdToken
    );
    if (!result || !result.success || !result.data) {
      throw new Error("Failed to fetch customer data");
    }
    const { companyInfo, contactPerson, email, phone_number, name } =
      result.data;
    return {
      companyName: companyInfo?.name || "",
      cvrNumber: companyInfo?.cvr_number || "",
      address: companyInfo?.address || "",
      postal_code: companyInfo?.postal_code || "",
      city: companyInfo?.city || "",
      email: companyInfo?.email || email || "",
      countryCode: phone_number?.slice(0, 3) || "",
      phone: companyInfo?.phone || contactPerson?.phone || phone_number || "",

      firstName: contactPerson?.firstName || "",
      lastName: contactPerson?.lastName || "",
      personalPhone: contactPerson?.personalPhone || "",
      personalEmail: contactPerson?.personalEmail || "",

      name: name || "",
      email_verified: result.data.email_verified || false,
    };
  } catch (error) {
    console.error("Error fetching customer data:", error);
    return null;
  }
};

// add facility
export const addFacility = async (
  token: string,
  IdToken: string,
  payload: any
) => {
  const result = await apiRequest(
    "create-facility",
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

// get all facility
export const getAllFacility = async (token: string, IdToken: string) => {
  const userId = localStorage.getItem("userId");

  try {
    const result = await apiRequest(
      `get-user-facility?id=${userId}`,
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
      modelNumber:facilityData.modelNumber || "",
      xrgiID:facilityData.xrgiID || "",
      userID: facilityData.userID || "",
      status:facilityData.status || "",
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
        dependentDKK: facilityData.gas_Consumption?.gas_variable_costs_dkk || "",
      },
      electircity_Consumption: {
        kWh: facilityData.electircity_Consumption?.annual_grid_consumption_kwh || "",
        electricityIndependentDKK:
          facilityData.electircity_Consumption?.fixed_costs_dkk || "",
        electricityDependentDKK:
          facilityData.electircity_Consumption?.variable_costs_dkk || "",
      },
      serviceProvider:{
        name:facilityData.serviceProvider.name,
        mailAddress:facilityData.serviceProvider.mailAddress,
        phone:facilityData.serviceProvider.phone
      }
    }));
  } catch (error) {
    console.error("Error fetching facility data:", error);
    return [];
  }
};
