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

import { getDate, getShortText } from "../Utils/Main.js";
import { useUserStore } from "../Store/Index.js";
import { useMailStore } from "../Store/Mail.js";

export default function MainWindow() {
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
  const loaderRef = useRef();

  // --- Mail store ---
  const {
    mails,
    hasMore,
    loading,
    init: initMails,
    loadMore,
    disconnect,
  } = useMailStore();

  const mailsPerPage = 50;
  const [currentPage, setCurrentPage] = useState(1);

  // Tabs config
  const tabs = {
    Inbox: { title: "Inbox", icon: <FaInbox /> },
    Sent: { title: "Sent", icon: <FaArrowCircleRight /> },
    Favorites: { title: "Favorites", icon: <FaBookmark /> },
  };

  // --- Effects ---
  // 1) Initialize mails + SSE
  useEffect(() => {
    initMails(mailsPerPage);
    return () => disconnect();
  }, [initMails, disconnect]);

  // 2) Handle window resize
  useEffect(() => {
    const onResize = () => {
      const desk = window.innerWidth >= 840;
      setIsDesktop(desk);
      setIsMenuOpen(desk);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // 3) Infinite scroll for older mails
  useEffect(() => {
    if (!loaderRef.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadMore(mailsPerPage);
        }
      },
      { rootMargin: "200px" }
    );
    obs.observe(loaderRef.current);
    return () => obs.disconnect();
  }, [loadMore]);

  // --- Handlers ---
  const handleMenuToggle = () => setIsMenuOpen((v) => !v);
  const handleLogoutConfirm = () => setWantLogout((v) => !v);
  const handleTabClick = (tab) => setActiveTab(tab);

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortType(e.target.value);
  };

  const handleSelect = (type, id) => {
    if (type === "all") {
      if (selectedMails.length === displayedMails.length) {
        setSelectedMails([]);
      } else {
        setSelectedMails(displayedMails.map((m) => m.id));
      }
    } else {
      setSelectedMails((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      );
    }
  };

  const handlePrevPage = () =>
    setCurrentPage((p) => Math.max(p - 1, 1));
  const handleNextPage = () =>
    setCurrentPage((p) => Math.min(p + 1, totalPages));

  // --- Filter, sort, paginate mails ---
  const filteredMails = mails.filter(({ from, subject, content }) => {
    const q = searchInput.toLowerCase();
    return (
      from.toLowerCase().includes(q) ||
      (subject || "").toLowerCase().includes(q) ||
      (content || "").toLowerCase().includes(q)
    );
  });

  const sortedMails = [...filteredMails].sort((a, b) => {
    switch (sortType) {
      case "newest":
        return new Date(b.date) - new Date(a.date);
      case "oldest":
        return new Date(a.date) - new Date(b.date);
      case "az":
        return a.from.localeCompare(b.from);
      case "za":
        return b.from.localeCompare(a.from);
      default:
        return 0;
    }
  });

  const totalPages = Math.max(
    Math.ceil(sortedMails.length / mailsPerPage),
    1
  );

  // reset page & selection when search or new mails
  useEffect(() => {
    setCurrentPage(1);
    setSelectedMails([]);
  }, [searchInput, mails.length]);

  const displayedMails = sortedMails.slice(
    (currentPage - 1) * mailsPerPage,
    currentPage * mailsPerPage
  );

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
          isMenuOpen ? "w-[260px] py-[20px] px-[12px]" : "w-[72px]"
        } h-full bg-container flex flex-col border-r border-stroke`}
      >
        <div className="flex flex-col items-center flex-grow">
          <div className="flex items-center w-full justify-between px-2">
            <FaBars
              onClick={handleMenuToggle}
              className="text-[24px] text-icons cursor-pointer"
            />
            {isMenuOpen ? <Logo /> : <SmallLogo />}
          </div>

          <Line className="my-6 w-full" />

          <Button
            className={`font-bold ${
              !isMenuOpen ? "w-[50px] justify-center" : ""
            }`}
            onClick={() => {}}
          >
            {isMenuOpen ? "New Message" : <FaRegPaperPlane />}
          </Button>

          <Line className="my-6 w-full" />

          {Object.keys(tabs).map((tab) => (
            <div
              key={tab}
              onClick={() => handleTabClick(tab)}
              className={`flex justify-between items-center my-1 w-full p-3 rounded-lg cursor-pointer hover:bg-bg-hover ${
                activeTab === tab ? "bg-bg-active font-bold" : "opacity-60"
              }`}
            >
              <div className="flex items-center">
                <div className="mr-2">{tabs[tab].icon}</div>
                {isMenuOpen && <span>{tabs[tab].title}</span>}
              </div>
              {isMenuOpen && <span>{filteredMails.length}</span>}
            </div>
          ))}
        </div>

        <div className="w-full p-4">
          <ThemeChanger className="mb-4" />
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <EmptyAvatar name={user.name} />
              {isMenuOpen && <span className="ml-2">{user.name}</span>}
            </div>
            <FaSignOutAlt
              onClick={handleLogoutConfirm}
              className="text-[18px] cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div
        className={`absolute top-0 ${contentPosition} h-full bg-main flex flex-col z-10 overflow-hidden`}
      >
        {/* Top bar */}
        <div className="absolute top-0 w-full flex items-center justify-between p-4">
          <InputSearch
            value={searchInput}
            onChange={handleSearchChange}
            className="max-w-[400px] w-full"
          />
          <div className="flex items-center space-x-4">
            <FaBell className="text-[22px] cursor-pointer" />
            <FaCog className="text-[22px] hidden md:block cursor-pointer" />
            <EmptyAvatar name={user.name} className="hidden md:block" />
          </div>
        </div>

        <Line className="mt-[72px]" />

        {/* Controls: select, refresh, sort, pagination */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            {selectedMails.length === displayedMails.length ? (
              <FaCheckSquare
                className="text-icons cursor-pointer"
                onClick={() => handleSelect("all")}
              />
            ) : (
              <FaRegSquare
                className="text-icons cursor-pointer"
                onClick={() => handleSelect("all")}
              />
            )}
            <FaEllipsisV className="text-icons cursor-pointer" />
            <FaSync className="text-icons cursor-pointer" onClick={() => loadMore(0)} />
          </div>
          <div className="flex items-center space-x-4">
            <SelectSort value={sortType} onChange={handleSortChange} />
            <FaArrowLeft
              onClick={handlePrevPage}
              className={`text-icons cursor-pointer ${
                currentPage === 1 ? "opacity-40 pointer-events-none" : ""
              }`}
            />
            <span className="text-text-secondary">
              {`${(currentPage - 1) * mailsPerPage + 1}-${
                Math.min(currentPage * mailsPerPage, sortedMails.length)
              } из ${sortedMails.length}`}
            </span>
            <FaArrowRight
              onClick={handleNextPage}
              className={`text-icons cursor-pointer ${
                currentPage === totalPages ? "opacity-40 pointer-events-none" : ""
              }`}
            />
          </div>
        </div>

        <Line />

        {/* Mail list */}
        <div className="overflow-y-auto flex-1 p-4">
          {displayedMails.map((mail, idx) => (
            <div key={mail.id}>
              {idx > 0 && <Line type="Long" className="my-4" />}
              <div className="flex items-center py-2">
                {/* selection */}
                {selectedMails.includes(mail.id) ? (
                  <FaCheckSquare
                    className="text-icons cursor-pointer mr-2"
                    onClick={() => handleSelect("id", mail.id)}
                  />
                ) : (
                  <FaRegSquare
                    className="text-icons cursor-pointer mr-2"
                    onClick={() => handleSelect("id", mail.id)}
                  />
                )}
                {/* favorite */}
                {mail.favorite ? (
                  <FaBookmark className="text-yellow-400 mr-2" />
                ) : (
                  <FaRegBookmark className="text-icons mr-2 cursor-pointer" />
                )}
                {/* from/subject/content */}
                <div className="flex-1">
                  <div className="flex items-center">
                    {!mail.viewed && <div className="w-2 h-2 rounded-full bg-primary mr-2" />}
                    <span
                      className={`${
                        mail.viewed ? "text-icons font-medium" : "text-text-primary font-bold"
                      }`}
                    >
                      {getShortText(mail.from, 20, false)}
                    </span>
                  </div>
                  <div className="ml-6">
                    <span
                      className={`${
                        mail.viewed ? "text-icons font-medium" : "text-text-primary font-bold"
                      }`}
                    >
                      {getShortText(mail.subject || "Без темы", 30, false)}
                    </span>
                  </div>
                  <div className="ml-6">
                    <span
                      className={`${
                        mail.viewed
                          ? "text-text-secondary font-medium"
                          : "text-text-secondary-60 font-bold"
                      }`}
                    >
                      {getShortText(mail.content, 80, true)}
                    </span>
                  </div>
                </div>
                {/* date */}
                <div className="w-[80px] text-right text-sm text-icons">
                  {getDate(mail.date)}
                </div>
              </div>
            </div>
          ))}

          {/* sentinel for infinite scroll */}
          {hasMore && !loading && (
            <div ref={loaderRef} className="text-center py-4">
              Загрузка старых…
            </div>
          )}
          {loading && (
            <div className="text-center py-4">Загрузка…</div>
          )}
        </div>
      </div>

      {/* Logout confirmation */}
      {wantLogout && (
        <div className="absolute inset-0 bg-bg-main z-40 flex items-center justify-center">
          <Clarification
            title="Logout"
            text="Are you sure you want to log out of your account?"
            buttonText="Exit"
            onClick={logoutUser}
            backButtonClick={handleLogoutConfirm}
          />
        </div>
      )}
    </div>
  );
}