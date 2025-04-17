import { useRef, useState } from "react";
import PropTypes from "prop-types";
import Input from "./Input.jsx";

function CodeInput({ length = 6, onComplete }) {
  const [code, setCode] = useState(Array(length).fill(""));
  const inputsRef = useRef([]);

  const focusInput = (index) => {
    if (index >= 0 && index < length) {
      inputsRef.current[index]?.focus();
    }
  };

  const handleChange = (index, val) => {
    const char = val.trim().slice(0, 1);

    if (!char.match(/^[a-zA-Z0-9]$/)) return;

    const newCode = [...code];
    newCode[index] = char;
    setCode(newCode);

    if (index < length - 1) {
      focusInput(index + 1);
    }

    if (newCode.every((c) => c)) {
      onComplete(newCode.join(""));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newCode = [...code];
      if (newCode[index]) {
        newCode[index] = "";
        setCode(newCode);
      } else if (index > 0) {
        newCode[index - 1] = "";
        setCode(newCode);
        focusInput(index - 1);
      }
    }

    if (e.key === "ArrowLeft") focusInput(index - 1);
    if (e.key === "ArrowRight") focusInput(index + 1);
    if (e.key === "Enter" && code.every((c) => c)) {
      onComplete(code.join(""));
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text").slice(0, length);
    if (!paste.match(/^[a-zA-Z0-9]+$/)) return;

    const chars = paste.split("");
    const newCode = [...code];
    for (let i = 0; i < chars.length; i++) {
      newCode[i] = chars[i];
    }
    setCode(newCode);

    setTimeout(() => {
      if (chars.length === length) {
        onComplete(newCode.join(""));
      } else {
        focusInput(chars.length);
      }
    }, 10);

    e.preventDefault();
  };

  return (
    <div className="flex gap-2" onPaste={handlePaste}>
      {code.map((char, index) => (
        <div key={index} className="w-[42px]">
          <Input
            name={`code-${index}`}
            type="text"
            value={char}
            setValue={(val) => handleChange(index, val)}
            inputRef={(el) => (inputsRef.current[index] = el)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            maxLength={1}
            customClass="text-center text-xl px-0"
          />
        </div>
      ))}
    </div>
  );
}

CodeInput.propTypes = {
  length: PropTypes.number,
  onComplete: PropTypes.func.isRequired,
};

export default CodeInput;
