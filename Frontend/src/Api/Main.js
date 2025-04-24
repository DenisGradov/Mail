import axios from "axios";

export const checkValid = async (link) => {
  try {
    const response = await axios.get(`${link}/health`, {
      timeout: 5000, // 5 second timeout
      validateStatus: (status) => status < 500, // Accept any status below 500
    });
    return response;
  } catch (error) {
    throw error;
  }
};