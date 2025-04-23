import PropTypes from "prop-types";
import Modal from "../Ui/Modal.jsx";
import {useState} from "react";
import {validateInputs} from "../../Utils/Main.js";
import {useLoaderStore} from "../../Store/Loader.js";
import {useUserStore} from "../../Store/User.js";
import InputLabel from "../Ui/InputLabel.jsx";
import Input from "../Ui/Input.jsx";
import Button from "../Ui/Button.jsx";
import CaptchaWidget from "../Ui/CaptchaWidget.jsx";
import Authentication from "./Authentication.jsx";

export default function Login({changeAuthorizationState}) {
  const {showLoader, hideLoader} = useLoaderStore();
  const {loginUser, user} = useUserStore();

  const [form, setForm] = useState({login: "", password: "", remember: false});
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaErrorCount, setCaptchaErrorCount] = useState(0);
  const [captchaResetKey, setCaptchaResetKey] = useState(Date.now().toString());
  const [show2FA, setShow2FA] = useState(false);

  const handleChange = (e) => {
    const {name, type, value, checked} = e.target;
    setForm((f) => ({...f, [name]: type === "checkbox" ? checked : value}));
  };

  const handleCaptcha = (token) => {
    setCaptchaToken(token);
    setCaptchaErrorCount(0);
  };

  const resetCaptcha = () => {
    setCaptchaToken("");
    setCaptchaResetKey(Date.now().toString());
  };

  const CAPTCHA_SKIP = import.meta.env.VITE_CAPTCHA_SKIP === "true";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const rules = {
      login: {required: true, type: "text", minLength: 5, message: "Login must be at least 5 characters"},
      password: {required: true, type: "text", minLength: 5, message: "Password must be at least 5 characters"},
    };
    const v = validateInputs(form, rules);
    const newErrors = {
      login: v.login || "",
      password: v.password || "",
      captcha: CAPTCHA_SKIP ? "" : captchaToken ? "" : "Please complete the captcha",
      general: "",
    };
    if (newErrors.login || newErrors.password || newErrors.captcha) {
      setForm((prev) => ({...prev, errors: newErrors}));
      return;
    }
    try {
      showLoader();
      const response = await loginUser(form.login, form.password, form.remember, captchaToken);
      if (response?.status === 206 && response.data?.two_factor_required) {
        setShow2FA(true);
      } else if (user.errors.login || user.errors.password || user.errors.captcha || user.errors.general) {
        if (!CAPTCHA_SKIP) {
          resetCaptcha();
        }
        setForm((prev) => ({
          ...prev,
          errors: {
            login: user.errors.login || "",
            password: user.errors.password || "",
            captcha: user.errors.captcha || "",
            general: user.errors.general || "",
          },
        }));
      } else {
        if (form.remember) {
          localStorage.setItem("rememberedLogin", form.login);
        }
        setShow2FA(false);
      }
    } catch {
      if (!CAPTCHA_SKIP) {
        resetCaptcha();
      }
      setForm((prev) => ({
        ...prev,
        errors: {
          login: user.errors.login || "",
          password: user.errors.password || "",
          captcha: user.errors.captcha || "",
          general: user.errors.general || "A network error occurred. Please try again.",
        },
      }));
    } finally {
      hideLoader();
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      <Modal>
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          <InputLabel text="Login"/>
          <div className={`mt-2 ${form.errors?.login ? "border-red-600 border-2 rounded" : ""}`}>
            <Input
              name="login"
              type="text"
              placeholder="Enter your login"
              value={form.login}
              setValue={handleChange}
            />
          </div>
          {form.errors?.login && <p className="text-red-500 mt-1">{form.errors.login}</p>}

          <InputLabel text="Password" className="mt-4"/>
          <div className={`mt-2 ${form.errors?.password ? "border-red-600 border-2 rounded" : ""}`}>
            <Input
              name="password"
              type="password"
              placeholder="Enter your password"
              value={form.password}
              setValue={handleChange}
            />
          </div>
          {form.errors?.password && <p className="text-red-500 mt-1">{form.errors.password}</p>}

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

          {!CAPTCHA_SKIP && (
            <>
              <CaptchaWidget
                reset={captchaResetKey}
                onSuccess={handleCaptcha}
                onError={(msg) => {
                  setCaptchaErrorCount((c) => c + 1);
                  setForm((prev) => ({
                    ...prev,
                    errors: {...prev.errors, captcha: msg},
                  }));
                }}
                onExpire={() => {
                  setCaptchaToken("");
                  setForm((prev) => ({
                    ...prev,
                    errors: {...prev.errors, captcha: "Captcha is out of date. Please update the widget."},
                  }));
                }}
                error={form.errors?.captcha}
              />
              {captchaErrorCount >= 3 && (
                <button
                  type="button"
                  onClick={resetCaptcha}
                  className="text-blue-500 mt-2"
                >
                  Refresh CAPTCHA
                </button>
              )}
              {form.errors?.captcha && <p className="text-red-500 mt-1">{form.errors.captcha}</p>}
            </>
          )}

          {form.errors?.general && <p className="text-red-500 mt-4 text-center">{form.errors.general}</p>}

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
      {show2FA && (
        <div className="bg-bg-main absolute left-0 top-0 inset-0 z-40 w-full h-full bg-bg-main/100 backdrop-blur-sm">
          <Authentication
            handleClose={() => setShow2FA(false)}
            isSetup={false}
          />
        </div>
      )}

    </div>
  );
}

Login.propTypes = {
  changeAuthorizationState: PropTypes.func.isRequired,
};