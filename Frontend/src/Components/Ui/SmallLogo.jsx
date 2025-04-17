import PropTypes from "prop-types";

function SmallLogo({className}) {
  return (
    <>
      <img className={`${className} bg-primary p-[8px] logo-bg rounded-[18px] select-none`} src="icons/logo.svg" alt="logo"/>
    </>
  );
}

SmallLogo.propTypes = {
  className: PropTypes.string,
}
export default SmallLogo;