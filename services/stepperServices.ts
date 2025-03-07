import { apiRequest } from "@/utils/apiClient";

export const createProfile = async (token: string, IdToken: string, payload: any) => {
    const result = await apiRequest("create-profile", "POST", payload, token, IdToken);
  
    if (result.success) {
      return result.data;
    }
  
    throw new Error("Failed to create profile");
  };
  
export const createFacility = async (token: string, IdToken: string, payload: any) => {
  const result = await apiRequest("create-facility", "POST", payload, token, IdToken);
  
    if (result.success) {
      return result.data;
    }
  
    throw new Error("Failed to create facility");
}

export const getCustomer = async (token: string, IdToken: string) => { 
  try {
    const result = await apiRequest("get-customer", "GET", undefined, token, IdToken);
    
    if (!result || !result.success || !result.data) {
      throw new Error("Failed to fetch customer data");
    }

    const { companyInfo, contactPerson, email, phone_number, name } = result.data;

    return {
      companyName: companyInfo?.name || "",
      cvrNumber: companyInfo?.cvr_number || "",
      address: companyInfo?.address || "",
      postCode: companyInfo?.postal_code || "",
      city: companyInfo?.city || "",
      email: companyInfo?.email || email || "",
      countryCode: phone_number?.slice(0, 3) || "", 
      phone: companyInfo?.phone || contactPerson?.phone || phone_number || "",
      contactPerson: {
        firstName: contactPerson?.firstName || "",
        lastName: contactPerson?.lastName || "",
        phone: contactPerson?.phone || "",
        email: contactPerson?.email || "",
      },
      name: name || "",
      email_verified: result.data.email_verified || false,
    };

  } catch (error) {
    console.error("Error fetching customer data:", error);
    return null;
  }
};