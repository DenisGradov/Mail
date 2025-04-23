import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  verifyToken,
  loginUser as apiLoginUser,
  logoutUser as apiLogoutUser,
} from "../Api/Auth.js";
import { updateAvatar } from "../Api/UserApi.js";

// Функция для проверки доступности изображения
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
      user: {},
      setUser: (userData) => {
        set({ user: { ...userData } });
      },

      updateUserAvatar: async (formData) => {
        try {
          const response = await updateAvatar(formData);
          if (response?.success && response.avatar) {
            const avatarUrl = response.avatar
            const isAccessible = await isImageAccessible(avatarUrl);
            if (isAccessible) {
              set((state) => ({
                user: { ...state.user, avatar: avatarUrl },
              }));
              return { ...response, avatar: avatarUrl };
            } else {
              console.error("URL аватарки недоступен:", avatarUrl);
              return { error: "Загруженное изображение недоступно." };
            }
          }
          console.error("Ошибка в ответе API:", response?.error || "Нет данных об аватарке");
          return response || { error: "Не удалось загрузить аватарку." };
        } catch (err) {
          console.error("Ошибка при обновлении аватарки в сторе:", err);
          return { error: err.message || "Ошибка сети. Попробуйте еще раз." };
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
              },
            });
          } else {
            set({ auth: { isAuthenticated: false }, accounts: [] });
          }
        } catch {
          set({ auth: { isAuthenticated: false }, accounts: [] });
        }
      },

      updateAccounts: (newAccounts) => {
        set({ accounts: newAccounts });
      },

      changeTheme: () => {
        const currentTheme = get().theme;
        set({ theme: currentTheme === "theme-black" ? "theme-white" : "theme-black" });
      },

      loginUser: async (username, password, remember = false, captcha) => {
        const response = await apiLoginUser(username, password, remember, captcha);
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
            },
          });
        } else {
          set({
            auth: { isAuthenticated: false },
            user: {},
          });
        }
        return response;
      },

      logoutUser: async () => {
        const response = await apiLogoutUser();
        if (response && response.status === 200) {
          set({
            auth: { isAuthenticated: false },
            user: {},
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