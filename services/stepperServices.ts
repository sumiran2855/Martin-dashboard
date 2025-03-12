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

// create facility (step 2)
export const createFacility = async (
  token: string,
  IdToken: string,
  payload: any
) => {
  const existingFacility = await getFacility(token, IdToken);

  if (existingFacility?.facilityId) {
    const result = await apiRequest(
      `create-facility?id=${existingFacility?.facilityId}`,
      "POST",
      payload,
      token,
      IdToken
    );
    if (result.success) {
      return result.data;
    }
    throw new Error("Failed to create facility");
  } else {
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

// get facility
export const getFacility = async (token: string, IdToken: string) => {
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
      throw new Error("Failed to fetch facility data");
    }

    const facilityData = result.data[0];

    return {
      facilityId: facilityData.id || "",
      name: facilityData.name || "",
      userID: facilityData.userID || "",
      createdAt: facilityData.createdAt || "",
      updatedAt: facilityData.updatedAt || "",

      location: {
        address: facilityData.location?.address || "",
        postalCode: facilityData.location?.postalCode || "",
        city: facilityData.location?.city || "",
      },

      systemCost: {
        vat: facilityData.systemCost?.vat || "",
        serviceCost: facilityData.systemCost?.serviceCost || "",
        VATDeduction: facilityData.systemCost?.VATDeduction || "",
      },

      registerSystem: {
        systemName: facilityData.registerSystem?.systemName || "",
        model: facilityData.registerSystem?.model || "",
        XRGINumber: facilityData.registerSystem?.XRGINumber || "",
      },

      gasConsumption: {
        m3: facilityData.gasConsumption?.m3 || "",
        gasType: facilityData.gasConsumption?.gasType || "",
        independentDKK: facilityData.gasConsumption?.independentDKK || "",
        dependentDKK: facilityData.gasConsumption?.dependentDKK || "",
      },

      electricityConsumption: {
        kWh: facilityData.electricityConsumption?.kWh || "",
        electricityIndependentDKK:
          facilityData.electricityConsumption?.electricityIndependentDKK || "",
        electricityDependentDKK:
          facilityData.electricityConsumption?.electricityDependentDKK || "",
      },
    };
  } catch (error) {
    console.error("Error fetching facility data:", error);
    return null;
  }
};
