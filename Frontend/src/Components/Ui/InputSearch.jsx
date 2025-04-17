import PropTypes from "prop-types";
import { FaSearch } from 'react-icons/fa';

function InputSearch({
                       placeholder = "Search", type = 'text', value, onChange, name = "Search", onKeyDown, maxLength = 100, className
                     }) {
  return (
    <div className={`flex items-center select-none ${className}`}>
      <input
        placeholder={placeholder}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        maxLength={maxLength}
        className={`focus:outline-none placeholder:opacity-60 font-sans font-light p-[12px] w-full rounded-[10px] bg-input text-text-secondary border border-stroke`}
      />
      <FaSearch className="text-[16px] text-icons ml-[-25px] pointer-events-none" />

    </div>
  );
}

InputSearch.propTypes = {
  type: PropTypes.string,
  value: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  maxLength: PropTypes.number,
  className: PropTypes.string,
  placeholder: PropTypes.string,
};

export default InputSearch;
