import { create } from "zustand";
import { fetchEmails, subscribeNewEmails } from "../Api/Mail.js";

export const useMailStore = create((set, get) => ({
  mails: [],
  cursor: null,
  hasMore: true,
  loading: false,
  sse: null,

  /**
   * Инициализация: загрузить первые письма + поднять SSE‑подписку
   */
  init: async (pageSize = 50) => {
    if (get().loading) return;
    set({ loading: true });
    try {
      const { items, nextCursor, hasMore } = await fetchEmails(
        pageSize,
        null
      );
      set({ mails: items, cursor: nextCursor, hasMore });

      // SSE: при каждом новом письме — добавляем в начало массива
      const es = subscribeNewEmails((newMail) => {
        set((state) => ({
          mails: [newMail, ...state.mails],
        }));
      });
      set({ sse: es });
    } catch (err) {
      console.error("fetchEmails error:", err);
    } finally {
      set({ loading: false });
    }
  },

  /**
   * Догрузить старые письма (infinite scroll)
   */
  loadMore: async (pageSize = 50) => {
    const { loading, hasMore, cursor } = get();
    if (loading || !hasMore) return;
    set({ loading: true });
    try {
      const { items, nextCursor, hasMore: more } = await fetchEmails(
        pageSize,
        cursor
      );
      set((state) => ({
        mails: [...state.mails, ...items],
        cursor: nextCursor,
        hasMore: more,
      }));
    } catch (err) {
      console.error("loadMore fetchEmails error:", err);
    } finally {
      set({ loading: false });
    }
  },

  /**
   * Отключить SSE (например, при logout)
   */
  disconnect: () => {
    const es = get().sse;
    if (es) es.close();
    set({ sse: null });
  },
}));
