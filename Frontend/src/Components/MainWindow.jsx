import { useEffect, useState } from "react";
import {
  FaInbox,
  FaArrowCircleRight,
  FaBookmark,
  FaRegPaperPlane,
} from "react-icons/fa";
import { useUserStore } from "../Store/Index.js";
import { useMailStore } from "../Store/Index.js";
import { useMediaQuery } from "../hooks/useMediaQuery.js";
import SendEmail from "./Ui/SendEmail.jsx";
import MailView from "./Ui/MailView.jsx";
import Settings from "./Ui/Settings.jsx";
import Clarification from "./Ui/Clarification.jsx";
import Sidebar from "./MainWindow/Sidebar.jsx";
import Header from "./MainWindow/Header.jsx";
import MailList from "./MainWindow/MailList.jsx";
import ContextMenu from "./MainWindow/ContextMenu.jsx";
import Pagination from "./MainWindow/Pagination.jsx";
import MailActions from "./MainWindow/MailActions.jsx";
import Line from "./Ui/Line.jsx";
import Authentication from "./Auth/Authentication.jsx";

export default function MainWindow() {
  const { logoutUser, user } = useUserStore();
  const { inbox, sent, init, toggleFavorite, toggleViewed, bulkDelete, bulkViewed } = useMailStore();
  const [wantLogout, setWantLogout] = useState(false);
  const [isDesktop, setIsDesktop] = useState(useMediaQuery('(min-width: 840px)'));
  const [isMenuOpen, setIsMenuOpen] = useState(useMediaQuery('(min-width: 840px)'));
  const [activeTab, setActiveTab] = useState("Inbox");
  const [selectedMails, setSelectedMails] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [sortType, setSortType] = useState("newest");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMailOpen, setIsMailOpen] = useState(false);
  const [isContextWindowOpen, setIsContextWindowOpen] = useState({ state: false, x: 0, y: 0, id: "" });
  const [newMail, setNewMail] = useState(false);
  const mailsPerPage = 50;
  const [currentPage, setCurrentPage] = useState(1);
  const allMails = [...inbox, ...sent];
  const favoriteCount = allMails.filter((m) => m.favorite).length;
  const tabs = {
    Inbox: { title: "Inbox", icon: <FaInbox />, value: inbox.length },
    Sent: { title: "Sent", icon: <FaArrowCircleRight />, value: sent.length },
    Favorites: { title: "Favorites", icon: <FaBookmark />, value: favoriteCount },
  };
  const baseMails =
    activeTab === "Inbox"
      ? inbox
      : activeTab === "Sent"
        ? sent
        : allMails.filter((m) => m.favorite);

  const handleSettingsOpen = () => {
    setIsSettingsOpen((prev) => !prev);
  };

  const handleMailOpen = (mail) => {
    if (!mail) return;
    toggleViewed(mail.id, true);
    setIsMailOpen(mail);
  };
  const handleMailClose = () => {
    setIsMailOpen(false);
  };

  const handleContextWindowOpen = (id, x, y) => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const menuOffsetX = 10;
    const menuOffsetY = -10;
    const menuWidth = 230;
    const menuHeight = 80;
    const newX = x + menuOffsetX + menuWidth > windowWidth ? windowWidth - menuWidth - 10 : x + menuOffsetX;
    const newY = y + menuOffsetY + menuHeight > windowHeight ? windowHeight - menuHeight - 10 : y + menuOffsetY;
    setIsContextWindowOpen({ state: true, id, x: newX, y: newY });
  };

  const handleContextAction = async (action) => {
    const ids = Array.isArray(isContextWindowOpen.id) ? isContextWindowOpen.id : [isContextWindowOpen.id];
    if (action === "delete") {
      await bulkDelete(ids);
    } else if (action === "read") {
      await bulkViewed(ids);
    }
    setSelectedMails([]);
    setIsContextWindowOpen({ state: false, id: '', x: 0, y: 0 });
  };

  const handleNewMail = () => setNewMail((prev) => !prev);

  const handleMailUpdate = () => {
    init();
  };

  useEffect(() => {
    handleMailUpdate();
    const iv = setInterval(handleMailUpdate, 15000);
    return () => clearInterval(iv);
  }, [init]);

  useEffect(() => {
    if (!isMailOpen) return;
    const all = [...inbox, ...sent];
    const fresh = all.find((m) => m.id === isMailOpen.id);
    setIsMailOpen(fresh || false);
  }, [inbox, sent]);

  const openIndex = isMailOpen ? baseMails.findIndex((m) => m.id === isMailOpen.id) + 1 : null;
  const openTotal = baseMails.length;

  useEffect(() => {
    const onResize = () => {
      const desk = window.innerWidth >= 840;
      setIsDesktop(desk);
      setIsMenuOpen(desk);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleWantLogout = () => setWantLogout((prev) => !prev);
  const handleTabOpen = (tabKey) => {
    setActiveTab(tabKey);
    setIsMailOpen(false);
    setIsSettingsOpen(false);
    setNewMail(false);
    setWantLogout(false);
    setIsContextWindowOpen({ state: false, id: '', x: 0, y: 0 });
  };
  const handleSearchInputUpdate = (e) => setSearchInput(e.target.value);
  const handleSortChange = (e) => setSortType(e.target.value);

  const filteredMails = baseMails.filter(({ from, subject, text, html }) => {
    const q = searchInput.toLowerCase();
    const combined = (from || "") + (subject || "") + (text || stripHtml(html));
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

  const totalPages = Math.max(Math.ceil(sortedMails.length / mailsPerPage), 1);

  useEffect(() => {
    setCurrentPage(1);
    setSelectedMails([]);
  }, [searchInput, inbox.length, sent.length]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const displayedMails = sortedMails.slice((currentPage - 1) * mailsPerPage, currentPage * mailsPerPage);
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
      setSelectedMails((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    }
  };

  const handlePrevMail = () => {
    if (!isMailOpen) return;
    const idx = baseMails.findIndex((m) => m.id === isMailOpen.id);
    if (idx > 0) {
      setIsMailOpen(baseMails[idx - 1]);
    }
  };

  const handleNextMail = () => {
    if (!isMailOpen) return;
    const idx = baseMails.findIndex((m) => m.id === isMailOpen.id);
    if (idx < baseMails.length - 1) {
      setIsMailOpen(baseMails[idx + 1]);
    }
  };

  const handlePrevPage = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const handleNextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

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

  useEffect(() => {
    const closeContextMenu = () => setIsContextWindowOpen({ state: false, id: '', x: 0, y: 0 });
    window.addEventListener('click', closeContextMenu);
    return () => window.removeEventListener('click', closeContextMenu);
  }, []);

  return (
    <div className="flex w-full h-full">
      <Sidebar
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        handleNewMail={handleNewMail}
        handleTabOpen={handleTabOpen}
        activeTab={activeTab}
        tabs={tabs}
        handleWantLogout={handleWantLogout}
        handleSettingsOpen={handleSettingsOpen}
      />
      <div className={`absolute top-0 ${contentPosition} h-full bg-main flex flex-col z-10 overflow-hidden`}>
        <Header
          isMailOpen={isMailOpen}
          isSettingsOpen={isSettingsOpen}
          handleMailOpen={handleMailOpen}
          handleMailClose={handleMailClose}
          handleSettingsOpen={handleSettingsOpen}
          searchInput={searchInput}
          handleSearchInputUpdate={handleSearchInputUpdate}
        />
        {!isSettingsOpen && (
          <>
            <Line />
            <div className="470px:flex-row flex-col 375px:mx-[20px] my-[10px] flex justify-between 470px:items-center w-full">
              <MailActions
                isMailOpen={isMailOpen}
                selectedMails={selectedMails}
                displayedMails={displayedMails}
                handleSelectMails={handleSelectMails}
                handleContextWindowOpen={handleContextWindowOpen}
                handleMailUpdate={handleMailUpdate}
                isMailOpenData={isMailOpen}
                activeTab={activeTab}
                toggleFavorite={toggleFavorite}
              />
              <Pagination
                isMailOpen={isMailOpen}
                sortType={sortType}
                handleSortChange={handleSortChange}
                currentPage={currentPage}
                totalPages={totalPages}
                rangeStart={rangeStart}
                rangeEnd={rangeEnd}
                filteredMails={filteredMails}
                handlePrevPage={handlePrevPage}
                handleNextPage={handleNextPage}
                openIndex={openIndex}
                openTotal={openTotal}
                handlePrevMail={handlePrevMail}
                handleNextMail={handleNextMail}
              />
            </div>
            <Line />
          </>
        )}
        {!isMailOpen && !isSettingsOpen && (
          <MailList
            isMailOpen={isMailOpen}
            activeTab={activeTab}
            displayedMails={displayedMails}
            selectedMails={selectedMails}
            handleSelectMails={handleSelectMails}
            handleMailOpen={handleMailOpen}
            handleContextWindowOpen={handleContextWindowOpen}
            toggleFavorite={toggleFavorite}
            isDesktop={isDesktop}
          />
        )}
        {isMailOpen && <MailView mail={isMailOpen} />}
        {isSettingsOpen && (
          <div className="flex-1 overflow-y-auto">
            <Settings />
          </div>
        )}
        <ContextMenu isContextWindowOpen={isContextWindowOpen} handleContextAction={handleContextAction} />
      </div>
      {newMail && (
        <div className="absolute inset-0 z-40 w-full h-full">
          <div className="w-full h-full bg-bg-main/60 backdrop-blur-sm"></div>
          <SendEmail handleNewMail={handleNewMail} />
        </div>
      )}
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