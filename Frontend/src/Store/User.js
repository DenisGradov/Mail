import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  verifyToken,
  loginUser as apiLoginUser,
  logoutUser as apiLogoutUser,
} from "../Api/Auth.js";
import { updateAvatar } from "../Api/UserApi.js";

const isImageAccessible = async (url) => {
  try {
    const response = await fetch(url, { method: "HEAD" });
    return response.ok;
  } catch {
    return false;
  }
};

export const useUserStore = create(
  persist(
    (set, get) => ({
      auth: { isAuthenticated: false },
      theme: "theme-black",
      accounts: [],
      user: { errors: {} },
      setUser: (userData) => {
        set({ user: { ...userData, errors: {} } });
      },

      updateUserAvatar: async (formData) => {
        try {
          const response = await updateAvatar(formData);
          if (response?.success && response.avatar) {
            const avatarUrl = response.avatar;
            const isAccessible = await isImageAccessible(avatarUrl);
            if (isAccessible) {
              set((state) => ({
                user: { ...state.user, avatar: avatarUrl, errors: {} },
              }));
              return { ...response, avatar: avatarUrl };
            } else {
              console.error("Avatar URL is not accessible:", avatarUrl);
              return { error: "Uploaded image is not accessible." };
            }
          }
          console.error("API response error:", response?.error || "No avatar data");
          return response || { error: "Failed to upload avatar." };
        } catch (err) {
          console.error("Error updating avatar in store:", err);
          return { error: err.message || "Network error. Please try again." };
        }
      },

      checkAuth: async () => {
        try {
          const response = await verifyToken();
          if (response && response.status === 200) {
            set({
              auth: { isAuthenticated: true },
              accounts: response.data.accounts || [],
              user: {
                id: response.data.userId,
                login: response.data.login,
                email: response.data.email,
                name: response.data.name || '',
                surname: response.data.surname || '',
                avatar: response.data.avatar || 'none',
                status: response.data.status || 0,
                two_factor_enabled: response.data.two_factor_enabled || 0,
                errors: {},
              },
            });
          } else {
            set({ auth: { isAuthenticated: false }, accounts: [], user: { errors: {} } });
          }
        } catch {
          set({ auth: { isAuthenticated: false }, accounts: [], user: { errors: {} } });
        }
      },

      updateAccounts: (newAccounts) => {
        set({ accounts: newAccounts });
      },

      changeTheme: () => {
        const currentTheme = get().theme;
        set({ theme: currentTheme === "theme-black" ? "theme-white" : "theme-black" });
      },

      loginUser: async (username, password, remember = false, captcha, totp_code) => {
        try {
          const response = await apiLoginUser(username, password, remember, captcha, totp_code);
          if (response && response.status === 200) {
            set({
              auth: { isAuthenticated: true },
              user: {
                id: response.data.userId,
                login: response.data.login,
                email: response.data.email,
                name: response.data.name || '',
                surname: response.data.surname || '',
                status: response.data.status || 0,
                avatar: response.data.avatar || 'none',
                two_factor_enabled: response.data.two_factor_enabled || 0,
                errors: {},
              },
            });
          } else if (response && response.status === 206 && response.data.two_factor_required) {
            set({
              auth: { isAuthenticated: false },
              user: {
                id: response.data.userId,
                login: username,
                password,
                remember,
                captcha,
                two_factor_required: true,
                two_factor_enabled: 1,
                errors: {},
              },
            });
          } else {
            const errors = response?.response?.data?.errors || response?.response?.data || {};
            set({
              auth: { isAuthenticated: false },
              user: {
                errors: {
                  login: errors.login || '',
                  password: errors.password || '',
                  captcha: errors.captcha || '',
                  totp_code: errors.totp_code || '',
                  general: errors.general || '',
                },
              },
            });
          }
          return response;
        } catch (err) {
          const errors = err.response?.data?.errors || err.response?.data || {};
          set({
            auth: { isAuthenticated: false },
            user: {
              errors: {
                login: errors.login || '',
                password: errors.password || '',
                captcha: errors.captcha || '',
                totp_code: errors.totp_code || '',
                general: errors.general || err.message || 'Network error occurred',
              },
            },
          });
          throw err; // Возвращаем ошибку для обработки в компонентах
        }
      },

      logoutUser: async () => {
        try {
          const response = await apiLogoutUser();
          if (response && response.status === 200) {
            set({
              auth: { isAuthenticated: false },
              user: { errors: {} },
              accounts: [],
            });
          }
        } catch {
          set({
            auth: { isAuthenticated: false },
            user: { errors: {} },
            accounts: [],
          });
        }
      },
    }),
    {
      name: "user-storage",
      partialize: (state) => ({
        auth: state.auth,
        theme: state.theme,
        accounts: state.accounts,
        user: state.user,
      }),
    }
  )
);