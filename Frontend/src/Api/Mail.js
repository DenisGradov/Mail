import axios from 'axios';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

/**
 * Вытащить пачку писем (cursor‑based pagination).
 * @param {number} limit
 * @param {string|null} cursor
 * @returns {Promise<{ items: Array, nextCursor: string|null, hasMore: boolean }>}
 */
export const fetchEmails = async (limit = 50, cursor = null) => {
  try {
    const params = { limit };
    if (cursor) params.cursor = cursor;
    const res = await axios.get(`${backendUrl}/mail`, {
      params,
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    console.error('fetchEmails error:', err.response?.data || err.message);
    throw err;
  }
};

/**
 * Подписаться на SSE‑поток новых писем.
 * @param {(mail: object) => void} onEmail
 * @returns {EventSource}
 */
export const subscribeNewEmails = (onEmail) => {
  const es = new EventSource(`${backendUrl}/mail/stream`, { withCredentials: true });
  es.addEventListener('email', e => {
    try {
      const mail = JSON.parse(e.data);
      onEmail(mail);
    } catch (err) {
      console.error('SSE parse error:', err);
    }
  });
  es.onerror = (err) => {
    console.error('SSE error:', err);
  };
  return es;
};
