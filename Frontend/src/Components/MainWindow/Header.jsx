import { FaArrowLeft, FaBell, FaCog } from "react-icons/fa";
import InputSearch from "../Ui/InputSearch.jsx";
import EmptyAvatar from "../Ui/EmptyAvatar.jsx";
import { useUserStore } from "../../Store/Index.js";
import PropTypes from "prop-types";

function Header({ isMailOpen, isSettingsOpen, handleMailOpen, handleSettingsOpen, searchInput, handleSearchInputUpdate }) {
  const { user } = useUserStore();

  return (
    <div
      className={`relative flex items-center ${!isMailOpen && !isSettingsOpen && "justify-center"} w-full py-[20px] px-[16px] h-[80px] top-0 left-0 z-20`}
    >
      {isMailOpen || isSettingsOpen ? (
        <div className={`text-[17px] font-bold left-[16px] ${isSettingsOpen && "flex items-center"}`}>
          <FaArrowLeft
            onClick={() => {
              if (isMailOpen) handleMailOpen(false);
              if (isSettingsOpen) handleSettingsOpen();
            }}
            className="text-[32px] hover-anim cursor-pointer"
          />
          {isSettingsOpen && <span className="ml-[10px] text-[25px] text-icons">Settings</span>}
        </div>
      ) : (
        <InputSearch value={searchInput} onChange={handleSearchInputUpdate} className="max-w-[400px] w-full" />
      )}
      <div className="absolute right-[45px] flex items-center space-x-[14px] h-[200px]">
        <FaBell className="text-[22px] hover-anim text-icons cursor-pointer" />
        <FaCog
          onClick={handleSettingsOpen}
          className="text-[22px] hover-anim hidden 375px:block text-icons cursor-pointer"
        />
        {user.avatar && user.avatar !== "none" ? (
          <img
            src={user.avatar}
            alt="User Avatar"
            className="w-[33px] h-[33px] hidden 450px:flex items-center justify-center select-none rounded-full"
            onClick={handleSettingsOpen}
            onError={(e) => (e.target.style.display = "none")}
          />
        ) : (
          <EmptyAvatar
            onClick={handleSettingsOpen}
            className="w-[33px] h-[33px] hidden 450px:flex items-center justify-center select-none"
            name={user.name}
          />
        )}
      </div>
    </div>
  );
}
export default Header;