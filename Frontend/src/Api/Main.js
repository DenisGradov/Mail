import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const checkDomains = async (domains) => {
  try {
    const response = await axios.post(
      `${backendUrl}/main/check-domains`,
      { domains },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
        timeout: 10000,
      }
    );
    return response.data;
  } catch (err) {
    if (err.response?.data?.error) {
      throw new Error(err.response.data.error);
    }
    throw new Error("Network error. Please try again.");
  }
};

export const addDomain = async (domain) => {
  try {
    const response = await axios.post(
      `${backendUrl}/main/add-domain`,
      { domain },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
        timeout: 5000,
      }
    );
    return response.data;
  } catch (err) {
    if (err.response?.data?.error) {
      throw new Error(err.response.data.error);
    }
    throw new Error("Network error. Please try again.");
  }
};

export const deleteDomain = async (domain) => {
  try {
    const response = await axios.post(
      `${backendUrl}/main/delete-domain`,
      { domain },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
        timeout: 5000,
      }
    );
    return response.data;
  } catch (err) {
    if (err.response?.data?.error) {
      throw new Error(err.response.data.error);
    }
    throw new Error("Network error. Please try again.");
  }
};

export const getDomains = async () => {
  try {
    const response = await axios.get(
      `${backendUrl}/main/domains`,
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
        timeout: 5000,
      }
    );
    return response.data;
  } catch (err) {
    if (err.response?.data?.error) {
      throw new Error(err.response.data.error);
    }
    throw new Error("Network error. Please try again.");
  }
};