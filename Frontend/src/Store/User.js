import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  verifyToken,
  loginUser as apiLoginUser,
  logoutUser as apiLogoutUser,
} from "../Api/Auth.js";

export const useUserStore = create(
  persist(
    (set, get) => ({
      auth: { isAuthenticated: false },
      theme: "theme-black",
      accounts: [],
      user: {},

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
        set({ theme: currentTheme==="theme-black"?"theme-white":"theme-black" });
      },

      loginUser: async (username, password, remember = false) => {
        const response = await apiLoginUser(username, password, remember);
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
      name: "user-storage", // 🔒 ключ в localStorage
      partialize: (state) => ({
        auth: state.auth,
        theme: state.theme,
        accounts: state.accounts,
        user: state.user,
      }),
    }
  )
);
