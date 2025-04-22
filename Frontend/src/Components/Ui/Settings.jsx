import { useUserStore } from "../../Store/Index.js";
import { useState, useEffect } from "react";
import EmptyAvatar from "./EmptyAvatar.jsx";
import Line from "./Line.jsx";
import InputLabel from "./InputLabel.jsx";
import Input from "./Input.jsx";
import { updateUserData } from "../../Api/UserApi.js";

function Settings() {
  const { user, setUser } = useUserStore();

  // Оригинальные данные пользователя (не изменяемые)
  const [originalForm, setOriginalForm] = useState({
    login: user.login || "",
    name: user.name || "",
    surname: user.surname || "",
  });

  // Копия формы для редактирования
  const [form, setForm] = useState({
    ...originalForm,
    oldPassword: "",
    newPassword: "",
  });

  const [errors, setErrors] = useState({
    oldPassword: "",
    newPassword: "",
    login: "",
    name: "",
    surname: "",
    general: "",
  });

  const [isSaveButtonActive, setSaveButtonActive] = useState(false);

  // Проверка, изменены ли данные в форме
  const isFormChanged = () => {
    return (
      form.login !== originalForm.login ||
      form.name !== originalForm.name ||
      form.surname !== originalForm.surname ||
      form.oldPassword ||
      form.newPassword
    );
  };

  // Обработка изменения инпутов
  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));

    // Сброс ошибки при изменении текста в инпуте
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Валидация формы
  const validateForm = () => {
    const newErrors = {};

    // Валидация для логина
    if (!form.login || form.login.length < 5) {
      newErrors.login = "Login must be at least 5 characters";
    }

    // Валидация для имени
    if (!form.name || form.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    // Валидация для фамилии
    if (!form.surname || form.surname.length < 2) {
      newErrors.surname = "Surname must be at least 2 characters";
    }

    // Валидация для старого пароля
    if (form.newPassword && !form.oldPassword) {
      newErrors.oldPassword = "Old password is required when updating a new password";
    }

    // Валидация для нового пароля
    if (form.newPassword && form.newPassword.length < 5) {
      newErrors.newPassword = "New password must be at least 5 characters";
    }

    return newErrors;
  };




  // Отправка данных на сервер
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await updateUserData(form);

      // Если success: true, обновляем данные пользователя
      if (response?.success) {
        // Обновление данных пользователя в сторе, если обновление прошло успешно
        setUser({
          login: form.login,
          name: form.name,
          surname: form.surname,
        });

        // Обновляем оригинальные данные на измененные
        setOriginalForm({
          login: form.login,
          name: form.name,
          surname: form.surname,
        });

        // Сбрасываем форму
        setForm({
          oldPassword: "",
          newPassword: "",
          login: form.login,
          name: form.name,
          surname: form.surname,
        });

        // Деактивируем кнопку "Save"
        setSaveButtonActive(false);
        setErrors({
          oldPassword: "",
          newPassword: "",
          login: "",
          name: "",
          surname: "",
          general: ""})
        alert("Your profile has been updated successfully.");
      } else {
        // Если сервер вернул success: false, показываем ошибку
        setErrors((prev) => ({
          ...prev,
          general: response.message || "An error occurred. Please try again later.",
        }));
      }
    } catch (err) {
      console.error("Error updating user:", err);

      // Если ошибка не была от сервера, то отображаем ошибку сети
      setErrors((prev) => ({
        ...prev,
        general: err?.error || "Network error occurred. Please try again later.",
      }));
    }
  };

  // Следим за изменениями формы, чтобы активировать/деактивировать кнопку "Сохранить"
  useEffect(() => {
    setSaveButtonActive(isFormChanged());
  }, [form]);

  return (
    <div className="w-full h-full p-[5px] max-w-[1100px] m-auto mt-[50px] overflow-auto max-h-[100wh]">
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <span className="text-text-primary text-[18px]">Account</span>
          <span className="text-text-secondary-60 text-[16px]">The section where you can manage the main parameters of your profile</span>
        </div>

        <button
          disabled={!isSaveButtonActive}
          onClick={handleSubmit}
          className={`p-[12px] px-[40px] ${isSaveButtonActive ? "bg-primary hover-anim" : "bg-container"} rounded-[10px] text-[#fff]`}
        >
          Save
        </button>
      </div>
      <Line className="my-[32px]" />

      <div className="flex items-center">
        <div>
          {user.photo ? <img src={user.photo} alt="userPhoto" /> :
            <EmptyAvatar className="flex items-center justify-center w-[40px] h-[40px]" name={user.name} />}
        </div>
        {user.photo ? (
          <div className="flex ml-[10px] text-text-primary text-[18px]">Profile photo</div>
        ) : (
          <div className="flex flex-col ml-[5px]">
            <div className="text-text-primary text-[18px]">Profile photo</div>
            <div className="text-text-secondary text-[15px]">No</div>
          </div>
        )}
      </div>

      {/* Account Details */}
      <div className="mt-[32px]">
        <div className="flex flex-col">
          <span className="text-text-primary text-[18px]">Account details</span>
          <span className="text-[16px] text-text-secondary-60">They are displayed in letters and used for sending instead of an address.</span>
        </div>
        <div className="mt-[32px] flex justify-start max-w-[800px]">
          <div className="w-full mr-[20px]">
            <InputLabel text="Name" />
            <Input
              className="w-full"
              name="name"
              type="text"
              placeholder={user.name}
              value={form.name}
              setValue={handleChange}
            />
            {errors.name && <p className="text-red-500 mt-1">{errors.name}</p>}
          </div>
          <div className="ml-[20px] w-full">
            <InputLabel text="Surname" />
            <Input
              name="surname"
              className="w-full"
              type="text"
              placeholder={user.surname}
              value={form.surname}
              setValue={handleChange}
            />
            {errors.surname && <p className="text-red-500 mt-1">{errors.surname}</p>}
          </div>
        </div>
      </div>

      <Line className="my-[32px]" />

      {/* Login */}
      <div className="">
        <div className="flex flex-col">
          <span className="text-text-primary text-[18px]">Login</span>
          <span className="text-[16px] text-text-secondary-60">Displayed in the profile and used for login.</span>
        </div>
        <div className="mt-[32px] flex justify-start max-w-[400px]">
          <div className="w-full mr-[20px]">
            <InputLabel text="Login" />
            <Input
              className="w-full"
              name="login"
              type="text"
              placeholder={user.login}
              value={form.login}
              setValue={handleChange}
            />
            {errors.login && <p className="text-red-500 mt-1">{errors.login}</p>}
          </div>
        </div>
      </div>

      {/* Password */}
      <div className="mt-[32px]">
        <div className="flex flex-col">
          <span className="text-text-primary text-[18px]">Password</span>
          <span className="text-[16px] text-text-secondary-60">Change your password to update your account login information.</span>
        </div>
        <div className="mt-[32px] flex justify-start max-w-[800px]">
          <div className="w-full mr-[20px]">
            <InputLabel text="Old Password" />
            <Input
              className="w-full"
              name="oldPassword"
              type="password"
              placeholder="old password"
              value={form.oldPassword}
              setValue={handleChange}
            />
            {errors.oldPassword && <p className="text-red-500 mt-1">{errors.oldPassword}</p>}
          </div>
          <div className="ml-[20px] w-full">
            <InputLabel text="New Password" />
            <Input
              name="newPassword"
              className="w-full"
              type="password"
              placeholder="new password"
              value={form.newPassword}
              setValue={handleChange}
            />
            {errors.newPassword && <p className="text-red-500 mt-1">{errors.newPassword}</p>}
          </div>
        </div>
      </div>

      {/* Общие ошибки (например, проблемы с сетью) */}
      {errors.general && (
        <div className="text-center text-red-500 mt-[20px]">{errors.general}</div>
      )}
    </div>
  );
}

export default Settings;
