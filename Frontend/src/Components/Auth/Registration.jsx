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
import PropTypes from "prop-types";
import Button from "../Ui/Button.jsx";
import { Turnstile } from "@marsidev/react-turnstile";

function Registration({ changeAuthorizationState }) {
  const { showLoader, hideLoader } = useLoaderStore();
  const { registerUser, checkAuth } = useUserStore();

  const defaultFormData = {
    name: "",
    surname: "",
    login: "",
    password: "",
    offer: false,
  };
  const defaultErrorData = {
    errorNameMsg: "",
    errorSurnameMsg: "",
    errorLoginMsg: "",
    errorPasswordMsg: "",
    errorOfferMsg: "",
  };

  const [value, setValue] = useState(defaultFormData);
  const [error, setError] = useState(defaultErrorData);
  const [captchaToken, setCaptchaToken] = useState("");

  const errorKeys = {
    name: "errorNameMsg",
    surname: "errorSurnameMsg",
    login: "errorLoginMsg",
    password: "errorPasswordMsg",
    offer: "errorOfferMsg",
  };

  const handleChange = (e) => {
    const { name, type, value: val, checked } = e.target;
    const newValue = type === "checkbox" ? checked : val;
    setValue((p) => ({ ...p, [name]: newValue }));
    clearErrorOnInputChange(errorKeys[name], setError);
  };

  const handleGenerate = () => {
    const pw = handleGeneratePassword();
    setValue((p) => ({ ...p, password: pw }));
    clearErrorOnInputChange("errorPasswordMsg", setError);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!captchaToken) {
      setError((p) => ({ ...p, errorLoginMsg: "Подтвердите, что вы не робот" }));
      return;
    }

    // правила валидации
    const rules = {
      name: {
        required: true,
        type: "text",
        minLength: 2,
        message: "Не менее 2 символов",
      },
      surname: {
        required: true,
        type: "text",
        minLength: 2,
        message: "Не менее 2 символов",
      },
      offer: {
        required: true,
        type: "boolean",
        message: "Нужно согласиться",
      },
      login: {
        required: true,
        type: "text",
        minLength: 5,
        message: "Не менее 5 символов",
      },
      password: {
        required: true,
        type: "text",
        minLength: 5,
        message: "Не менее 5 символов",
      },
    };

    const validation = validateInputs(value, rules);
    const newErrors = {
      errorNameMsg: validation.name || "",
      errorSurnameMsg: validation.surname || "",
      errorLoginMsg: validation.login || "",
      errorPasswordMsg: validation.password || "",
      errorOfferMsg: validation.offer || "",
    };
    if (
      newErrors.errorNameMsg ||
      newErrors.errorSurnameMsg ||
      newErrors.errorLoginMsg ||
      newErrors.errorPasswordMsg ||
      newErrors.errorOfferMsg
    ) {
      setError(newErrors);
      return;
    }

    try {
      showLoader();
      const response = await registerUser({
        name: value.name,
        surname: value.surname,
        login: value.login,
        password: value.password,
        offer: value.offer,
        captcha: captchaToken,
      });

      if (response.status === 201 || response.status === 200) {
        await checkAuth();
        return;
      }

      if (response.response?.status === 400) {
        const backendErrors = response.response.data.errors || {};
        setError((p) => ({
          ...p,
          errorNameMsg: backendErrors.name || "",
          errorSurnameMsg: backendErrors.surname || "",
          errorLoginMsg: backendErrors.login || "",
          errorPasswordMsg: backendErrors.password || "",
          errorOfferMsg: backendErrors.offer || "",
        }));
      }
    } catch {
      setError({
        ...defaultErrorData,
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
          <div className="flex space-x-4">
            <div className="flex-1">
              <InputLabel text="Name" />
              <Input
                name="name"
                type="text"
                value={value.name}
                setValue={handleChange}
                className={`mt-2 ${error.errorNameMsg && "border-red-600 border-2 rounded"}`}
              />
              <span className="text-red-500">{error.errorNameMsg}</span>
            </div>
            <div className="flex-1">
              <InputLabel text="Surname" />
              <Input
                name="surname"
                type="text"
                value={value.surname}
                setValue={handleChange}
                className={`mt-2 ${error.errorSurnameMsg && "border-red-600 border-2 rounded"}`}
              />
              <span className="text-red-500">{error.errorSurnameMsg}</span>
            </div>
          </div>

          <InputLabel text="Login" className="mt-4" />
          <Input
            name="login"
            type="text"
            value={value.login}
            setValue={handleChange}
            className={`mt-2 ${error.errorLoginMsg && "border-red-600 border-2 rounded"}`}
          />
          <span className="text-red-500">{error.errorLoginMsg}</span>

          <div className="mt-4 flex justify-between items-center">
            <InputLabel text="Password" />
            <Button type="button" onClick={handleGenerate}>
              Generate
            </Button>
          </div>
          <Input
            name="password"
            type="password"
            value={value.password}
            setValue={handleChange}
            className={`mt-2 ${error.errorPasswordMsg && "border-red-600 border-2 rounded"}`}
          />
          <span className="text-red-500">{error.errorPasswordMsg}</span>

          <label className="mt-4 flex items-center">
            <input
              type="checkbox"
              name="offer"
              checked={value.offer}
              onChange={handleChange}
            />
            <span className="ml-2">I agree to the terms</span>
          </label>
          <span className="text-red-500">{error.errorOfferMsg}</span>

          <div className="mt-4">
            <Turnstile
              siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
              onVerify={(t) => setCaptchaToken(t)}
              options={{ theme: "auto" }}
            />
          </div>

          <div className="mt-6 cursor-pointer hover:scale-105 transition">
            <Button type="submit" className="w-full">
              Create account
            </Button>
          </div>

          <div className="mt-4 text-center">
            Already have an account?{" "}
            <span
              onClick={changeAuthorizationState}
              className="text-blue-500 hover:underline cursor-pointer"
            >
              Sign in
            </span>
          </div>
        </form>
      </Modal>
    </div>
  );
}

Registration.propTypes = {
  changeAuthorizationState: PropTypes.func.isRequired,
};

export default Registration;
