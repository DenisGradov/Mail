import axios from 'axios';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const verifyToken = async () => {
  try {
    return await axios.get(`${backendUrl}/auth/verify-token`, {
      withCredentials: true,
    });
  } catch (error) {
    console.error("Token verification failed:", error.response?.data || error.message);
    return null;
  }
};


export const loginUser = async (username, password, remember = false, captcha) => {
  try {
    return await axios.post(
      `${backendUrl}/auth/login`,
      { username, password, remember, captcha },
      { withCredentials: true }
    );
  } catch (error) {
    console.error("Login failed:", error.response?.data || error.message);
    return error;
  }
};

export const registerUser = async ({ name, surname, login, password, offer, captcha }) => {
  try {
    return await axios.post(
      `${backendUrl}/auth/register`,
      { name, surname, login, password, offer, captcha },
      { withCredentials: true }
    );
  } catch (error) {
    console.error("Registration failed:", error.response?.data || error.message);
    return error;
  }
};


export const logoutUser = async () => {
  try {
    return await axios.post(
      `${backendUrl}/auth/logout`,
      {},
      { withCredentials: true }
    );
  } catch (error) {
    console.error('Logout failed:', error.response?.data || error.message);
    return null;
  }
};


export const changePassword = async (oldPassword, newPassword) => {
  try {
    return await axios.post(
      `${backendUrl}/users/change-password`,
      { oldPassword, newPassword },
      { withCredentials: true }
    );
  } catch (error) {
    console.error(
      'Password change failed:',
      error.response?.data || error.message
    );
    throw error;
  }
};

export const changeLogin = async (oldLogin, newLogin, actualPassword) => {
  try {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    return await axios.post(
      `${backendUrl}/users/change-login`,
      { oldLogin, newLogin, actualPassword },
      { withCredentials: true }
    );
  } catch (error) {
    console.error(
      'Change login failed:',
      error.response?.data || error.message
    );
    throw error;
  }
};
