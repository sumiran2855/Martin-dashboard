const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export const apiRequest = async (
  endpoint: string,
  method: string,
  body?: object,
  token?: string,
  IdToken?: string
) => {
  try {
    const response = await fetch(`${apiUrl}/${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "x-id-token": `${IdToken}`,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Request failed");
    }

    return { success: true, data };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};
