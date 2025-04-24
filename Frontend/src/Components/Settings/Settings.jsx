import { useUserStore } from "../../Store/Index.js";
import { useState, useEffect } from "react";
import EmptyAvatar from "../Ui/EmptyAvatar.jsx";
import Line from "../Ui/Line.jsx";
import InputLabel from "../Ui/InputLabel.jsx";
import Input from "../Ui/Input.jsx";
import { updateUserData } from "../../Api/UserApi.js";
import Authentication from "../Auth/Authentication.jsx";
import { setup2FA, disable2FA } from "../../Api/Auth.js";

function Settings() {
  const { user, setUser, updateUserAvatar } = useUserStore();

  const [originalForm, setOriginalForm] = useState({
    login: user.login || "",
    name: user.name || "",
    surname: user.surname || "",
  });

  const [form, setForm] = useState({
    ...originalForm,
    oldPassword: "",
    newPassword: "",
  });

  // Инициализация avatarPreview только если user.avatar является валидным base64
  const [avatarPreview, setAvatarPreview] = useState(() => {
    if (user.avatar && typeof user.avatar === "string" && user.avatar.startsWith("data:image/")) {
      return user.avatar;
    }
    return "";
  });

  const [errors, setErrors] = useState({
    oldPassword: "",
    newPassword: "",
    login: "",
    name: "",
    surname: "",
    general: "",
    avatar: "",
  });

  const [isSaveButtonActive, setSaveButtonActive] = useState(false);
  const [addFA, setAddFA] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [secret, setSecret] = useState("");



  const isFormChanged = () => {
    return (
      form.login !== originalForm.login ||
      form.name !== originalForm.name ||
      form.surname !== originalForm.surname ||
      form.oldPassword ||
      form.newPassword
    );
  };

  const handleAddFa = async () => {
    if (user.two_factor_enabled) {
      try {
        const response = await disable2FA();
        if (response.data.success) {
          setUser({ ...user, two_factor_enabled: 0 });
          setQrCode("");
          setSecret("");
          setAddFA(false);
        } else {
          setErrors((prev) => ({ ...prev, general: response.data.error || "Failed to disable 2FA" }));
        }
      } catch (err) {
        setErrors((prev) => ({ ...prev, general: err.message || "Network error occurred" }));
      }
    } else {
      try {
        const response = await setup2FA();
        if (response.data.qrCode && response.data.secret) {
          setQrCode(response.data.qrCode);
          setSecret(response.data.secret);
          setAddFA(true);
        } else {
          setErrors((prev) => ({ ...prev, general: response.data.error || "Failed to setup 2FA" }));
        }
      } catch (err) {
        setErrors((prev) => ({ ...prev, general: err.message || "Network error occurred" }));
      }
    }
  };

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    const maxSize = 10 * 1024 * 1024;

    if (!file) {
      setErrors((prev) => ({ ...prev, avatar: "No file selected." }));
      setAvatarPreview(user.avatar && user.avatar.startsWith("data:image/") ? user.avatar : "");
      return;
    }

    if (!validTypes.includes(file.type)) {
      setErrors((prev) => ({ ...prev, avatar: "Invalid file type. Only JPEG, PNG, and GIF are allowed." }));
      setAvatarPreview(user.avatar && user.avatar.startsWith("data:image/") ? user.avatar : "");
      return;
    }

    if (file.size > maxSize) {
      setErrors((prev) => ({ ...prev, avatar: "File size exceeds 10MB." }));
      setAvatarPreview(user.avatar && user.avatar.startsWith("data:image/") ? user.avatar : "");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const response = await updateUserAvatar(formData);
      if (response?.success && response.avatar) {
        setErrors((prev) => ({ ...prev, avatar: "" }));
        // Синхронизация avatarPreview с user.avatar
        setAvatarPreview(response.avatar);
      } else {
        setAvatarPreview(user.avatar && user.avatar.startsWith("data:image/") ? user.avatar : "");
        setErrors((prev) => ({ ...prev, avatar: response?.error || "Failed to upload avatar." }));
      }
    } catch (err) {
      setAvatarPreview(user.avatar && user.avatar.startsWith("data:image/") ? user.avatar : "");
      setErrors((prev) => ({ ...prev, avatar: err.message || "Network error occurred. Please try again." }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await updateUserData(form);

      if (response?.success) {
        setUser({
          ...user,
          login: form.login,
          name: form.name,
          surname: form.surname,
        });

        setOriginalForm({
          login: form.login,
          name: form.name,
          surname: form.surname,
        });

        setForm({
          ...form,
          oldPassword: "",
          newPassword: "",
        });

        setSaveButtonActive(false);
        setErrors({
          oldPassword: "",
          newPassword: "",
          login: "",
          name: "",
          surname: "",
          general: "",
          avatar: "",
        });
        alert("Your profile has been updated successfully.");
      } else {
        setErrors((prev) => ({ ...prev, general: response.message || "An error occurred. Please try again." }));
      }
    } catch (err) {
      setErrors((prev) => ({ ...prev, general: err.message || "Network error occurred. Please try again." }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.login || form.login.length < 5) {
      newErrors.login = "Login must be at least 5 characters";
    }

    if (!form.name || form.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!form.surname || form.surname.length < 2) {
      newErrors.surname = "Surname must be at least 2 characters";
    }

    if (form.newPassword && !form.oldPassword) {
      newErrors.oldPassword = "Old password is required when updating a new password";
    }

    if (form.newPassword && form.newPassword.length < 5) {
      newErrors.newPassword = "New password must be at least 5 characters";
    }

    return newErrors;
  };

  useEffect(() => {
    setSaveButtonActive(isFormChanged());
  }, [form]);

  // Очистка blob URL только при размонтировании компонента
  useEffect(() => {
    return () => {
      if (avatarPreview && avatarPreview.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, []);

  // Синхронизация avatarPreview с user.avatar при изменении user.avatar
  useEffect(() => {
    if (user.avatar && user.avatar.startsWith("data:image/")) {
      setAvatarPreview(user.avatar);
    } else {
      setAvatarPreview("");
    }
  }, [user.avatar]);

  // Проверка валидности изображения
  const isValidImage = (src) => {
    return src && typeof src === "string" && (src.startsWith("data:image/") || src.startsWith("blob:"));
  };

  return (
    <div className="w-full h-full p-[15px] m-auto">

      <div className="flex items-center">
        <div>
          {isValidImage(avatarPreview) ? (
            <img src={avatarPreview} alt="User Avatar" className="w-[40px] h-[40px] rounded-full" />
          ) : (
            <EmptyAvatar className="flex items-center justify-center w-[40px] h-[40px]" name={form.name} />
          )}
        </div>
        <div className="flex ml-[10px] text-text-primary text-[18px]">Profile photo</div>
      </div>

      <div className="mt-[16px]">
        <div className="flex flex-col">
          <span className="text-text-primary text-[18px]">Upload avatar</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/gif"
            onChange={handleAvatarChange}
          />
          {errors.avatar && <p className="text-red-500 mt-1">{errors.avatar}</p>}
        </div>
      </div>

      <Line className="my-[32px]" />

      <div className="flex items-center flex-wrap justify-center 840px:text-left text-center 840px:justify-between">
        <div className="flex flex-col">
          <span className="text-text-primary text-[18px]">
            Account - <span className="text-primary text-[16px]">{user.email}</span>
          </span>
          <span className="text-text-secondary-60 text-[16px]">
            The section where you can manage the main parameters of your profile
          </span>
        </div>

        <button
          disabled={!isSaveButtonActive}
          onClick={handleSubmit}
          className={`p-[12px] px-[40px] ${
            isSaveButtonActive ? "bg-primary hover-anim" : "bg-container"
          } rounded-[10px] text-[#fff]`}
        >
          Save
        </button>
      </div>
      <Line className="my-[32px]" />

      <div className="mt-[32px]">
        <div className="flex flex-col">
          <span className="text-text-primary text-[18px]">Account details</span>
          <span className="text-[16px] text-text-secondary-60">
            They are displayed in letters and used for sending instead of an address.
          </span>
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

      <div className="mt-[32px]">
        <div className="flex flex-col">
          <span className="text-text-primary text-[18px]">Login</span>
          <span className="text-[16px] text-text-secondary-60">
            Displayed in the profile and used for login.
          </span>
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

      <div className="mt-[32px]">
        <div className="flex flex-col">
          <span className="text-text-primary text-[18px]">Password</span>
          <span className="text-[16px] text-text-secondary-60">
            Change your password to update your account login information.
          </span>
        </div>
        <div className="mt-[32px] flex justify-start max-w-[800px]">
          <div className="w-full mr-[20px]">
            <InputLabel text="Old Password" />
            <Input
              className="w-full"
              name="oldPassword"
              type="password"
              placeholder="Old password"
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
              placeholder="New password"
              value={form.newPassword}
              setValue={handleChange}
            />
            {errors.newPassword && <p className="text-red-500 mt-1">{errors.newPassword}</p>}
          </div>
        </div>
      </div>
      {errors.general && (
        <div className="text-center text-red-500 mt-[20px]">{errors.general}</div>
      )}
      <Line className="my-[32px]" />
      <div className="flex 375px:flex-row flex-col 375px:justify-between items-center bg-container p-[30px] rounded-[20px]">
        <div className="flex items-center 375px:flex-row flex-col">
          <img src="googl.svg" className="w-[50px]" alt="Google Authenticator" />
          <div className="flex flex-col ml-[20px]">
            <span className="text-[16px] font-medium text-text-primary 375px:my-[0] my-[12px]">
              Google Authenticator: <span className={`text-[17px] ${user.two_factor_enabled ? "text-green-500" : "text-red-500"}`}>
                {user.two_factor_enabled ? "connected" : "disabled"}
              </span>
            </span>
            <span className="text-[15px] text-text-secondary-60">
              Requires a code from an authenticator app when signing in and enhances account security.
            </span>
          </div>
        </div>
        <div>
          <button
            onClick={handleAddFa}
            className="hover-anim py-[8px] px-[20px] text-primary border border-primary rounded-[10px] 375px:mt-[0] mt-[12px]"
          >
            {user.two_factor_enabled ? "Disable" : "Connect"}
          </button>
        </div>
      </div>

      {addFA && (
        <div className="absolute inset-0 z-40 w-full h-full">
          <div className="w-full h-full bg-bg-main/60 backdrop-blur-sm"></div>
          <Authentication
            handleClose={() => {
              setAddFA(false);
              setQrCode("");
              setSecret("");
            }}
            qrCode={qrCode}
            secret={secret}
            isSetup={true}
          />
        </div>
      )}
      <div className="opacity-0">s</div>
    </div>
  );
}

export default Settings;