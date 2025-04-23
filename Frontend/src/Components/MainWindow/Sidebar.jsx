import {FaBars, FaRegPaperPlane, FaSignOutAlt} from "react-icons/fa";
import Logo from "../Ui/Logo.jsx";
import SmallLogo from "../Ui/SmallLogo.jsx";
import Line from "../Ui/Line.jsx";
import Button from "../Ui/Button.jsx";
import ThemeChanger from "../Ui/ThemeChanger.jsx";
import EmptyAvatar from "../Ui/EmptyAvatar.jsx";
import { useUserStore } from "../../Store/Index.js";
import PropTypes from "prop-types";

function Sidebar({ isMenuOpen, setIsMenuOpen, handleNewMail, handleTabOpen, activeTab, tabs, handleWantLogout, handleSettingsOpen }) {
  const { user } = useUserStore();

  return (
    <div
      className={`${
        isMenuOpen ? "w-[260px] py-[20px] px-[12px] items-center" : "w-[72px]"
      } h-full bg-container flex flex-col z-20 border-r border-stroke`}
    >
      <div className="flex flex-col items-center h-full">
        <div className={`${!isMenuOpen && "flex-col-reverse px-[10px]"} flex items-center w-full`}>
          <FaBars
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="text-[24px] text-icons hover-anim cursor-pointer"
          />
          <div className="scale-75">
            {isMenuOpen ? <Logo /> : <SmallLogo className={`${!isMenuOpen && "my-[20px]"} scale-125 duration-0 select-none`} />}
          </div>
        </div>
        <Line className="my-[24px]" />
        <Button onClick={handleNewMail} className={`${!isMenuOpen && "w-[50px]"} font-bold`}>
          {isMenuOpen ? "New Message" : <FaRegPaperPlane className="text-[25px]" />}
        </Button>
        <Line className="mt-[24px] mb-[26.5px]" />
        {Object.keys(tabs).map((tab, i) => (
          <div
            onClick={() => handleTabOpen(tab)}
            key={`Tab #${i}`}
            className={`${
              isMenuOpen ? "p-[12px] w-full rounded-[10px]" : "p-[10px] px-[14px] rounded-[10px]"
            } ${activeTab === tab ? "bg-bg-active" : ""} hover-anim my-[2.5px] hover:bg-bg-hover opacity-50 flex justify-between items-center cursor-pointer`}
          >
            <div className="flex items-center">
              <div
                className={`${isMenuOpen ? "mr-[10px]" : "text-[25px] ml-[-3px]"} ${
                  activeTab === tab ? "font-bold" : "text-icons"
                } w-[20px]`}
              >
                {tabs[tab].icon}
              </div>
              <div className={`${!isMenuOpen && "hidden"} ${activeTab === tab ? "font-bold" : ""}`}>
                {tabs[tab].title}
              </div>
            </div>
            <div className={`${!isMenuOpen && "hidden"} ${activeTab === tab ? "font-bold" : "text-icons"}`}>
              {tabs[tab].value}
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col w-full">
        <ThemeChanger className={`${!isMenuOpen && "rotate-90"}`} />
        <Line className={`${!isMenuOpen && "mt-[40px]"} my-[20px]`} />
        <div className={`${!isMenuOpen && "flex-col"} flex justify-between items-center`}>
          <div className="flex items-center">
            {user.avatar && user.avatar !== "none" ? (
              <img
                src={user.avatar}
                alt="User Avatar"
                className={isMenuOpen ? "w-[40px] h-[40px] rounded-full mr-[10px]" : "w-[40px] h-[40px] rounded-full"}
                onClick={handleSettingsOpen}
                onError={(e) => (e.target.style.display = "none")}
              />
            ) : (
              <EmptyAvatar
                onClick={handleSettingsOpen}
                className={isMenuOpen ? "mr-[10px]" : ""}
                name={user.name}
              />
            )}
            <div className={!isMenuOpen ? "hidden" : undefined}>{user.name || "Albert"}</div>
          </div>
          <div
            onClick={handleWantLogout}
            className={`${!isMenuOpen && "my-[20px]"} p-[8px] hover-anim cursor-pointer`}
          >
            <FaSignOutAlt className="text-[18px]" />
          </div>
        </div>
      </div>
    </div>
  );
}
export default Sidebar;