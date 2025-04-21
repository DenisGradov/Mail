import { useEffect, useState } from "react";
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
  FaArrowRight, FaTrashAlt, FaEye,
} from "react-icons/fa";

import { useUserStore } from "../Store/Index.js";
import { useMailStore } from "../Store/Mail.js";
import { getDate, getShortText, stripHtml } from "../Utils/Main.js";
import SendEmail from "./Ui/SendEmail.jsx";
import {useMediaQuery} from "../hooks/useMediaQuery.js";
import MailView from "./Ui/MailView.jsx";

export default function MainWindow() {
  const { logoutUser, user } = useUserStore();
  const { inbox, sent, init, toggleFavorite,toggleViewed, bulkDelete, bulkViewed } = useMailStore();

  const [wantLogout, setWantLogout] = useState(false);
  const [isDesktop, setIsDesktop] = useState(useMediaQuery('(min-width: 840px)'));
  const [isMenuOpen, setIsMenuOpen] = useState(useMediaQuery('(min-width: 840px)'));
  const [activeTab, setActiveTab] = useState("Inbox");
  const [selectedMails, setSelectedMails] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [sortType, setSortType] = useState("newest");

  const [isMailOpen, setIsMailOpen] = useState(false);
  const handleMailOpen = (mail) => {

    toggleViewed(mail.id, true);
    setIsMailOpen(mail)
  }

  const [isContextWindowOpen, setIsContextWindowOpen] = useState({state: false, x:0,y:0, id: ""});
  const handleContextWindowOpen = (id, x, y) => {
    // Получаем ширину экрана и высоту окна
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Задаем отступы от курсора
    const menuOffsetX = 10; // Отступ по горизонтали
    const menuOffsetY = -10; // Отступ по вертикали

    // Определяем ширину и высоту контекстного меню (это зависит от содержимого)
    const menuWidth = 230; // Примерная ширина меню
    const menuHeight = 80; // Примерная высота меню

    // Рассчитываем новую позицию, учитывая ширину экрана
    const newX = x + menuOffsetX + menuWidth > windowWidth
      ? windowWidth - menuWidth - 10 // Если меню выходит за экран, сдвигаем влево
      : x + menuOffsetX;

    const newY = y + menuOffsetY + menuHeight > windowHeight
      ? windowHeight - menuHeight - 10 // Если меню выходит за экран, сдвигаем вверх
      : y + menuOffsetY;

    // Обновляем состояние с новыми координатами
    setIsContextWindowOpen({ state: true, id, x: newX, y: newY });
  };

  const handleContextAction = async (action) => {
    const ids = Array.isArray(isContextWindowOpen.id)
      ? isContextWindowOpen.id
      : [isContextWindowOpen.id];

    if (action === "delete") {
      await bulkDelete(ids);
    } else if (action === "read") {
      await bulkViewed(ids);
    }

    setSelectedMails([]); // сброс выделения
    setIsContextWindowOpen({ state: false, id: '', x: 0, y: 0 }); // закрытие меню
  };
  
  const [newMail, setNewMail] = useState(false);
  const handleNewMail = () => setNewMail((prev) => !prev);

  const mailsPerPage = 50;
  const [currentPage, setCurrentPage] = useState(1);

  // Собираем все письма для вкладки Favorites
  const allMails = [...inbox, ...sent];
  const favoriteCount = allMails.filter((m) => m.favorite).length;

  // Конфиг вкладок
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

  const handleMailUpdate = () => {
    init();
  };

  useEffect(() => {
    handleMailUpdate();
    const iv = setInterval(handleMailUpdate, 15000);
    return () => clearInterval(iv);
  }, [init]);
  useEffect(() => {
    if (!isMailOpen) return;  // ничего не показываем, если и так закрыто
    const all = [...inbox, ...sent];
    const fresh = all.find(m => m.id === isMailOpen.id);
    setIsMailOpen(fresh || false);
  }, [inbox, sent]);

  const openIndex = isMailOpen
    ? baseMails.findIndex(m => m.id === isMailOpen.id) + 1
    : null;
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

  const handleMenuOpen = () => setIsMenuOpen((prev) => !prev);
  const handleWantLogout = () => setWantLogout((prev) => !prev);
  const handleTabOpen = (tabKey) => {
    setActiveTab(tabKey);
    handleMailOpen(false);
  }
  const handleSearchInputUpdate = (e) => setSearchInput(e.target.value);
  const handleSortChange = (e) => setSortType(e.target.value);

  // Фильтрация, сортировка, пагинация
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
    setCurrentPage(1)
  }, [activeTab]);

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

  const handlePrevMail = () => {
    if (!isMailOpen) return;
    const idx = baseMails.findIndex(m => m.id === isMailOpen.id);
    if (idx > 0) {
      setIsMailOpen(baseMails[idx - 1]);
    }
  };

  const handleNextMail = () => {
    console.log('ss')
    if (!isMailOpen) return;
    const idx = baseMails.findIndex(m => m.id === isMailOpen.id);
    if (idx < baseMails.length - 1) {
      setIsMailOpen(baseMails[idx + 1]);
    }
  };

  const handlePrevPage = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const handleNextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

  // Классы для позиционирования контента
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
      {/* Sidebar */}
      <div
        className={`${
          isMenuOpen ? "w-[260px] py-[20px] px-[12px] items-center" : "w-[72px]"
        } h-full bg-container flex flex-col z-20 border-r border-stroke`}
      >
        <div className="flex flex-col items-center h-full">
          <div
            className={`${
              !isMenuOpen && "flex-col-reverse px-[10px]"
            } flex items-center w-full`}
          >
            <FaBars
              onClick={handleMenuOpen}
              className="text-[24px] text-icons hover-anim cursor-pointer"
            />
            <div className="scale-75">
              {isMenuOpen ? (
                <Logo />
              ) : (
                <SmallLogo
                  className={`${!isMenuOpen && "my-[20px]"} scale-125 duration-0 select-none`}
                />
              )}
            </div>
          </div>
          <Line className="my-[24px]" />
          <Button
            onClick={handleNewMail}
            className={`${!isMenuOpen && "w-[50px]"} font-bold`}
          >
            {isMenuOpen ? "New Message" : <FaRegPaperPlane className="text-[25px]" />}
          </Button>
          <Line className="mt-[24px] mb-[26.5px]" />
          {Object.keys(tabs).map((tab, i) => (
            <div
              onClick={() => handleTabOpen(tab)}
              key={`Tab #${i}`}
              className={`${
                isMenuOpen
                  ? "p-[12px] w-full rounded-[10px]"
                  : "p-[10px] px-[14px] rounded-[10px]"
              } ${
                activeTab === tab ? "bg-bg-active" : ""
              } hover-anim my-[2.5px] hover:bg-bg-hover opacity-50 flex justify-between items-center cursor-pointer`}
            >
              <div className="flex items-center">
                <div
                  className={`${
                    isMenuOpen ? "mr-[10px]" : "text-[25px] ml-[-3px]"
                  } ${
                    activeTab === tab ? "font-bold" : "text-icons"
                  } w-[20px]`}
                >
                  {tabs[tab].icon}
                </div>
                <div className={`${!isMenuOpen && "hidden"} ${
                  activeTab === tab ? "font-bold" : ""
                }`}>
                  {tabs[tab].title}
                </div>
              </div>
              <div className={`${!isMenuOpen && "hidden"} ${
                activeTab === tab ? "font-bold" : "text-icons"
              }`}>
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
              <EmptyAvatar className={isMenuOpen ? "mr-[10px]" : ""} name={user.name} />
              <div className={!isMenuOpen && "hidden"}>{user.name || "Albert"}</div>
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

      <div className={`absolute top-0 ${contentPosition} h-full bg-main flex flex-col z-10 overflow-hidden`}>
        <div
          className={`relative flex items-center ${!isMailOpen && "justify-center"} w-full py-[20px] px-[16px] h-[80px]  top-0 left-0 z-20 `}>
          {isMailOpen ? (
            <div className="text-[17px] font-bold left-[16px]">
              <FaArrowLeft
                onClick={() => handleMailOpen(false)}
                className="text-[32px] hover-anim cursor-pointer"
              />
            </div>
          ) : (
            <InputSearch
              value={searchInput}
              onChange={handleSearchInputUpdate}
              className="max-w-[400px] w-full"
            />
          )}

          <div className="absolute right-[16px] flex items-center space-x-[14px] h-[200px]">
            <FaBell className="text-[22px] hover-anim text-icons cursor-pointer"/>
            <FaCog className="text-[22px] hover-anim hidden 375px:block text-icons cursor-pointer"/>
            <EmptyAvatar
              className="w-[33px] h-[33px] hidden 450px:flex items-center justify-center select-none"
              name={user.name}
            />
          </div>
        </div>

        <div>
          <Line/>
        </div>
        <div
          className="470px:flex-row flex-col 375px:mx-[20px] my-[10px] flex justify-between 470px:items-center w-full">
          <div className="flex items-center">
            {!isMailOpen ? (
              <div className="flex items-center">
                {selectedMails.length === displayedMails.length ? (
                  <div onClick={() => handleSelectMails("all")} className="hover-anim cursor-pointer">
                    <FaCheckSquare className="text-icons text-[19px] m-[8px]"/>
                  </div>
                ) : (
                  <div onClick={() => handleSelectMails("all")} className="hover-anim cursor-pointer">
                    <FaRegSquare className="text-icons text-[19px] m-[8px]"/>
                  </div>
                )}
                <div className="hover-anim cursor-pointer">
                  <FaEllipsisV
                    onClick={(e) => {
                      e.stopPropagation();
                      const rect = e.currentTarget.getBoundingClientRect();
                      handleContextWindowOpen(selectedMails, rect.left, rect.bottom);
                    }}
                    className="text-icons text-[19px]"
                  />

                </div>
                <div onClick={handleMailUpdate} className="hover-anim cursor-pointer">
                  <FaSync className="text-icons text-[19px] m-[8px]"/>
                </div>
                {isContextWindowOpen.state && (
                  <div
                    className="absolute  840px:ml-[-240px] mt-[-20px] bg-container z-50 p-[5px] rounded-[10px] border border-stroke"
                    style={{top: isContextWindowOpen.y, left: isContextWindowOpen.x}}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div
                      className="flex items-center p-[4px] cursor-pointer hover-anim"
                      onClick={() => handleContextAction("delete")}
                    >
                      <FaTrashAlt className="text-icons text-[16px]"/>
                      <span className="ml-[5px] text-icons text-[16px]">Delete</span>
                    </div>
                    <Line/>
                    <div
                      className="flex items-center p-[4px] cursor-pointer hover-anim"
                      onClick={() => handleContextAction("read")}
                    >
                      <FaEye className="text-icons text-[16px]"/>
                      <span className="ml-[5px] text-icons text-[16px]">Read</span>
                    </div>
                  </div>
                )}

              </div>
            ) : (
              <div className="flex items-center justify-center">
                <FaTrashAlt className="text-icons text-[20px] hover-anim cursor-pointer"/>
                {activeTab !== "Sent" && <div className="ml-[10px] cursor-pointer">
                  {isMailOpen.favorite ? <FaBookmark
                    onClick={() => toggleFavorite(isMailOpen.id, false)} className="text-yellow-400"/> : <FaRegBookmark
                    onClick={() => toggleFavorite(isMailOpen.id, true)}/>}
                </div>}
              </div>
            )}


          </div>
          <div className="flex items-center justify-center space-x-3 select-none mr-[45px]">
            {!isMailOpen ? (
              <>
                <SelectSort value={sortType} onChange={handleSortChange}/>

                <div className="flex items-center ml-[3px]">
                  <FaArrowLeft
                    onClick={handlePrevPage}
                    className={`hover-anim cursor-pointer  ${currentPage === 1 && "opacity-40 pointer-events-none"}`}
                  />
                  <span className="text-text-secondary text-[15px] mx-[3px]">
          {`${rangeStart}-${rangeEnd} from ${filteredMails.length}`}
        </span>
                  <FaArrowRight
                    onClick={handleNextPage}
                    className={`hover-anim cursor-pointer z-40 ${currentPage === totalPages && "opacity-40 pointer-events-none"}`}
                  />
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <FaArrowLeft
                  onClick={handlePrevMail}
                  className={`text-[20px] hover-anim cursor-pointer ${openIndex === 1 ? "opacity-40 pointer-events-none" : ""}`}
                />
                <span className="text-text-secondary text-[15px]">
    {`${openIndex} of ${openTotal}`}
  </span>
                <FaArrowRight
                  onClick={handleNextMail}
                  className={`text-[20px] hover-anim cursor-pointer z-40 ${openIndex === openTotal ? "opacity-40 pointer-events-none" : ""}`}
                />
              </div>
            )}
          </div>

        </div>

        <div>
          <Line/>
        </div>
        {!isMailOpen && <div className="overflow-y-auto max-h-[calc(100vh-80px)] px-[16px] py-[20px]">
          <div className="mx-auto w-full px-[5px] overflow-y-auto overflow-x-hidden m-[10px]">
            {displayedMails.map((mail, mailIndex) => (
              <div key={`Mail #${mailIndex}`} className="w-full mx-[10px] px-[10px] pr-[25px]">
                <div
                  onClick={() => handleMailOpen(mail)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    handleContextWindowOpen([mail.id], e.clientX, e.clientY);
                  }}
                  className="hover:scale-100 hover:bg-bg-hover hover-anim cursor-pointer py-[10px]"
                >
                  {isDesktop ? (
                    <div className="flex items-center">
                      <div className="flex items-center flex-[25%]">
                        {selectedMails.includes(mail.id) ? (
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectMails("id", mail.id);
                            }}
                            className="cursor-pointer"
                          >
                            <FaCheckSquare className="text-icons text-[19px] hover-anim"/>
                          </div>
                        ) : (
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectMails("id", mail.id);
                            }}
                            className="cursor-pointer"
                          >
                            <FaRegSquare className="text-icons text-[19px] hover-anim"/>
                          </div>
                        )}
                        {activeTab !== "Sent" && (
                          <div
                            className="ml-[10px] cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(mail.id, !mail.favorite);
                            }}
                          >
                            {mail.favorite ? (
                              <FaBookmark className="text-yellow-400"/>
                            ) : (
                              <FaRegBookmark/>
                            )}
                          </div>
                        )}
                        <div
                          className={`${
                            mail.viewed ? "font-medium text-icons" : "font-bold text-text-primary"
                          } text-[17px] ml-[10px]`}
                        >
                          {getShortText(activeTab === "Sent" ? mail.to : mail.from || "none", 30, false)}
                        </div>
                      </div>
                      <div className="flex items-center flex-[60%]">
                        {activeTab !== "Sent" && (
                          <div
                            className={`${
                              mail.viewed ? "opacity-0" : "opacity-100"
                            } w-[8px] h-[8px] rounded-full bg-primary`}
                          />
                        )}
                        <div
                          className={`${
                            mail.viewed ? "font-medium text-icons" : "font-bold text-text-primary"
                          } mx-[10px] text-[17px]`}
                        >
                          {getShortText(mail.subject || "Без темы", 30, false)}
                        </div>
                        <div
                          className={`${
                            mail.viewed
                              ? "font-medium text-text-secondary"
                              : "font-bold text-text-secondary-60"
                          } text-[17px]`}
                        >
                          {getShortText(mail.text || stripHtml(mail.html) || "No text", 70, true)}
                        </div>
                      </div>
                      <div className="flex-[0.5%] text-center">{getDate(mail.date)}</div>
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      <div className="flex flex-col flex-1">
                        <div className="flex items-center">
                          <div
                            className={`${
                              mail.viewed ? "font-medium text-icons" : "font-bold text-text-primary"
                            } text-[17px]`}
                          >
                            {getShortText(mail.from || "none", 18, false)}
                          </div>
                        </div>
                        <div
                          className={`${
                            mail.viewed ? "font-medium text-icons" : "font-bold text-text-primary"
                          } text-[17px] mt-[4px]`}
                        >
                          {getShortText(mail.subject || "Без темы", 20, false)}
                        </div>
                        <div
                          className={`${
                            mail.viewed
                              ? "font-medium text-text-secondary"
                              : "font-bold text-text-secondary-60"
                          } text-[17px] mt-[4px]`}
                        >
                          {getShortText(mail.text || stripHtml(mail.html) || "No text", 20, true)}
                        </div>
                      </div>
                      <div className="flex items-center justify-between w-full bg">
                        <div className="flex items-center">
                          {selectedMails.includes(mail.id) ? (
                            <div onClick={() => handleSelectMails("id", mail.id)} className="cursor-pointer">
                              <FaCheckSquare className="text-icons text-[19px] hover-anim"/>
                            </div>
                          ) : (
                            <div onClick={() => handleSelectMails("id", mail.id)} className="cursor-pointer">
                              <FaRegSquare className="text-icons text-[19px] hover-anim"/>
                            </div>
                          )}
                          <div className="ml-2 cursor-pointer">
                            {mail.favorite ? (
                              <FaBookmark className="text-yellow-400" onClick={() => toggleFavorite(mail.id, false)}/>
                            ) : (
                              <FaRegBookmark onClick={() => toggleFavorite(mail.id, true)}/>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div
                            className={`${
                              mail.viewed ? "opacity-0" : "opacity-100"
                            } w-[8px] h-[8px] rounded-full bg-primary`}
                          />
                          <div className="ml-[10px]">{getDate(mail.date)}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className={`w-full h-[1px] bg-stroke`}/>
              </div>
            ))}
          </div>
        </div>
        }
        {isMailOpen && <MailView mail={isMailOpen}/>}
      </div>


      {newMail && (
        <div className="absolute inset-0  z-40 w-full h-full">
          <div className="w-full h-full bg-bg-main/60 backdrop-blur-sm"></div>
          <SendEmail handleNewMail={handleNewMail}/>
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
