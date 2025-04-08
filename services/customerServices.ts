import { CUSTOMER_API_ROUTES } from "@/routes/customerRoutes";
import { apiRequest } from "@/utils/authHelper";

// create profile (step 1)
export const createProfile = async (
  token: string,
  IdToken: string,
  payload: any
) => {
  const result = await apiRequest(
    CUSTOMER_API_ROUTES.CREATE_PROFILE,
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

// create addFeature
export const addFeature = async (
  token: string,
  IdToken: string,
  payload: any
) => {
  const result = await apiRequest(
    CUSTOMER_API_ROUTES.ADD_FEATURE,
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
      CUSTOMER_API_ROUTES.GET_CUSTOMER,
      "GET",
      undefined,
      token,
      IdToken
    );
    if (!result || !result.success || !result.data) {
      console.log("Failed to fetch customer data");
    }
    const { companyInfo, contactPerson, email, phone_number, name } =
      result.data;
    return {
      companyName: companyInfo?.name || "",
      cvrNumber: companyInfo?.cvrNumber || "",
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
      status: companyInfo?.status || "Active",
      name: name || "",
      email_verified: result.data.email_verified || false,
    };
  } catch (error) {
    console.error("Error fetching customer data:", error);
    return null;
  }
};

// get customer by ID
export const getCustomerById = async (
  token: string,
  IdToken: string,
  userId: string
) => {
  try {
    const result = await apiRequest(
      `${CUSTOMER_API_ROUTES.GET_CUSTOMER_BY_ID}?id=${userId}`,
      "GET",
      undefined,
      token,
      IdToken
    );
    if (!result || !result.success || !result.data) {
      console.log("Failed to fetch customer data");
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
      status: companyInfo?.status || "Active",
      name: name || "",
      email_verified: result.data.email_verified || false,
    };
  } catch (error) {
    console.error("Error fetching customer data:", error);
    return null;
  }
};

// get all customer
export const getAllCustomers = async (token: string, IdToken: string) => {
  try {
    const result = await apiRequest(
      CUSTOMER_API_ROUTES.GET_ALL_CUSTOMERS,
      "GET",
      undefined,
      token,
      IdToken
    );

    if (!result || !result.success || !Array.isArray(result.data)) {
      console.log("Failed to fetch customer data");
    }

    return result.data.map((customer:any) => {
      const { companyInfo, contactPerson, email, phone_number, name } =
        customer;
      return {
        id: customer.id || "",
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
        status: customer.email_verified ? "Active" : "Inactive",
        name: name || "",
        email_verified: customer.email_verified || false,
      };
    });
  } catch (error) {
    console.error("Error fetching customer data:", error);
    return [];
  }
};

// send query 
export const sendQuery = async (
  subject: string,
  message: string,
  token?: string,
  IdToken?: string
) => {
  const payload = { subject, body: message };

  const result = await apiRequest("/send-queries", "POST", payload, token, IdToken);

  if (result.success) {
    return result.data;
  }

  throw new Error("Failed to send query");
};
