import Modal from "../Ui/Modal.jsx";
import { useState } from "react";
import { validateInputs } from "../../Utils/Main.js";
import { useLoaderStore } from "../../Store/Loader.js";
import { useUserStore } from "../../Store/User.js";
import InputLabel from "../Ui/InputLabel.jsx";
import Input from "../Ui/Input.jsx";
import Button from "../Ui/Button.jsx";
import { Turnstile } from "@marsidev/react-turnstile";
import PropTypes from "prop-types";

export default function Login({ changeAuthorizationState }) {
  const { showLoader, hideLoader } = useLoaderStore();
  const { loginUser } = useUserStore();

  const [form, setForm] = useState({ login: "", password: "", remember: false });
  const [errors, setErrors] = useState({ login: "", password: "", captcha: "" });
  const [captchaToken, setCaptchaToken] = useState("");

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
    if (errors[name]) {
      setErrors((e) => ({ ...e, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const rules = {
      login:    { required: true, type: "text", minLength: 5, message: "Login must be at least 5 characters" },
      password: { required: true, type: "text", minLength: 5, message: "Password must be at least 5 characters" },
    };
    const v = validateInputs(form, rules);
    const newErrors = {
      login:    v.login    || "",
      password: v.password || "",
      captcha:  captchaToken ? "" : "Please complete the captcha",
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
      if (response.response?.status === 401) {
        setErrors({ login: "Invalid login or password", password: "Invalid login or password", captcha: "" });
      } else {
        setErrors((e) => ({ ...e, login: "Server error occurred. Please try again." }));
      }
    } catch {
      setErrors({ login: "Network error occurred. Please try again.", password: "", captcha: "" });
    } finally {
      hideLoader();
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      <Modal>
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          <InputLabel text="Login" />
          <div className={`mt-2 ${errors.login ? "border-red-600 border-2 rounded" : ""}`}>
            <Input
              name="login"
              type="text"
              placeholder="Enter your login"
              value={form.login}
              setValue={handleChange}
            />
          </div>
          {errors.login && <p className="text-red-500 mt-1">{errors.login}</p>}

          <InputLabel text="Password" className="mt-4" />
          <div className={`mt-2 ${errors.password ? "border-red-600 border-2 rounded" : ""}`}>
            <Input
              name="password"
              type="password"
              placeholder="Enter your password"
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
              <span className="ml-2">Remember me</span>
            </label>
          </div>

          <div className="mt-4">
            <Turnstile
              siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
              onVerify={setCaptchaToken}
            />
          </div>
          {errors.captcha && <p className="text-red-500 mt-1">{errors.captcha}</p>}

          <div className="mt-6 hover:scale-105 transition">
            <Button type="submit" className="w-full">Sign in</Button>
          </div>

          <div className="mt-4 text-center">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={changeAuthorizationState}
              className="text-blue-500 hover:underline"
            >
              Register
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
