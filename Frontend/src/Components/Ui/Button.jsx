import PropTypes from "prop-types";

function Button({className, onClick, children }) {
  return (
    <button className={`${className}  p-[12px] bg-primary rounded-[10px] text-[#fff] hover-anim`} onClick={onClick}>{children}</button>
  );
}

Button.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.string,
  className: PropTypes.string,
}
export default Button;