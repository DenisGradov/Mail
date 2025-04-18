import { create } from 'zustand';
import { fetchEmails, subscribeNewEmails } from '../Api/Mail';

export const useMailStore = create((set, get) => ({
  mails: [],
  cursor: null,
  hasMore: true,
  loading: false,
  sse: null,

  // initial load + подключение SSE
  init: async (pageSize = 50) => {
    if (get().loading) return;
    set({ loading: true });
    try {
      const { items, nextCursor, hasMore } = await fetchEmails(pageSize, null);
      set({ mails: items, cursor: nextCursor, hasMore });
      // SSE
      const es = subscribeNewEmails((mail) => {
        set(state => ({ mails: [mail, ...state.mails] }));
      });
      set({ sse: es });
    } catch {
      // ошибки уже в fetchEmails залогированы
    } finally {
      set({ loading: false });
    }
  },

  // подгрузка следующих страниц
  loadMore: async (pageSize = 50) => {
    const { loading, hasMore, cursor } = get();
    if (loading || !hasMore) return;
    set({ loading: true });
    try {
      const { items, nextCursor, hasMore: more } = await fetchEmails(pageSize, cursor);
      set(state => ({
        mails: [...state.mails, ...items],
        cursor: nextCursor,
        hasMore: more,
      }));
    } catch {
      // ...
    } finally {
      set({ loading: false });
    }
  },

  disconnect: () => {
    const es = get().sse;
    if (es) es.close();
    set({ sse: null });
  },
}));
