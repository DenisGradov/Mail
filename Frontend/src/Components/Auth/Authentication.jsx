import { useEffect, useRef, useState } from "react";
import { useLoaderStore } from "../../Store/Loader.js";
import { useUserStore } from "../../Store/User.js";
import { verify2FA } from "../../Api/Auth.js";
import { copyToClipboard } from "../../Utils/Main.js";
import {FaArrowLeft} from "react-icons/fa";
import ThemeChanger from "../Ui/ThemeChanger.jsx";

function Authentication({ handleClose, qrCode, isSetup, secret }) {
  const { showLoader, hideLoader } = useLoaderStore();
  const { user, setUser } = useUserStore();
  const inputLength = 6;
  const [code, setCode] = useState(Array(inputLength).fill(""));
  const [error, setError] = useState("");
  const [inputErrors, setInputErrors] = useState(Array(inputLength).fill(false));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputsRef = useRef([]);

  const focusInput = (index) => {
    if (index >= 0 && index < inputLength) {
      inputsRef.current[index]?.focus();
    }
  };

  const handleChange = (index, e) => {
    const value = e.target.value;
    if (value === "") {
      setCode((prev) => {
        const newCode = [...prev];
        newCode[index] = "";
        return newCode;
      });
      setInputErrors((prev) => {
        const newErrors = [...prev];
        newErrors[index] = false;
        return newErrors;
      });
      return;
    }

    const char = value.slice(-1);
    if (!/^[0-9]$/.test(char)) return;

    setCode((prev) => {
      const newCode = [...prev];
      newCode[index] = char;
      return newCode;
    });
    setInputErrors((prev) => {
      const newErrors = [...prev];
      newErrors[index] = false;
      return newErrors;
    });
    setError("");

    if (index < inputLength - 1) {
      focusInput(index + 1);
    } else if (code.every((c, i) => (i === index ? char : c))) {
      handleSubmit([...code.slice(0, index), char]);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      if (code[index] !== "") {
        setCode((prev) => {
          const newCode = [...prev];
          newCode[index] = "";
          return newCode;
        });
        setInputErrors((prev) => {
          const newErrors = [...prev];
          newErrors[index] = false;
          return newErrors;
        });
        setError("");
      } else if (index > 0) {
        for (let i = index - 1; i >= 0; i--) {
          if (code[i] !== "") {
            setCode((prev) => {
              const newCode = [...prev];
              newCode[i] = "";
              return newCode;
            });
            setInputErrors((prev) => {
              const newErrors = [...prev];
              newErrors[i] = false;
              return newErrors;
            });
            focusInput(i);
            break;
          } else if (i === 0) {
            focusInput(0);
          }
        }
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      focusInput(index - 1);
    } else if (e.key === "ArrowRight" && index < inputLength - 1) {
      e.preventDefault();
      focusInput(index + 1);
    }
  };

  const handlePaste = (e, index) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, inputLength);
    if (!paste) return;

    if (paste.length === inputLength) {
      const newCode = paste.split("");
      setCode(newCode);
      setInputErrors(Array(inputLength).fill(false));
      setError("");
      focusInput(inputLength - 1);
      handleSubmit(newCode);
    } else {
      const newCode = [...code];
      for (let i = 0; i < paste.length && index + i < inputLength; i++) {
        newCode[index + i] = paste[i];
      }
      setCode(newCode);
      setInputErrors(Array(inputLength).fill(false));
      setError("");
      focusInput(Math.min(index + paste.length, inputLength - 1));
    }
  };

  const handleCopySecret = async () => {
    if (secret) {
      const success = await copyToClipboard(secret);
      if (success) {
        alert("Secret code copied to clipboard!");
      } else {
        alert("Failed to copy code. Please try again.");
      }
    }
  };

  const handleSubmit = async (finalCode) => {
    if (isSubmitting) return;
    if (finalCode.length !== inputLength || finalCode.some((c) => !c)) {
      setError("Please enter the full code");
      setInputErrors(finalCode.map((c) => !c));
      return;
    }

    try {
      setIsSubmitting(true);
      showLoader();
      if (isSetup) {
        const response = await verify2FA(finalCode.join(""));
        if (response.status === 200) {
          setUser({ ...user, two_factor_enabled: 1 });
          handleClose();
        } else {
          const errorMsg =
            response?.data?.errors?.totp_code ||
            response?.data?.error ||
            "Failed to setup 2FA";
          setError(errorMsg);
          setInputErrors(Array(inputLength).fill(true));
        }
      } else {
        if (!user.login || !user.password) {
          setError("Session expired, please try again");
          setInputErrors(Array(inputLength).fill(true));
          setTimeout(() => {
            handleClose();
          }, 2000);
          return;
        }
        const response = await useUserStore.getState().loginUser(
          user.login,
          user.password,
          user.remember,
          user.captcha,
          finalCode.join("")
        );
        if (response.status === 200) {
          setUser({
            id: response.data.userId,
            login: response.data.login,
            email: response.data.email,
            name: response.data.name || "",
            surname: response.data.surname || "",
            status: response.data.status || 0,
            avatar: response.data.avatar || "none",
            two_factor_enabled: response.data.two_factor_enabled || 0,
          });
          useUserStore.setState((state) => ({
            auth: { isAuthenticated: true },
          }));
          handleClose();
          window.location.reload(); // Обновляем страницу для отображения почты
        } else {
          const errorMsg =
            response?.data?.errors?.totp_code ||
            response?.data?.error ||
            "Failed to verify 2FA code";
          setError(errorMsg);
          setInputErrors(Array(inputLength).fill(true));
        }
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.errors?.totp_code ||
        err.response?.data?.error ||
        err.message ||
        "Network error occurred";
      setError(errorMsg);
      setInputErrors(Array(inputLength).fill(true));
    } finally {
      setIsSubmitting(false);
      hideLoader();
    }
  };

  useEffect(() => {
    focusInput(0);
  }, []);

  return (
    <div className="flex flex-col justify-center items-center w-full h-full p-[5px]">
      <div className="relative bg-container flex flex-col justify-center items-center max-w-[450px] w-full rounded-[24px] p-[30px]">
        <div className="flex justify-between w-full items-center">
          <div className="text-center cursor-pointer text-white" onClick={handleClose}>
            <FaArrowLeft className="text-icons"/>
          </div>
          <img src="google-authenticator.svg" className="absolute left-1/2 -translate-x-1/2"/>
          <div>
            <ThemeChanger/>
          </div>
        </div>
        <div className="flex flex-col items-center mt-[30px]">
          <h3 className="text-text-primary text-[24px] font-bold text-center">
            {isSetup ? "Setup Two-Factor Authentication" : "Verify Your Identity"}
          </h3>

        </div>
        {isSetup && qrCode && (
          <div className="mt-[20px] flex flex-col items-center">
            <img src={qrCode} alt="QR Code" className="w-[200px] h-[200px]" />
            <p className="text-center mt-[10px] text-text-primary">
              Scan the QR code with Google Authenticator
            </p>
            {secret && (
              <div className="mt-[20px] flex items-center max-w-[300px] w-full">
                <input
                  type="text"
                  value={secret}
                  readOnly
                  className="w-full p-2 bg-gray-700 text-white font-mono text-sm rounded-l-md border border-gray-600 focus:outline-none"
                />
                <button
                  onClick={handleCopySecret}
                  className="p-2 bg-primary text-white rounded-r-md hover:bg-primary-dark"
                >
                  Copy
                </button>
              </div>
            )}
          </div>
        )}
        <div className="w-full mt-[40px]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(code);
            }}
            className="w-full flex flex-col items-center"
          >
            <label className="mb-4 text-center text-text-primary">Enter 6-digit code</label>
            <div className="flex gap-2">
              {code.map((char, index) => (
                <input
                  key={index}
                  type="text"
                  placeholder={char}
                  value={char}
                  ref={(el) => (inputsRef.current[index] = el)}
                  onChange={(e) => handleChange(index, e)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={(e) => handlePaste(e, index)}
                  maxLength={1}
                  className={`w-[42px] h-[52px] text-black text-center text-xl border rounded-md focus:outline-none focus:border-blue-500 ${
                    inputErrors[index] ? "border-red-600" : ""
                  }`}
                />
              ))}
            </div>
            {error && <div className="text-red-500 mt-2">{error}</div>}
            <button
              type="submit"
              disabled={isSubmitting}
              className="hover:scale-[1.01] hover:opacity-90 duration-300 cursor-pointer mt-[30px] w-full max-w-[300px] p-[15px] text-white rounded-[10px] font-sans text-[16px] bg-primary disabled:bg-gray-500"
            >
              Accept
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Authentication;