import Modal from "../Ui/Modal.jsx";
import { useState } from "react";
import {
  clearErrorOnInputChange,
  handleGeneratePassword,
  validateInputs,
} from "../../Utils/Main.js";
import { useLoaderStore } from "../../Store/Loader.js";
import { useUserStore } from "../../Store/User.js";
import InputLabel from "../Ui/InputLabel.jsx";
import Input from "../Ui/Input.jsx";
import Button from "../Ui/Button.jsx";
import { Turnstile } from "@marsidev/react-turnstile";
import PropTypes from "prop-types";

export default function Registration({ changeAuthorizationState }) {
  const { showLoader, hideLoader } = useLoaderStore();
  const { registerUser, checkAuth } = useUserStore();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const rules = {
      name: {
        required: true,
        type: "text",
        minLength: 2,
        message: "Name must be at least 2 characters",
      },
      surname: {
        required: true,
        type: "text",
        minLength: 2,
        message: "Surname must be at least 2 characters",
      },
      login: {
        required: true,
        type: "text",
        minLength: 5,
        message: "Login must be at least 5 characters",
      },
      password: {
        required: true,
        type: "text",
        minLength: 5,
        message: "Password must be at least 5 characters",
      },
      offer: {
        required: true,
        type: "boolean",
        message: "You must accept the terms",
      },
    };
    const v = validateInputs(form, rules);
    const newErrors = {
      name: v.name || "",
      surname: v.surname || "",
      login: v.login || "",
      password: v.password || "",
      offer: v.offer || "",
      captcha: captchaToken ? "" : "Please complete the captcha",
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
        }));
      } else {
        setErrors((e) => ({
          ...e,
          login: "Server error occurred. Please try again.",
        }));
      }
    } catch {
      setErrors((e) => ({
        ...e,
        login: "Network error occurred. Please try again.",
      }));
    } finally {
      hideLoader();
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      <Modal>
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <InputLabel text="Name" />
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
              <InputLabel text="Surname" />
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

          <InputLabel text="Login" className="mt-4" />
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
            <InputLabel text="Password"/>
            <div className="hover-anim" onClick={handleGenerate}>
              <InputLabel text={'Generate'}/>
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

          <div className="mt-4">
            <Turnstile
              siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
              onVerify={setCaptchaToken}
            />
          </div>
          {errors.captcha && <p className="text-red-500 mt-1">{errors.captcha}</p>}

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
