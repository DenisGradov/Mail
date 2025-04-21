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



export const bulkDelete = async (ids) => {
  await axios.delete(`${backendUrl}/mail/bulk`, {
    data: { ids },
    withCredentials: true,
  });
};

export const bulkSetViewed = async (ids) => {
  await axios.patch(`${backendUrl}/mail/bulk/viewed`, { ids }, {
    withCredentials: true,
  });
};



export const setFavorite = async (mailId, favorite) => {
  const res = await axios.patch(
    `${backendUrl}/mail/${encodeURIComponent(mailId)}/favorite`,
    { favorite },
    { withCredentials: true }
  );
  return res.data;
};

export const setViewed = async (mailId, viewed) => {
  const res = await axios.patch(
    `${backendUrl}/mail/${encodeURIComponent(mailId)}/viewed`,
    { viewed },
    { withCredentials: true }
  );
  return res.data;
};
