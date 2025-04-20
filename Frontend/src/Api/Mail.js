import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;




export const sendEmail = async ({ recipients, subject, text }) => {
  try {
    const res = await axios.post(
      `${backendUrl}/mail/send`,
      { recipients, subject, text },
      { withCredentials: true }
    );
    return res.data;
  } catch (err) {
    if (err.response?.data?.error) {
      throw new Error(err.response.data.error);
    }
    throw new Error("Network error. Please try again.");
  }
};

 
export const fetchEmails = async () => {
  const res = await axios.get(`${backendUrl}/mail`, {
    withCredentials: true,
  });
  return res.data; // { inbox: [...], sent: [...] }
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
    } catch { /* empty */ }
  });
  es.onerror = (err) => {
    console.error("SSE /mail/stream error:", err);
  };
  return es;
};


export const setFavorite = async (mailId, favorite) => {
  const res = await axios.patch(
    `${backendUrl}/mail/${encodeURIComponent(mailId)}/favorite`,
    { favorite },
    { withCredentials: true }
  );
  return res.data;
};