import Logo from "./Ui/Logo.jsx";
import {
  FaBars,
  FaInbox,
  FaArrowCircleRight,
  FaBookmark,
  FaSignOutAlt,
  FaRegPaperPlane,
  FaBell,
  FaCog,
  FaRegSquare, FaCheckSquare, FaSync, FaEllipsisV, FaArrowLeft, FaArrowRight, FaRegBookmark
} from 'react-icons/fa';
import Line from "./Ui/Line.jsx";
import Button from "./Ui/Button.jsx";
import {useEffect, useState} from "react";
import ThemeChanger from "./ThemeChanger.jsx";
import EmptyAvatar from "./Ui/EmptyAvatar.jsx";
import Clarification from "./Ui/Clarification.jsx";
import {useUserStore} from "../Store/Index.js";
import SmallLogo from "./Ui/SmallLogo.jsx";
import InputSearch from "./Ui/InputSearch.jsx";
import exampleMails from "../Data/exampleMails.js";
import {getDate, getShortText} from "../Utils/Main.js";
import SelectSort from "./Ui/SelectSort.jsx";

function MainWindow() {

  const [activeTab, setActiveTab] = useState("Inbox");
  const [isMenuOpen, setIsMenuOpen] = useState(window.innerWidth >= 840);
  const [wantLogout, setWantLogout] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 840);
  const [selectedMails, setSelectedMails] = useState([]);

  const handleSelectMails = (type, id) => {
    if (type === "all") {
      if (selectedMails.length === exampleMails.length) {
        setSelectedMails([]);
      } else {
        setSelectedMails(exampleMails.map(mail => mail.id));
      }
    } else {
      setSelectedMails(prev => {
        const isSelected = prev.includes(id);
        return isSelected ? prev.filter(mailId => mailId !== id) : [...prev, id];
      });
    }
  };


  const {logoutUser, user} = useUserStore();

  const tabs = {
    Inbox: {title: "Inbox", icon: <FaInbox/>, value: 10},
    Sent: {title: "Sent", icon: <FaArrowCircleRight/>, value: 10},
    Favorites: {title: "Favorites", icon: <FaBookmark/>, value: 10},
  };

  const handleNewMessage = () => {
  };
  const handleTabOpen = (tabKey) => setActiveTab(tabKey);
  const handleWantLogout = () => setWantLogout((prev) => !prev);
  const handleMenuOpen = () => setIsMenuOpen((prev) => !prev);

  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 840);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const [searchInput, setSearchInput] = useState("");
  const handleSearchInputUpdate = (e) => {
    const {type, value: val, checked} = e.target;
    setSearchInput(type === 'checkbox' ? checked : val);
  };

  const desktopOpen = "left-[260px] w-[calc(100%-260px)]";
  const desktopClosed = "left-[72px] w-[calc(100%-72px)]";
  const mobileOpen = "left-0 w-full";
  const mobileClosed = "left-[72px] w-[calc(100%-72px)]";

  const contentPosition = isDesktop
    ? (isMenuOpen ? desktopOpen : desktopClosed)
    : (isMenuOpen ? mobileOpen : mobileClosed);


  const mailsPerPage = 50;
  const [currentPage, setCurrentPage] = useState(1);

  const filteredMails = exampleMails.filter(({from, subject, content}) => {
    const q = searchInput.toLowerCase();
    return (
      from.toLowerCase().includes(q) ||
      (subject || "").toLowerCase().includes(q) ||
      (content || "").toLowerCase().includes(q)
    );
  });


  const rangeStart = (currentPage - 1) * mailsPerPage + 1;
  const rangeEnd = Math.min(currentPage * mailsPerPage, filteredMails.length);

  useEffect(() => {
    setCurrentPage(1);
    setSelectedMails([]);
  }, [searchInput, exampleMails]);


  const [sortType, setSortType] = useState("newest");

  const handleSortChange = (e) => {
    setSortType(e.target.value);
  };
  const sortedMails = filteredMails.sort((a, b) => {
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

  const totalPages = Math.max(Math.ceil(sortedMails.length / mailsPerPage), 1);
  const displayedMails = sortedMails.slice(
    (currentPage - 1) * mailsPerPage,
    currentPage * mailsPerPage
  );

  const handlePrevPage = () =>
    setCurrentPage((p) => Math.max(p - 1, 1));
  const handleNextPage = () =>
    setCurrentPage((p) => Math.min(p + 1, totalPages));


  return (
    <div className="flex w-full h-full">
      <div
        className={`${isMenuOpen ? "w-[260px] py-[20px] px-[12px] items-center" : "w-[72px]"} h-full bg-container flex flex-col z-20 border-r border-stroke`}>
        <div className="flex flex-col items-center h-full">
          <div className={`${!isMenuOpen && "flex-col-reverse px-[10px]"} flex items-center w-full`}>
            <FaBars onClick={handleMenuOpen} className="text-[24px] text-icons hover-anim"/>
            <div className="scale-75">
              {isMenuOpen ? <Logo/> :
                <SmallLogo className={`${!isMenuOpen && "my-[20px]"} scale-125 duration-0 select-none`}/>}
            </div>
          </div>
          <Line className="my-[24px]"/>
          <Button onClick={handleNewMessage} className={`${!isMenuOpen && "w-[50px]"}  font-bold`}>
            {isMenuOpen ? "New Message" : <FaRegPaperPlane className="text-[25px]"/>}
          </Button>
          <Line className="mt-[24px] mb-[26.5px]"/>
          {Object.keys(tabs).map((tab, i) => (
            <div
              onClick={() => handleTabOpen(tab)}
              className={`${isMenuOpen ? "p-[12px] w-full rounded-[10px]" : "p-[10px] px-[14px] rounded-[10px]"} ${activeTab === tab ? "bg-bg-active" : ""} hover-anim my-[2.5px] hover:bg-bg-hover opacity-50 flex justify-between items-center`}
              key={`Tab #${i}`}>
              <div className="flex items-center">
                <div
                  className={`${isMenuOpen ? "mr-[10px]" : "text-[25px] ml-[-3px]"} ${activeTab === tab ? "font-bold" : "text-icons"} w-[20px]`}>{tabs[tab].icon}</div>
                <div
                  className={`${!isMenuOpen && "hidden"} ${activeTab === tab ? "font-bold" : ""}`}>{tabs[tab].title}</div>
              </div>
              <div className={`${!isMenuOpen && "hidden"} ${activeTab === tab ? "font-bold" : "text-icons"}`}>
                {tabs[tab].value}
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col w-full">
          <ThemeChanger className={`${!isMenuOpen && "rotate-90"}`}/>
          <Line className={`${!isMenuOpen && "mt-[40px]"} my-[20px]`}/>
          <div className={`${!isMenuOpen && "flex-col"} flex justify-between items-center`}>
            <div className="flex items-center">
              <EmptyAvatar className={isMenuOpen && "mr-[10px]"} name={user.name}/>
              <div className={!isMenuOpen && "hidden"}>{user.name || "Albert"}</div>
            </div>
            <div onClick={handleWantLogout} className={`${!isMenuOpen && "my-[20px]"} p-[8px] hover-anim`}>
              <FaSignOutAlt className="text-[18px]"/>
            </div>
          </div>
        </div>
      </div>

      <div className={`absolute top-0 ${contentPosition} h-full bg-main flex flex-col z-10 overflow-hidden`}>
        <div className="absolute flex 840px:justify-center justify-end items-center w-full py-[20px] px-[16px]">
          <InputSearch
            value={searchInput}
            onChange={handleSearchInputUpdate}
            className="max-w-[400px] 840px:w-full"
          />
          <div
            className="840px:absolute 840px:right-[16px] flex items-center 450px:gap-[14px] gap-[5px] ml-[5px] 450px:ml-[30px]">
            <FaBell className="text-[22px] hover-anim text-icons"/>
            <FaCog className="text-[22px] hover-anim hidden 375px:block text-icons"/>
            <EmptyAvatar className="w-[40px] h-[40px]  justify-center items-center hover-anim hidden 450px:flex"
                         name={user.name}/>
          </div>
        </div>
        <Line className="mt-[91px]"/>
        <div className="470px:flex-row flex-col 375px:mx-[20px] my-[10px] flex justify-between 470px:items-center">
          <div className="flex items-center">
            <div>
              {selectedMails.length === exampleMails.length ?
                <div onClick={() => handleSelectMails("all")} className="hover-anim">
                  <FaCheckSquare className="text-icons text-[19px] m-[8px]"/>
                </div> :
                <div onClick={() => handleSelectMails("all")} className="hover-anim">
                  <FaRegSquare className="text-icons text-[19px] m-[8px]"/>
                </div>
              }

            </div>

            <div className=" hover-anim">
              <FaEllipsisV className="text-icons text-[19px]"/></div>
            <div className=" hover-anim">
              <FaSync className="text-icons text-[19px] m-[8px]"/></div>

          </div>
          <div className="flex items-center justify-between 470px:justify-center">
            <SelectSort value={sortType} onChange={handleSortChange}/>
            <div className="flex items-center">
              <div
                onClick={handlePrevPage}
                className={`hover-anim ${currentPage === 1 && "opacity-40 pointer-events-none"}`}
              >
                <FaArrowLeft className="text-icons text-[19px] m-[8px]"/>
              </div>
              <span className="text-text-secondary text-[15px]">
    {`${rangeStart}-${rangeEnd} из ${filteredMails.length}`}
  </span>
              <div
                onClick={handleNextPage}
                className={`hover-anim ${currentPage === totalPages && "opacity-40 pointer-events-none"}`}
              >
                <FaArrowRight className="text-icons text-[19px] m-[8px]"/>
              </div>
            </div>
          </div>
        </div>
        <Line className=""/>
        <div className="mx-auto w-full px-[5px] overflow-y-auto overflow-x-hidden m-[10px]">

          {displayedMails.map((mail, mailIndex) => (
            <div className="w-full mx-[10px] px-[10px] pr-[25px]" key={`Mail #${mailIndex}`}>
              <Line type="Long" className={`${mailIndex === 0 && "hidden"} ml-[-30px] my-[10px]`}/>
              {isDesktop ? (
                <div className="flex items-center">
                  <div className="flex items-center flex-[25%]">
                    {selectedMails.includes(mail.id) ? (
                      <div onClick={() => handleSelectMails("id", mail.id)}>
                        <FaCheckSquare className="text-icons text-[19px] hover-anim"/>
                      </div>
                    ) : (
                      <div onClick={() => handleSelectMails("id", mail.id)}>
                        <FaRegSquare className="text-icons text-[19px] hover-anim"/>
                      </div>
                    )}
                    <div className="ml-[10px]">
                      {mail.favorite ? (
                        <div className="p-[2px] hover-anim">
                          <FaBookmark className="text-yellow-400"/>
                        </div>
                      ) : (
                        <div className="p-[2px] hover-anim">
                          <FaRegBookmark className="text-icons"/>
                        </div>
                      )}
                    </div>
                    <div
                      className={`${mail.viewed ? "font-medium text-icons" : "font-bold text-text-primary"} text-[17px] ml-[10px]`}>
                      {getShortText(mail.from || "none", 20, false)}
                    </div>
                  </div>

                  <div className="flex items-center flex-[60%]">
                    <div
                      className={`${mail.viewed ? "opacity-0" : "opacity-100"} w-[8px] h-[8px] rounded-full bg-primary`}/>
                    <div
                      className={`${mail.viewed ? "font-medium text-icons" : "font-bold text-text-primary"} mx-[10px] text-[17px]`}>
                      {getShortText(mail.subject || "Without subject", 30, false)}
                    </div>
                    <div
                      className={`${mail.viewed ? "font-medium text-text-secondary" : "font-bold text-text-secondary-60"} text-[17px]`}>
                      {getShortText(mail.content + mail.content || "No text", 80, true)}
                    </div>
                  </div>

                  <div className="flex-[0.5%] text-center">{getDate(mail.date)}</div>
                </div>
              ) : (
                <div className="flex flex-col">
                  <div className="flex flex-col flex-1">
                    <div className="flex items-center">

                      <div
                        className={`${mail.viewed ? "font-medium text-icons" : "font-bold text-text-primary"} text-[17px]`}>
                        {getShortText(mail.from || "Without subject", 18, false)}
                      </div>
                    </div>
                    <div
                      className={`${mail.viewed ? "font-medium text-icons" : "font-bold text-text-primary"} text-[17px] mt-[4px]`}>
                      {getShortText(mail.subject || "Without subject", 20, false)}
                    </div>
                    <div
                      className={`${mail.viewed ? "font-medium text-text-secondary" : "font-bold text-text-secondary-60"} text-[17px] mt-[4px]`}>
                      {getShortText(mail.content || "No text", 20, true)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full bg">
                    <div className="flex items-center">
                      {selectedMails.includes(mail.id) ? (
                        <div onClick={() => handleSelectMails("id", mail.id)}>
                          <FaCheckSquare className="text-icons text-[19px] hover-anim"/>
                        </div>
                      ) : (
                        <div onClick={() => handleSelectMails("id", mail.id)}>
                          <FaRegSquare className="text-icons text-[19px] hover-anim"/>
                        </div>
                      )}
                      <div className="justify-items-end">
                        {mail.favorite ? (
                          <div className="p-[2px] hover-anim">
                            <FaBookmark className="text-yellow-400"/>
                          </div>
                        ) : (
                          <div className="p-[2px] hover-anim">
                            <FaRegBookmark className="text-icons"/>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div
                        className={`${mail.viewed ? "opacity-0" : "opacity-100"} w-[8px] h-[8px] rounded-full bg-primary`}/>
                      <div className="ml-[10px]">{getDate(mail.date)}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}


        </div>
      </div>

      {wantLogout && (
        <div className="absolute w-full h-full top-0 left-0 bg-bg-main z-40">
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

export default MainWindow;
