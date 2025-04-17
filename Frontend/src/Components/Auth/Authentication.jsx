import {useEffect, useRef, useState} from "react";
import Modal from "../Ui/Modal.jsx";
import {useLoaderStore} from "../../Store/Loader.js";
import {useUserStore} from "../../Store/User.js";

function Authentication() {
  const {showLoader, hideLoader} = useLoaderStore();
  const {loginUser} = useUserStore();
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

  const overwriteAndMove = (index, char) => {
    const newCode = [...code];
    newCode[index] = char;
    setCode(newCode);
    const newInputErrors = [...inputErrors];
    newInputErrors[index] = false;
    setInputErrors(newInputErrors);
    if (index < inputLength - 1) {
      focusInput(index + 1);
    }
    return newCode;
  };

  const handleChange = (index, e) => {
    const rawValue = e.target.value;
    if (!rawValue) return;
    const char = rawValue.slice(-1).trim();
    if (!/^[a-zA-Z0-9]$/.test(char)) return;
    setError("");
    const updatedCode = overwriteAndMove(index, char);
    if (updatedCode.every((c) => c !== "")) {
      handleSubmit(updatedCode);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newCode = [...code];
      if (newCode[index] !== "") {
        newCode[index] = "";
        setCode(newCode);
        setError("");
        const newInputErrors = [...inputErrors];
        newInputErrors[index] = false;
        setInputErrors(newInputErrors);
      } else if (index > 0) {
        newCode[index - 1] = "";
        setCode(newCode);
        setError("");
        const newInputErrors = [...inputErrors];
        newInputErrors[index - 1] = false;
        setInputErrors(newInputErrors);
        focusInput(index - 1);
      }
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      focusInput(index - 1);
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      focusInput(index + 1);
    }
    if (e.key === "Enter" && code.every((c) => c)) {
      e.preventDefault();
      handleSubmit(code);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text");
    if (!paste) return;
    const validPaste = paste.replace(/[^a-zA-Z0-9]/g, "").slice(0, inputLength);
    if (!validPaste) return;
    const newCode = [...code];
    const newInputErrors = [...inputErrors];
    for (let i = 0; i < validPaste.length; i++) {
      newCode[i] = validPaste[i];
      newInputErrors[i] = false;
    }
    setCode(newCode);
    setInputErrors(newInputErrors);
    setError("");
    if (validPaste.length < inputLength) {
      focusInput(validPaste.length);
    } else {
      handleSubmit(newCode);
    }
  };

  const handleSubmit = async (passedCode) => {
    if (isSubmitting) return;
    const finalCode = passedCode || code;
    if (finalCode.join("").length !== inputLength) {
      setError("Please enter the full code");
      const newInputErrors = finalCode.map((c) => c === "");
      setInputErrors(newInputErrors);
      return;
    }
    try {
      setIsSubmitting(true);
      showLoader();
      const response = await loginUser(finalCode.join(""), "placeholder-password");
      if (response.status === 200) {
        console.log("Authentication successful:", response);
      } else if (response.status === 400) {
        setError("Invalid code");
        setInputErrors(Array(inputLength).fill(true));
      } else {
        setError("Network or server error");
        setInputErrors(Array(inputLength).fill(true));
      }
    } catch {
      setError("Network error occurred");
      setInputErrors(Array(inputLength).fill(true));
    } finally {
      setIsSubmitting(false);
      hideLoader();
    }
  };

  const { changeTheme } = useUserStore();
  const handleChangeTheme = () => {
    changeTheme()
  }

  useEffect(() => {
    focusInput(0);
  }, []);

  return (
    <div className="flex flex-col justify-center items-center w-full h-full">

      <div
        className="relative bg-[#262626] flex flex-col justify-center items-center max-w-[450px] w-full rounded-[24px] p-[30px]">
        <div className="flex w-full relative">
          <div className="text-center">{"<-"}</div>
          <div className=" absolute left-1/2 -translate-x-1/2">IMG</div>
          <div onClick={handleChangeTheme} className="absolute right-0">theme</div>
        </div>
        <div className="flex flex-col items-center mt-[30px]">
          <h3>Подтвердите что это вы</h3>
          <h4 className="mt-[12px]">Введите 6-значный код из приложения</h4>
        </div>
        <div className="w-full mt-[40px]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="w-full flex flex-col items-center"
          >
            <label className="mb-4 font-medium text-lg">Enter 6-character code</label>
            <div className="flex gap-2">
              {code.map((char, index) => (
                <input
                  key={index}
                  type="text"
                  value={char}
                  ref={(el) => (inputsRef.current[index] = el)}
                  onChange={(e) => handleChange(index, e)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
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
              className="hover:scale-[1.01] hover:opacity-90 duration-300 cursor-pointer mt-[30px] w-full max-w-[300px] p-[15px] text-white rounded-[10px] font-sans text-[16px] bg-primary"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Authentication;
