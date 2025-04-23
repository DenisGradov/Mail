import PropTypes from "prop-types";
import Modal from "../Ui/Modal.jsx";
import { useState } from "react";
import { validateInputs } from "../../Utils/Main.js";
import { useLoaderStore } from "../../Store/Loader.js";
import { useUserStore } from "../../Store/User.js";
import InputLabel from "../Ui/InputLabel.jsx";
import Input from "../Ui/Input.jsx";
import Button from "../Ui/Button.jsx";
import CaptchaWidget from "../Ui/CaptchaWidget.jsx";

export default function Login({ changeAuthorizationState }) {
  const { showLoader, hideLoader } = useLoaderStore();
  const { loginUser } = useUserStore();

  const [form, setForm] = useState({ login: "", password: "", remember: false });
  const [errors, setErrors] = useState({ login: "", password: "", captcha: "" });
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaErrorCount, setCaptchaErrorCount] = useState(0);
  const [captchaResetKey, setCaptchaResetKey] = useState(Date.now().toString()); // Ключ для сброса капчи

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
    if (errors[name]) {
      setErrors((e) => ({ ...e, [name]: "" }));
    }
  };

  const handleCaptcha = (token) => {
    setCaptchaToken(token);
    setCaptchaErrorCount(0);
    if (errors.captcha) {
      setErrors((e) => ({ ...e, captcha: "" }));
    }
  };

  const resetCaptcha = () => {
    setCaptchaToken("");
    setCaptchaResetKey(Date.now().toString()); // Меняем ключ для перемонтирования
    setErrors((e) => ({ ...e, captcha: "Пожалуйста, пройдите капчу заново." }));
  };

  const CAPTCHA_SKIP = import.meta.env.VITE_CAPTCHA_SKIP === "true";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const rules = {
      login: { required: true, type: "text", minLength: 5, message: "Логин должен содержать минимум 5 символов" },
      password: { required: true, type: "text", minLength: 5, message: "Пароль должен содержать минимум 5 символов" },
    };
    const v = validateInputs(form, rules);
    const newErrors = {
      login: v.login || "",
      password: v.password || "",
      captcha: CAPTCHA_SKIP ? "" : captchaToken ? "" : "Пожалуйста, пройдите капчу",
    };
    if (newErrors.login || newErrors.password || newErrors.captcha) {
      setErrors(newErrors);
      return;
    }
    try {
      showLoader();
      const response = await loginUser(form.login, form.password, form.remember, captchaToken);
      if (response?.status === 200) {
        if (form.remember) {
          localStorage.setItem("rememberedLogin", form.login);
        }
        return;
      }
      // Сбрасываем капчу при любой серверной ошибке
      resetCaptcha();
      if (response.response?.status === 401) {
        const be = response.response.data.errors || {};
        setErrors({
          login: be.login || "Неверный логин или пароль",
          password: be.password || "Неверный логин или пароль",
          captcha: be.captcha || "",
        });
      } else {
        setErrors((e) => ({ ...e, login: "Произошла ошибка сервера. Попробуйте снова." }));
      }
    } catch {
      resetCaptcha();
      setErrors({ login: "Произошла сетевая ошибка. Попробуйте снова.", password: "", captcha: "" });
    } finally {
      hideLoader();
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      <Modal>
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          <InputLabel text="Логин" />
          <div className={`mt-2 ${errors.login ? "border-red-600 border-2 rounded" : ""}`}>
            <Input
              name="login"
              type="text"
              placeholder="Введите ваш логин"
              value={form.login}
              setValue={handleChange}
            />
          </div>
          {errors.login && <p className="text-red-500 mt-1">{errors.login}</p>}

          <InputLabel text="Пароль" className="mt-4" />
          <div className={`mt-2 ${errors.password ? "border-red-600 border-2 rounded" : ""}`}>
            <Input
              name="password"
              type="password"
              placeholder="Введите ваш пароль"
              value={form.password}
              setValue={handleChange}
            />
          </div>
          {errors.password && <p className="text-red-500 mt-1">{errors.password}</p>}

          <div className="mt-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="remember"
                checked={form.remember}
                onChange={handleChange}
              />
              <span className="ml-2">Запомнить меня</span>
            </label>
          </div>

          <CaptchaWidget
            reset={captchaResetKey}
            onSuccess={handleCaptcha}
            onError={(msg) => {
              setCaptchaErrorCount((c) => c + 1);
              setErrors((e) => ({
                ...e,
                captcha: msg,
              }));
            }}
            onExpire={() => {
              setCaptchaToken("");
              setErrors((e) => ({ ...e, captcha: "Капча устарела. Пожалуйста, обновите виджет." }));
            }}
            error={errors.captcha}
          />
          {captchaErrorCount >= 3 && (
            <button
              type="button"
              onClick={resetCaptcha}
              className="text-blue-500 mt-2"
            >
              Обновить капчу
            </button>
          )}

          <div className="mt-6 hover:scale-105 transition">
            <Button type="submit" className="w-full">Войти</Button>
          </div>

          <div className="mt-4 text-center">
            Нет аккаунта?{" "}
            <button
              type="button"
              onClick={changeAuthorizationState}
              className="text-blue-500 hover:underline"
            >
              Зарегистрироваться
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

Login.propTypes = {
  changeAuthorizationState: PropTypes.func.isRequired,
};