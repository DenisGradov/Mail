import axios from 'axios';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const updateUserData = async (userDetails) => {
  try {
    const response = await axios.post(
      `${backendUrl}/users/update`,
      userDetails,
      { withCredentials: true }
    );

    // Если код ответа 200, то данные успешно обновлены
    if (response.status === 200) {
      return response.data; // Возвращаем успешный ответ
    }

    // Если код 400, возвращаем ошибку с сервера (например, неверный старый пароль)
    if (response.status === 400) {
      return response.data;  // Сервер возвращает причину ошибки (например, старый пароль неверный)
    }

    // Для других кодов ошибок выбрасываем исключение
    throw new Error('Unexpected error occurred.');
  } catch (error) {
    // Обработка ошибок: если ошибка от сервера, возвращаем её
    console.error("Error updating user details:", error.response?.data || error.message);

    // Если сервер вернул ошибку
    if (error.response?.data) {
      return error.response.data;  // Возвращаем ошибку, если она есть от сервера
    }

    // В случае сетевой ошибки или других ошибок
    return { error: "Network error occurred. Please try again later." };
  }
};
