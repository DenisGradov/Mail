import PropTypes from 'prop-types';
import { useState, forwardRef } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Input = forwardRef(function Input(
  {
    placeholder,
    type = 'text',
    value,
    setValue,
    name,
    onKeyDown,
    maxLength = 100,
    customClass = '',
    className
  },
  ref
) {
  const [passwordHidden, setPasswordHidden] = useState(false);

  const handleChangeHidden = () => {
    setPasswordHidden((prev) => !prev);
  };

  const getInputType = () =>
    type === 'password' ? (passwordHidden ? 'text' : 'password') : 'text';

  return (
    <div className={`relative w-full rounded-[10px] ${className}`}>
      <input
        ref={ref}
        type={getInputType()}
        name={name}
        placeholder={placeholder}
        value={value || ''}
        onInput={(e) => setValue(e)}
        onKeyDown={onKeyDown}
        maxLength={maxLength}
        autoComplete="new-password"
        className={`focus:outline-none placeholder:opacity-60 font-sans font-light w-full p-[12px] rounded-[10px] bg-input text-text-secondary border border-stroke ${customClass}`}
      />
      {type === 'password' && (
        <span
          className="hover-anim w-[42px] absolute ml-[-15px] 375px:ml-[-40px] top-[50%] -translate-y-1/2 text-black text-[23px]"
          onClick={handleChangeHidden}
        >
          {passwordHidden?<FaEye className="text-[15px] text-primary 375px:text-[23px] 375px:text-icons"/> : <FaEyeSlash className="text-[15px] text-primary 375px:text-[23px] 375px:text-icons"/> }
        </span>
      )}
    </div>
  );
});

Input.propTypes = {
  placeholder: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.string,
  setValue: PropTypes.func,
  name: PropTypes.string,
  onKeyDown: PropTypes.func,
  maxLength: PropTypes.number,
  customClass: PropTypes.string,
  className: PropTypes.string
};

export default Input;
