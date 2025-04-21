import { create } from "zustand";
import {fetchEmails, setFavorite, setViewed, subscribeNewEmails} from "../Api/Mail.js";

export const useMailStore = create((set, get) => ({
  inbox: [],    // входящие
  sent: [],
  cursor: null,
  hasMore: true,
  loading: false,
  sse: null,

  /**
   * Инициализация: загрузить первые письма + поднять SSE‑подписку
   */
  init: async () => {
    if (get().loading) return;
    set({ loading: true });
    try {
      const { inbox, sent } = await fetchEmails();
      set({ inbox, sent });
    } catch (err) {
      console.error("fetchMail error:", err);
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
  toggleFavorite: async (mailId, favorite) => {
    try {
      const updated = await setFavorite(mailId, favorite);
      set(state => ({
        inbox: state.inbox.map(m =>
          m.id === updated.id ? { ...m, favorite: updated.favorite } : m
        ),
        sent: state.sent.map(m =>
          m.id === updated.id ? { ...m, favorite: updated.favorite } : m
        ),
      }));
    } catch (err) {
      console.error("toggleFavorite error:", err);
    }
  },
  toggleViewed: async (mailId, viewed) => {
    try {
      const updated = await setViewed(mailId, viewed);
      set(state => ({
        inbox: state.inbox.map(m =>
          m.id === updated.id ? { ...m, viewed: updated.viewed } : m
        ),
        sent: state.sent.map(m =>
          m.id === updated.id ? { ...m, viewed: updated.viewed } : m
        ),
      }));
    } catch (err) {
      console.error("toggleViewed error:", err);
    }
  },

}));
