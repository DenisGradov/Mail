import axios from 'axios';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const updateUserData = async (userDetails) => {
  try {
    const response = await axios.post(
      `${backendUrl}/users/update`,
      userDetails,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating user details:", error.response?.data || error.message);
    if (error.response?.data) {
      return error.response.data;
    }
    return { error: "Network error occurred. Please try again later." };
  }
};

export const updateAvatar = async (formData) => {
  try {
    const response = await axios.post(
      `${backendUrl}/users/upload-avatar`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error uploading avatar:", error.response?.data || error.message);
    throw error.response?.data || { error: "Network error occurred. Please try again later." };
  }
};

export const getUsers = async (limit, page, search) => {
  try {
    const response = await axios.get(
      `${backendUrl}/users/users`,
      {
        params: { limit, page, search },
        withCredentials: true
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error.response?.data || error.message);
    throw error.response?.data || { error: "Network error occurred. Please try again later." };
  }
};

export const addUser = async (userData) => {
  try {
    const response = await axios.post(
      `${backendUrl}/users/add`,
      userData,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding user:", error.response?.data || error.message);
    throw error.response?.data || { error: "Network error occurred. Please try again later." };
  }
};

export const deleteUsers = async (userIds) => {
  try {
    const response = await axios.post(
      `${backendUrl}/users/delete`,
      { userIds },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting users:", error.response?.data || error.message);
    throw error.response?.data || { error: "Network error occurred. Please try again later." };
  }
};

export const updateUserStatus = async (userIds, status) => {
  try {
    const response = await axios.post(
      `${backendUrl}/users/update-status`,
      { userIds, status },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating user status:", error.response?.data || error.message);
    throw error.response?.data || { error: "Network error occurred. Please try again later." };
  }
};

export const getUserStats = async () => {
  try {
    const response = await axios.get(`${backendUrl}/users/stats`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user stats:", error.response?.data || error.message);
    throw error.response?.data || { error: "Network error occurred. Please try again later." };
  }
};