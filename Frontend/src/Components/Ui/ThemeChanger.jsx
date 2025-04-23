import {useUserStore} from "../../Store/Index.js";
import { FaSun, FaMoon } from 'react-icons/fa';
import PropTypes from "prop-types";

function ThemeChanger({className}) {

  const { theme } = useUserStore();

  const { changeTheme } = useUserStore();
  const handleChangeTheme = () => {
    changeTheme()
  }
  return (
    <div onClick={handleChangeTheme} className={`${className} flex p-[2px] bg-accent border-2 border-text-secondary-60  rounded-full duration-300 hover-anim w-[65px]`}>
      <span
        className={`absolute w-6 h-6 p-[4px] rounded-full bg-primary transition-transform duration-300 transform ${
          theme === "theme-white"
            ? "translate-x-0"
            : "translate-x-8"
        }`}
      />

      <FaSun
        className={`mr-[4.5px] z-10 w-6 h-6 p-[4px] transition-all duration-300 ${
          theme === "theme-white"
            ? "rounded-full  opacity-100 text-white"
            : " text-text-secondary"
        }`}
      />
      <FaMoon
        className={`ml-[4.5px] z-10 w-6 h-6 p-[4px] transition-all duration-300 ${
          theme === "theme-black"
            ? "rounded-full  opacity-100 text-white"
            : "text-text-secondary"
        }`}
      />
    </div>
  );
}

ThemeChanger.propTypes = {
  className: PropTypes.string,
}
export default ThemeChanger;