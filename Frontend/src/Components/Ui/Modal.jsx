import PropTypes from "prop-types";
import Logo from "./Logo.jsx";
import ThemeChanger from "../ThemeChanger.jsx";

function Modal({children}) {

  return (
    <div className="relative bg-[#262626] flex flex-col justify-center items-center max-w-[450px] w-full rounded-[24px] p-[30px] bg-container">
      <div className="flex justify-center w-full">
        <Logo/>
        <div className="absolute right-[30px]"><ThemeChanger/></div>
      </div>
      <div className="w-full mt-[40px]">{children}</div>
    </div>
  );
}

Modal.propTypes = {
  children: PropTypes.node.isRequired,
}
export default Modal;