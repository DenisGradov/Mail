// src/Components/MainWindow.jsx
import { useEffect, useState, useRef } from "react";
import Logo from "./Ui/Logo.jsx";
import SmallLogo from "./Ui/SmallLogo.jsx";
import Line from "./Ui/Line.jsx";
import Button from "./Ui/Button.jsx";
import InputSearch from "./Ui/InputSearch.jsx";
import SelectSort from "./Ui/SelectSort.jsx";
import ThemeChanger from "./ThemeChanger.jsx";
import EmptyAvatar from "./Ui/EmptyAvatar.jsx";
import Clarification from "./Ui/Clarification.jsx";

import {
  FaBars,
  FaInbox,
  FaArrowCircleRight,
  FaBookmark,
  FaRegBookmark,
  FaSignOutAlt,
  FaRegPaperPlane,
  FaBell,
  FaCog,
  FaRegSquare,
  FaCheckSquare,
  FaSync,
  FaEllipsisV,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";

import { useUserStore } from "../Store/Index.js";
import { useMailStore } from "../Store/Mail.js";
import {getShortText, stripHtml} from "../Utils/Main.js";

export default function MainWindow() {
  // Full date formatter
  function formatDateFull(dateStr) {
    return new Date(dateStr).toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }

  // --- Auth & User ---
  const { logoutUser, user } = useUserStore();

  // --- UI state ---
  const [wantLogout, setWantLogout] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 840);
  const [isMenuOpen, setIsMenuOpen] = useState(window.innerWidth >= 840);
  const [activeTab, setActiveTab] = useState("Inbox");
  const [selectedMails, setSelectedMails] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [sortType, setSortType] = useState("newest");

  // --- Mail store ---
  const {
    mails,
    init: initMails,
  } = useMailStore();

  const mailsPerPage = 50;
  const [currentPage, setCurrentPage] = useState(1);

  // Tabs config
  const tabs = {
    Inbox: { title: "Inbox", icon: <FaInbox />, value: mails.length },
    Sent: { title: "Sent", icon: <FaArrowCircleRight />, value: 0 },
    Favorites: { title: "Favorites", icon: <FaBookmark />, value: 0 },
  };

  // Initialize mails once
  useEffect(() => {
    initMails(mailsPerPage);
  }, [initMails]);

  // Handle window resize
  useEffect(() => {
    const onResize = () => {
      const desk = window.innerWidth >= 840;
      setIsDesktop(desk);
      setIsMenuOpen(desk);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // --- Handlers ---
  const handleMenuOpen = () => setIsMenuOpen((prev) => !prev);
  const handleWantLogout = () => setWantLogout((prev) => !prev);
  const handleTabOpen = (tabKey) => setActiveTab(tabKey);
  const handleSearchInputUpdate = (e) => setSearchInput(e.target.value);
  const handleSortChange = (e) => setSortType(e.target.value);

  // --- Filter, sort, paginate mails ---
  const filteredMails = mails.filter(({ from, subject, text, html }) => {
    const q = searchInput.toLowerCase();
    const combined =
      (from || "") + (subject || "") + (text || stripHtml(html));
    return combined.toLowerCase().includes(q);
  });

  const sortedMails = [...filteredMails].sort((a, b) => {
    switch (sortType) {
      case "newest":
        return new Date(b.date) - new Date(a.date);
      case "oldest":
        return new Date(a.date) - new Date(b.date);
      case "az":
        return (a.from || "").localeCompare(b.from || "");
      case "za":
        return (b.from || "").localeCompare(a.from || "");
      default:
        return 0;
    }
  });

  const totalPages = Math.max(
    Math.ceil(sortedMails.length / mailsPerPage),
    1
  );

  useEffect(() => {
    setCurrentPage(1);
    setSelectedMails([]);
  }, [searchInput, mails.length]);

  const displayedMails = sortedMails.slice(
    (currentPage - 1) * mailsPerPage,
    currentPage * mailsPerPage
  );

  const rangeStart = (currentPage - 1) * mailsPerPage + 1;
  const rangeEnd = Math.min(currentPage * mailsPerPage, sortedMails.length);

  const handleSelectMails = (type, id) => {
    if (type === "all") {
      if (selectedMails.length === displayedMails.length) {
        setSelectedMails([]);
      } else {
        setSelectedMails(displayedMails.map((mail) => mail.id));
      }
    } else {
      setSelectedMails((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      );
    }
  };

  const handlePrevPage = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const handleNextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

  // --- Layout classes ---
  const desktopOpen = "left-[260px] w-[calc(100%-260px)]";
  const desktopClosed = "left-[72px] w-[calc(100%-72px)]";
  const mobileOpen = "left-0 w-full";
  const mobileClosed = "left-[72px] w-[calc(100%-72px)]";
  const contentPosition = isDesktop
    ? isMenuOpen
      ? desktopOpen
      : desktopClosed
    : isMenuOpen
      ? mobileOpen
      : mobileClosed;

  return (
    <div className="flex w-full h-full">
      {/* Sidebar */}
      <div
        className={`${
          isMenuOpen ? "w-[260px] py-[20px] px-[12px] items-center" : "w-[72px]"
        } h-full bg-container flex flex-col z-20 border-r border-stroke`}
      >
        <div className="flex flex-col items-center h-full">
          <div
            className={`${!isMenuOpen && "flex-col-reverse px-[10px]"} flex items-center w-full`}
          >
            <FaBars onClick={handleMenuOpen} className="text-[24px] text-icons hover-anim cursor-pointer" />
            <div className="scale-75">
              {isMenuOpen ? <Logo /> : <SmallLogo className={`${!isMenuOpen && "my-[20px]"} scale-125 duration-0 select-none`} />}
            </div>
          </div>
          <Line className="my-[24px]" />
          <Button onClick={() => {}} className={`${!isMenuOpen && "w-[50px]"} font-bold`}>
            {isMenuOpen ? "New Message" : <FaRegPaperPlane className="text-[25px]" />}
          </Button>
          <Line className="mt-[24px] mb-[26.5px]" />
          {Object.keys(tabs).map((tab, i) => (
            <div
              onClick={() => handleTabOpen(tab)}
              key={`Tab #${i}`}
              className={`${isMenuOpen ? "p-[12px] w-full rounded-[10px]" : "p-[10px] px-[14px] rounded-[10px]"} ${activeTab === tab ? "bg-bg-active" : ""} hover-anim my-[2.5px] hover:bg-bg-hover opacity-50 flex justify-between items-center cursor-pointer`}
            >
              <div className="flex items-center">
                <div className={`${isMenuOpen ? "mr-[10px]" : "text-[25px] ml-[-3px]"} ${activeTab === tab ? "font-bold" : "text-icons"} w-[20px]`}>
                  {tabs[tab].icon}
                </div>
                <div className={`${!isMenuOpen && "hidden"} ${activeTab === tab ? "font-bold" : ""}`}>{tabs[tab].title}</div>
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
              <EmptyAvatar className={isMenuOpen && "mr-[10px]"} name={user.name} />
              <div className={!isMenuOpen && "hidden"}>{user.name || "Albert"}</div>
            </div>
            <div onClick={handleWantLogout} className={`${!isMenuOpen && "my-[20px]"} p-[8px] hover-anim cursor-pointer`}>
              <FaSignOutAlt className="text-[18px]" />
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className={`absolute top-0 ${contentPosition} h-full bg-main flex flex-col z-10 overflow-hidden`}>
        <div className="absolute flex 840px:justify-center justify-end items-center w-full py-[20px] px-[16px]">
          <InputSearch value={searchInput} onChange={handleSearchInputUpdate} className="max-w-[400px] 840px:w-full" />
          <div className="840px:absolute 840px:right-[16px] flex items-center 450px:gap-[14px] gap-[5px] ml-[5px] 450px:ml-[30px]">
            <FaBell className="text-[22px] hover-anim text-icons cursor-pointer" />
            <FaCog className="text-[22px] hover-anim hidden 375px:block text-icons cursor-pointer" />
            <EmptyAvatar className="w-[40px] h-[40px] hidden 450px:flex" name={user.name} />
          </div>
        </div>
        <Line className="mt-[91px]" />
        <div className="470px:flex-row flex-col 375px:mx-[20px] my-[10px] flex justify-between 470px:items-center">
          <div className="flex items-center">
            {selectedMails.length === displayedMails.length ? (
              <div onClick={() => handleSelectMails("all")} className="hover-anim cursor-pointer">
                <FaCheckSquare className="text-icons text-[19px] m-[8px]" />
              </div>
            ) : (
              <div onClick={() => handleSelectMails("all")} className="hover-anim cursor-pointer">
                <FaRegSquare className="text-icons text-[19px] m-[8px]" />
              </div>
            )}
            <div className="hover-anim cursor-pointer">
              <FaEllipsisV className="text-icons text-[19px]" />
            </div>
            <div className="hover-anim cursor-pointer">
              <FaSync className="text-icons text-[19px] m-[8px]" />
            </div>
          </div>
          <div className="flex items-center justify-between 470px:justify-center">
            <SelectSort value={sortType} onChange={handleSortChange} />
            <div className="flex items-center">
              <FaArrowLeft
                onClick={handlePrevPage}
                className={`hover-anim cursor-pointer ${currentPage === 1 && "opacity-40 pointer-events-none"}`}
              />
              <span className="text-text-secondary text-[15px]">
                {`${rangeStart}-${rangeEnd} из ${filteredMails.length}`}
              </span>
              <FaArrowRight
                onClick={handleNextPage}
                className={`hover-anim cursor-pointer ${currentPage === totalPages && "opacity-40 pointer-events-none"}`}
              />
            </div>
          </div>
        </div>
        <Line />
        <div className="mx-auto w-full px-[5px] overflow-y-auto overflow-x-hidden m-[10px]">
          {displayedMails.map((mail, mailIndex) => (
            <div className="w-full mx-[10px] px-[10px] pr-[25px]" key={`Mail #${mailIndex}`}>
              <Line type="Long" className={`${mailIndex === 0 && "hidden"} ml-[-30px] my-[10px]`} />
              {isDesktop ? (
                <div className="flex items-center">
                  <div className="flex items-center flex-[25%]">
                    {selectedMails.includes(mail.id) ? (
                      <div onClick={() => handleSelectMails("id", mail.id)} className="cursor-pointer">
                        <FaCheckSquare className="text-icons text-[19px] hover-anim" />
                      </div>
                    ) : (
                      <div onClick={() => handleSelectMails("id", mail.id)} className="cursor-pointer">
                        <FaRegSquare className="text-icons text-[19px] hover-anim" />
                      </div>
                    )}
                    <div className="ml-[10px] cursor-pointer">
                      {mail.favorite ? <FaBookmark className="text-yellow-400" /> : <FaRegBookmark />}
                    </div>
                    <div className={`${mail.viewed ? "font-medium text-icons" : "font-bold text-text-primary"} text-[17px] ml-[10px]`}>
                      {getShortText(mail.from || "none", 20, false)}
                    </div>
                  </div>
                  <div className="flex items-center flex-[60%]">
                    <div className={`${mail.viewed ? "opacity-0" : "opacity-100"} w-[8px] h-[8px] rounded-full bg-primary`} />
                    <div className={`${mail.viewed ? "font-medium text-icons" : "font-bold text-text-primary"} mx-[10px] text-[17px]`}>
                      {getShortText(mail.subject || "Без темы", 30, false)}
                    </div>
                    <div className={`${mail.viewed ? "font-medium text-text-secondary" : "font-bold text-text-secondary-60"} text-[17px]`}>
                      {getShortText(
                        mail.text || stripHtml(mail.html) || "No text",
                        80,
                        true
                      )}
                    </div>
                  </div>
                  <div className="flex-[0.5%] text-center">{formatDateFull(mail.date)}</div>
                </div>
              ) : (
                <div className="flex flex-col">
                  <div className="flex flex-col flex-1">
                    <div className="flex items-center">
                      <div className={`${mail.viewed ? "font-medium text-icons" : "font-bold text-text-primary"} text-[17px]`}>
                        {getShortText(mail.from || "none", 18, false)}
                      </div>
                    </div>
                    <div className={`${mail.viewed ? "font-medium text-icons" : "font-bold text-text-primary"} text-[17px] mt-[4px]`}>
                      {getShortText(mail.subject || "Без темы", 20, false)}
                    </div>
                    <div className={`${mail.viewed ? "font-medium text-text-secondary" : "font-bold text-text-secondary-60"} text-[17px] mt-[4px]`}>
                      {getShortText(mail.text || stripHtml(mail.html) || "No text", 20, true)}
                    </div>
                  </div>
                  <div className="flex items-center justify-between w-full bg">
                    <div className="flex items-center">
                      {selectedMails.includes(mail.id) ? (
                        <div onClick={() => handleSelectMails("id", mail.id)} className="cursor-pointer">
                          <FaCheckSquare className="text-icons text-[19px] hover-anim" />
                        </div>
                      ) : (
                        <div onClick={() => handleSelectMails("id", mail.id)} className="cursor-pointer">
                          <FaRegSquare className="text-icons text-[19px] hover-anim" />
                        </div>
                      )}
                      <div className="ml-2 cursor-pointer">
                        {mail.favorite ? <FaBookmark className="text-yellow-400" /> : <FaRegBookmark />}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className={`${mail.viewed ? "opacity-0" : "opacity-100"} w-[8px] h-[8px] rounded-full bg-primary`} />
                      <div className="ml-[10px]">{formatDateFull(mail.date)}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {wantLogout && (
        <div className="absolute inset-0 bg-bg-main z-40">
          <Clarification
            title="Logout"
            text="Are you sure you want to log out of your account?"
            buttonText="Exit"
            onClick={logoutUser}
            backButtonClick={handleWantLogout}
          />
        </div>
      )}
    </div>
  );
}
