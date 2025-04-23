import PropTypes from "prop-types";
import { Turnstile } from "@marsidev/react-turnstile";
import { useUserStore } from "../../Store/User.js";

function CaptchaWidget({ onSuccess, onError, onExpire, error, reset }) {
  const { theme } = useUserStore();
  const CAPTCHA_SKIP = import.meta.env.VITE_CAPTCHA_SKIP === "true";
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY || "0x4AAAAAABOjyDX12nSDcMwh";

  return (
    <div className="mt-4 flex flex-col justify-center items-center w-full max-w-[300px] mx-auto">
      <Turnstile
        key={reset} // Используем reset как ключ для перемонтирования
        siteKey={siteKey}
        onSuccess={onSuccess}
        onError={() => onError(CAPTCHA_SKIP ? "" : "Ошибка капчи. Попробуйте снова.")}
        onExpire={onExpire}
        options={{ theme: theme === "theme-black" ? "dark" : "light" }}
      />
      {error && (
        <p className="flex items-center justify-center text-red-500 mt-1 mb-2">{error}</p>
      )}
    </div>
  );
}

CaptchaWidget.propTypes = {
  onSuccess: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
  onExpire: PropTypes.func.isRequired,
  error: PropTypes.string,
  reset: PropTypes.string,
};

export default CaptchaWidget;