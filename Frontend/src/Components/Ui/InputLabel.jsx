function InputLabel({ text, className = "", required = false }) {
  return (
    <label className={`text-text-primary text-[14px] font-medium ${className}`}>
      {text} {required && <span className="text-red-500">*</span>}
    </label>
  );
}

export default InputLabel;