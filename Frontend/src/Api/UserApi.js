import axios from 'axios';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const updateUserData = async (userDetails) => {
  try {
    const response = await axios.post(
      `${backendUrl}/users/update`,
      userDetails,
      { withCredentials: true }
    );

    if (response.status === 200) {
      return response.data;
    }

    if (response.status === 400) {
      return response.data;
    }

    throw new Error('Unexpected error occurred.');
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

    if (response.status === 200) {
      return response.data;
    }
    return { error: "Failed to upload avatar" };
  } catch (error) {
    console.error("Error uploading avatar:", error.response?.data || error.message);
    return { error: "Network error occurred. Please try again later." };
  }
};