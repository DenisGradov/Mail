import PropTypes from "prop-types";
import Modal from "../Ui/Modal.jsx";
import { useState } from "react";
import { clearErrorOnInputChange, handleGeneratePassword, validateInputs } from "../../Utils/Main.js";
import { useLoaderStore } from "../../Store/Loader.js";
import { useUserStore } from "../../Store/User.js";
import InputLabel from "../Ui/InputLabel.jsx";
import Input from "../Ui/Input.jsx";
import Button from "../Ui/Button.jsx";
import CaptchaWidget from "../Ui/CaptchaWidget.jsx";
import { registerUser } from "../../Api/Auth.js";

export default function Registration({ changeAuthorizationState }) {
  const { showLoader, hideLoader } = useLoaderStore();
  const { checkAuth } = useUserStore();

  const [form, setForm] = useState({
    name: "",
    surname: "",
    login: "",
    password: "",
    offer: false,
  });
  const [errors, setErrors] = useState({
    name: "",
    surname: "",
    login: "",
    password: "",
    offer: "",
    captcha: "",
  });
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaErrorCount, setCaptchaErrorCount] = useState(0);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      clearErrorOnInputChange(name, setErrors);
    }
  };

  const handleGenerate = () => {
    const pw = handleGeneratePassword();
    setForm((f) => ({ ...f, password: pw }));
    if (errors.password) {
      clearErrorOnInputChange("password", setErrors);
    }
  };

  const handleCaptcha = (token) => {
    setCaptchaToken(token);
    setCaptchaErrorCount(0);
    if (errors.captcha) {
      setErrors((e) => ({ ...e, captcha: "" }));
    }
  };

  const CAPTCHA_SKIP = import.meta.env.VITE_CAPTCHA_SKIP === "true";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const rules = {
      name: { required: true, type: "text", minLength: 2, message: "Name must be at least 2 characters" },
      surname: { required: true, type: "text", minLength: 2, message: "Surname must be at least 2 characters" },
      login: { required: true, type: "text", minLength: 5, message: "Login must be at least 5 characters" },
      password: { required: true, type: "text", minLength: 5, message: "Password must be at least 5 characters" },
      offer: { required: true, type: "boolean", message: "You must accept the terms" },
    };
    const v = validateInputs(form, rules);
    const newErrors = {
      name: v.name || "",
      surname: v.surname || "",
      login: v.login || "",
      password: v.password || "",
      offer: v.offer || "",
      captcha: CAPTCHA_SKIP ? "" : captchaToken ? "" : "Please complete the captcha",
    };
    if (
      newErrors.name ||
      newErrors.surname ||
      newErrors.login ||
      newErrors.password ||
      newErrors.offer ||
      newErrors.captcha
    ) {
      setErrors(newErrors);
      return;
    }
    try {
      showLoader();
      const resp = await registerUser({
        name: form.name,
        surname: form.surname,
        login: form.login,
        password: form.password,
        offer: form.offer,
        captcha: captchaToken,
      });
      if (resp.status === 200 || resp.status === 201) {
        await checkAuth();
        return;
      }
      if (resp.response?.status === 400) {
        const be = resp.response.data.errors || {};
        setErrors((e) => ({
          ...e,
          name: be.name || "",
          surname: be.surname || "",
          login: be.login || "",
          password: be.password || "",
          offer: be.offer || "",
          captcha: be.captcha || "",
        }));
      } else {
        setErrors((e) => ({
          ...e,
          login: "A server error occurred. Please try again.",
        }));
      }
    } catch {
      setErrors((e) => ({
        ...e,
        login: "A network error occurred. Please try again.",
      }));
    } finally {
      hideLoader();
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full h-full p-[5px]">
      <Modal>
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <InputLabel required={true} text="Name" />
              <Input
                name="name"
                type="text"
                placeholder="Enter your name"
                value={form.name}
                setValue={handleChange}
                className={`mt-2 ${errors.name ? "border-red-600 border-2 rounded" : ""}`}
              />
              {errors.name && <p className="text-red-500 mt-1">{errors.name}</p>}
            </div>
            <div>
              <InputLabel required={true} text="Surname" />
              <Input
                name="surname"
                type="text"
                placeholder="Enter your surname"
                value={form.surname}
                setValue={handleChange}
                className={`mt-2 ${errors.surname ? "border-red-600 border-2 rounded" : ""}`}
              />
              {errors.surname && <p className="text-red-500 mt-1">{errors.surname}</p>}
            </div>
          </div>

          <InputLabel required={true} text="Login" className="mt-4" />
          <Input
            name="login"
            type="text"
            placeholder="Enter your login"
            value={form.login}
            setValue={handleChange}
            className={`mt-2 ${errors.login ? "border-red-600 border-2 rounded" : ""}`}
          />
          {errors.login && <p className="text-red-500 mt-1">{errors.login}</p>}

          <div className="mt-4 flex justify-between items-center">
            <InputLabel required={true} text="Password" />
            <div className="hover-anim" onClick={handleGenerate}>
              <InputLabel text="Generate" />
            </div>
          </div>
          <Input
            name="password"
            type="password"
            placeholder="Enter your password"
            value={form.password}
            setValue={handleChange}
            className={`mt-2 ${errors.password ? "border-red-600 border-2 rounded" : ""}`}
          />
          {errors.password && <p className="text-red-500 mt-1">{errors.password}</p>}

          <label className="mt-4 flex items-center">
            <input
              type="checkbox"
              name="offer"
              checked={form.offer}
              onChange={handleChange}
            />
            <span className="ml-2">I agree to the terms</span>
          </label>
          {errors.offer && <p className="text-red-500 mt-1">{errors.offer}</p>}

          {!CAPTCHA_SKIP && (
            <>
              <CaptchaWidget
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
                  setErrors((e) => ({ ...e, captcha: "Captcha is out of date. Please update the widget." }));
                }}
                error={errors.captcha}
              />
              {captchaErrorCount >= 3 && (
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="text-blue-500 mt-2"
                >
                  Refresh CAPTCHA
                </button>
              )}
              {errors.captcha && <p className="text-red-500 mt-1">{errors.captcha}</p>}
            </>
          )}

          <div className="mt-6 hover:scale-105 transition">
            <Button type="submit" className="w-full">
              Create account
            </Button>
          </div>

          <div className="mt-4 text-center">
            Already have an account?{" "}
            <button
              type="button"
              onClick={changeAuthorizationState}
              className="text-blue-500 hover:underline"
            >
              Sign in
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

Registration.propTypes = {
  changeAuthorizationState: PropTypes.func.isRequired,
};