import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

/**
 * Пакетная загрузка писем
 * @param {number} limit — сколько взять
 * @param {string|null} cursor — id последнего письма, откуда продолжить
 * @returns {Promise<{ items: Mail[], nextCursor: string|null, hasMore: boolean }>}
 */
export const fetchEmails = async (limit = 50, cursor = null) => {
  const params = { limit };
  if (cursor) params.cursor = cursor;
  const res = await axios.get(`${backendUrl}/mail`, {
    params,
    withCredentials: true,
  });
  return res.data;
};

/**
 * Подписка на новые письма через SSE
 * @param {(mail: Mail) => void} onEmail — колбэк по новому mail
 * @returns {EventSource}
 */
export const subscribeNewEmails = (onEmail) => {
  const es = new EventSource(`${backendUrl}/mail/stream`, {
    withCredentials: true,
  });
  es.addEventListener("email", (e) => {
    try {
      const mail = JSON.parse(e.data);
      onEmail(mail);
    } catch {}
  });
  es.onerror = (err) => {
    console.error("SSE /mail/stream error:", err);
  };
  return es;
};
