import Modal from "../Ui/Modal.jsx";
import { useState } from "react";
import { clearErrorOnInputChange, validateInputs } from "../../Utils/Main.js";
import { useLoaderStore } from "../../Store/Loader.js";
import { useUserStore } from "../../Store/User.js";
import InputLabel from "../Ui/InputLabel.jsx";
import Input from "../Ui/Input.jsx";
import PropTypes from "prop-types";
import Button from "../Ui/Button.jsx";
import { Turnstile } from "@marsidev/react-turnstile";

function Login({ changeAuthorizationState }) {
  const { showLoader, hideLoader } = useLoaderStore();
  const { loginUser } = useUserStore();

  const defaultFormData = { login: "", password: "", remember: false };
  const defaultErrorData = { errorLoginMsg: "", errorPasswordMsg: "" };

  const [value, setValue] = useState(defaultFormData);
  const [error, setError] = useState(defaultErrorData);
  const [captchaToken, setCaptchaToken] = useState("");

  const handleChange = (e) => {
    const { name, type, value: val, checked } = e.target;
    const newValue = type === "checkbox" ? checked : val;
    setValue((p) => ({ ...p, [name]: newValue }));
    // сбрасываем ошибку, если есть
    if (name === "login" && error.errorLoginMsg) {
      clearErrorOnInputChange("errorLoginMsg", setError);
    }
    if (name === "password" && error.errorPasswordMsg) {
      clearErrorOnInputChange("errorPasswordMsg", setError);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // проверяем капчу
    if (!captchaToken) {
      setError({
        ...defaultErrorData,
        errorLoginMsg: "Пожалуйста, подтвердите, что вы не робот",
      });
      return;
    }

    // валидация полей
    const rules = {
      login: {
        required: true,
        type: "text",
        minLength: 5,
        message: "Логин должен быть не короче 5 символов",
      },
      password: {
        required: true,
        type: "text",
        minLength: 5,
        message: "Пароль должен быть не короче 5 символов",
      },
    };
    const validation = validateInputs(value, rules);
    const newErrors = {
      errorLoginMsg: validation.login || "",
      errorPasswordMsg: validation.password || "",
    };
    if (newErrors.errorLoginMsg || newErrors.errorPasswordMsg) {
      setError(newErrors);
      return;
    }

    try {
      showLoader();
      // передаём токен капчи в API
      const response = await loginUser(
        value.login,
        value.password,
        value.remember,
        captchaToken
      );

      if (response.status === 200) {
        // успешный вход
        if (value.remember) {
          localStorage.setItem("rememberedLogin", value.login);
        }
        return;
      }
      // ошибка аутентификации
      if (response.response?.status === 401) {
        setError({
          errorLoginMsg: "Неверный логин или пароль",
          errorPasswordMsg: "Неверный логин или пароль",
        });
      }
    } catch {
      setError({
        errorLoginMsg: "Ошибка сети",
        errorPasswordMsg: "Ошибка сети",
      });
    } finally {
      hideLoader();
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      <Modal>
        <form onSubmit={handleSubmit} className="w-full">
          <InputLabel text="Login" />
          <div className={`mt-2 ${error.errorLoginMsg && "border-red-600 border-2 rounded"} `}>
            <Input
              name="login"
              type="text"
              placeholder="Enter your login"
              value={value.login}
              setValue={handleChange}
            />
          </div>
          <span className="text-red-500">{error.errorLoginMsg}</span>

          <InputLabel text="Password" className="mt-4" />
          <div className={`mt-2 ${error.errorPasswordMsg && "border-red-600 border-2 rounded"}`}>
            <Input
              name="password"
              type="password"
              placeholder="Enter your password"
              value={value.password}
              setValue={handleChange}
            />
          </div>
          <span className="text-red-500">{error.errorPasswordMsg}</span>

          <div className="mt-4">
            <Turnstile
              siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
              onVerify={(t) => setCaptchaToken(t)}
              options={{ theme: "auto" }}
            />
          </div>

          <div className="mt-6 cursor-pointer hover:scale-105 transition">
            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </div>

          <div className="mt-4 text-center">
            Don't have an account?{" "}
            <span
              onClick={changeAuthorizationState}
              className="text-blue-500 hover:underline cursor-pointer"
            >
              Register
            </span>
          </div>
        </form>
      </Modal>
    </div>
  );
}

Login.propTypes = {
  changeAuthorizationState: PropTypes.func.isRequired,
};

export default Login;
