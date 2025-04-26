import { useState, useEffect } from "react";
import {
  FaArrowDown,
  FaArrowLeft,
  FaArrowRight,
  FaCheckCircle,
  FaBan,
  FaCrown,
  FaSync,
  FaInbox,
  FaUsers,
  FaUser,
  FaSnowflake,
  FaShieldAlt,
  FaPaperPlane,
} from "react-icons/fa";
import InputSearch from "../Ui/InputSearch.jsx";
import EmptyAvatar from "../Ui/EmptyAvatar.jsx";
import Button from "../Ui/Button.jsx";
import Input from "../Ui/Input.jsx";
import InputLabel from "../Ui/InputLabel.jsx";
import { getUsers, addUser, getUserStats } from "../../Api/UserApi";
import { getDomains } from "../../Api/Main";
import { useLoaderStore } from "../../Store/Loader.js";
import { getShortText } from "../../Utils/Main.js";
import { useUserStore } from "../../Store/Index.js";

function Users() {
  const { showLoader, hideLoader } = useLoaderStore();
  const { user: currentUser } = useUserStore();
  const [searchInput, setSearchInput] = useState("");
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [usersOnPage, setUsersOnPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addUserData, setAddUserData] = useState({
    email: "",
    login: "",
    password: "",
    status: 1,
    name: "",
    surname: "",
    domain: "",
  });
  const [addError, setAddError] = useState("");
  const [domains, setDomains] = useState([]);
  const [error, setError] = useState("");
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  const [stats, setStats] = useState([
    { title: "Пользователи", icon: <FaUsers />, value: 0 },
    { title: "Онлайн", icon: <FaUser />, value: 0 },
    { title: "Замороженные", icon: <FaSnowflake />, value: 0 },
    { title: "С 2FA", icon: <FaShieldAlt />, value: 0 },
    { title: "Полученные", icon: <FaInbox />, value: 0 },
    { title: "Отправленные", icon: <FaPaperPlane />, value: 0 },
  ]);

  const usersCanBeOnPage = [5, 10, 50, 100, 200, 500];

  const fetchData = async () => {
    try {
      showLoader();
      const userData = await getUsers(undefined, currentPage, searchInput);
      setUsers(userData.users);
      setTotalUsers(userData.total);
      const domainData = await getDomains();
      setDomains(domainData.domains);
      setAddUserData((prev) => ({ ...prev, domain: domainData.domains[0] || "" }));

      // Загружаем статистику
      const statsData = await getUserStats();
      setStats([
        { title: "Пользователи", icon: <FaUsers />, value: statsData.stats.totalUsers },
        { title: "Онлайн", icon: <FaUser />, value: statsData.stats.onlineUsers },
        { title: "Замороженные", icon: <FaSnowflake />, value: statsData.stats.frozenUsers },
        { title: "С 2FA", icon: <FaShieldAlt />, value: statsData.stats.usersWith2FA },
        { title: "Полученные", icon: <FaInbox />, value: statsData.stats.receivedEmails },
        { title: "Отправленные", icon: <FaPaperPlane />, value: statsData.stats.sentEmails },
      ]);
    } catch (err) {
      setError(err.error || "Failed to load data");
    } finally {
      hideLoader();
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchInput, currentPage, usersOnPage]);

  const handleSearchInputUpdate = (e) => {
    setSearchInput(e.target.value);
    setCurrentPage(1);
  };

  const handleUsersOnPage = (index) => {
    setUsersOnPage(usersCanBeOnPage[index]);
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    fetchData();
  };

  const handleUserClick = (userId) => {
    console.log(`Clicked user with ID: ${userId}`);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setUsers((prev) => {
      const sorted = [...prev].sort((a, b) => {
        let valA = a[field] || "";
        let valB = b[field] || "";
        if (field === "name") {
          valA = `${a.name || ""} ${a.surname || ""}`;
          valB = `${b.name || ""} ${b.surname || ""}`;
        }
        if (field === "id" || field === "status") {
          valA = Number(valA === "000000" ? 0 : valA);
          valB = Number(valB === "000000" ? 0 : valB);
          return sortDirection === "asc" ? valA - valB : valB - valA;
        }
        return sortDirection === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
      });
      return sorted;
    });
  };

  const handleAddUser = async () => {
    if (!addUserData.email || !addUserData.login || !addUserData.password || !addUserData.domain) {
      setAddError("All required fields must be filled");
      return;
    }
    const fullEmail = `${addUserData.email}@${addUserData.domain}`;
    try {
      showLoader();
      await addUser({ ...addUserData, email: fullEmail });
      setShowAddModal(false);
      setAddUserData({
        email: "",
        login: "",
        password: "",
        status: 1,
        name: "",
        surname: "",
        domain: domains[0] || "",
      });
      setAddError("");
      await fetchData();
    } catch (err) {
      setAddError(err.error || "Failed to add user");
    } finally {
      hideLoader();
    }
  };

  const generateRandomString = (length, chars) => {
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  };

  const generateLogin = () => {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    return generateRandomString(5 + Math.floor(Math.random() * 6), chars);
  };

  const generatePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";
    return generateRandomString(8 + Math.floor(Math.random() * 5), chars);
  };

  const generateName = () => {
    const names = ["John", "Anna", "Mike", "Sarah", "Alex", "Emma"];
    return names[Math.floor(Math.random() * names.length)];
  };

  const generateSurname = () => {
    const surnames = ["Smith", "Johnson", "Brown", "Taylor", "Wilson", "Davis"];
    return surnames[Math.floor(Math.random() * surnames.length)];
  };

  const totalPages = Math.ceil(totalUsers / usersOnPage);
  const startIndex = (currentPage - 1) * usersOnPage;
  const endIndex = startIndex + usersOnPage;
  const displayedUsers = users.slice(startIndex, endIndex);
  const rangeStart = startIndex + 1;
  const rangeEnd = Math.min(startIndex + usersOnPage, totalUsers);

  const getPaginationPages = () => {
    const maxPagesToShow = 5;
    const pages = [];
    const half = Math.floor(maxPagesToShow / 2);

    let startPage = Math.max(1, currentPage - half);
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return {
      pages,
      showLeftDots: startPage > 1,
      showRightDots: endPage < totalPages,
      firstPage: 1,
      lastPage: totalPages,
    };
  };

  const { pages, showLeftDots, showRightDots, firstPage, lastPage } = getPaginationPages();

  const getStatusIcon = (status) => {
    switch (status) {
      case 0:
        return <FaBan className="text-red-500" />;
      case 1:
        return <FaCheckCircle className="text-green-500" />;
      case 2:
        return <FaCrown className="text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 0:
        return <span className="text-red-500">В бане</span>;
      case 1:
        return <span className="text-green-500">Пользователь</span>;
      case 2:
        return <span className="text-yellow-500">Админ</span>;
      default:
        return <span>Неизвестно</span>;
    }
  };

  return (
    <div className="w-full h-full p-[15px] m-auto">
      {error && <div className="text-red-500 text-center mb-[20px]">{error}</div>}
      <div className="w-full mt-[40px] flex flex-wrap p-[5px]">
        {stats.map((item, i) => (
          <div
            key={`stat ${item.title}`}
            className="flex items-center m-[5px] py-[14px] px-[20px] bg-container rounded-[12px]"
          >
            <span className="text-[16px] text-icons">{item.icon}</span>
            <span className="ml-[10px] text-text-primary text-[16px]">{item.title}</span>
            <span className="ml-[20px] text-[16px] text-text-secondary-60">{item.value}</span>
          </div>
        ))}
      </div>
      <div className="mt-[40px] p-[20px] bg-container rounded-[20px] w-full h-full">
        <div className="flex justify-between items-center flex-col sm:flex-row">
          <div className="bg-accent py-[2px] rounded-[6px] flex flex-col sm:flex-row">
            {usersCanBeOnPage.map((num, index) => (
              <span
                onClick={() => handleUsersOnPage(index)}
                className={`relative px-[15px] mx-[10px] rounded-[6px] hover:bg-bg-hover hover-anim-n ${
                  usersOnPage === usersCanBeOnPage[index] ? "bg-primary text-white" : ""
                }`}
                key={`usernumbers #${index}`}
              >
                {num}
                {index !== usersCanBeOnPage.length - 1 && (
                  <span className="absolute right-[-10px] top-[0px] border-r-2 h-full border-stroke sm:block hidden"></span>
                )}
              </span>
            ))}
          </div>
          <div className="flex items-center mt-4 sm:mt-0">
            <InputSearch
              value={searchInput}
              onChange={handleSearchInputUpdate}
              className="max-w-[400px] w-full"
              placeholder="Поиск по логину, email, имени..."
            />
          </div>
        </div>
        <div className="bg-accent mt-[25px] p-[20px] w-full rounded-[12px] overflow-x-auto">
          <div className="grid grid-cols-[40px_1fr_1fr_1fr_1fr_1fr] gap-4 min-w-[1200px] text-text-primary font-medium mb-2">
            <div className="flex items-center gap-2">
              <span className="cursor-pointer select-none" onClick={() => handleSort("id")}>
                ID {sortField === "id" && (sortDirection === "asc" ? "↑" : "↓")}
              </span>
            </div>
            <span className="flex items-center gap-2 cursor-pointer select-none" onClick={() => handleSort("name")}>
              Пользователи {sortField === "name" && (sortDirection === "asc" ? "↑" : "↓")}
            </span>
            <span className="flex items-center gap-2 cursor-pointer select-none" onClick={() => handleSort("email")}>
              Почта {sortField === "email" && (sortDirection === "asc" ? "↑" : "↓")}
            </span>
            <span className="flex items-center gap-2 cursor-pointer select-none" onClick={() => handleSort("login")}>
              Логин {sortField === "login" && (sortDirection === "asc" ? "↑" : "↓")}
            </span>
            <span className="flex items-center gap-2 select-none">Пароль</span>
            <span className="flex items-center gap-2 cursor-pointer select-none" onClick={() => handleSort("status")}>
              Статус {sortField === "status" && (sortDirection === "asc" ? "↑" : "↓")}
            </span>
          </div>
          {displayedUsers.map((user) => (
            <div
              key={`user-${user.id}`}
              onClick={() => handleUserClick(user.id)}
              className="grid grid-cols-[40px_1fr_1fr_1fr_1fr_1fr] gap-4 min-w-[1200px] w-full py-2 border-t border-stroke hover:bg-bg-hover cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span>{user.status === 3 ? "000000" : user.id}</span>
              </div>
              <span className="flex items-center gap-2 whitespace-nowrap">
                <EmptyAvatar name={user.name || user.login} mode="placeholder" />
                <span>{getShortText(`${user.name || ""} ${user.surname || ""}`, window.innerWidth < 470 ? 20 : 30, false)}</span>
              </span>
              <span className="flex items-center gap-2">
                {getShortText(user.email || "", window.innerWidth > 470 ? (window.innerWidth < 1600 ? 17 : 24) : 17, false)}
              </span>
              <span className="flex items-center gap-2">
                {getShortText(user.login || "", window.innerWidth < 470 ? 15 : 20, false)}
              </span>
              <span className="flex items-center gap-2">********</span>
              <span className="flex items-center gap-1">
                {getStatusIcon(user.status)}
                {getStatusText(user.status)}
              </span>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center p-[20px] w-full rounded-[12px] flex-col sm:flex-row">
          <div className="flex flex-col items-center sm:items-start">
            <div className="flex items-center">
              <FaSync
                onClick={handleRefresh}
                className="text-icons text-[19px] hover-anim cursor-pointer mr-2"
              />
              <Button onClick={() => setShowAddModal(true)}>Добавить</Button>
            </div>
            <div className="flex items-center mt-2 sm:mt-0">
              <FaArrowLeft
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className={`hover-anim cursor-pointer ml-2 ${currentPage === 1 ? "opacity-40 pointer-events-none" : ""}`}
              />
              <span className="text-text-secondary text-[15px] mx-[3px]">
                {`${rangeStart}-${rangeEnd} из ${totalUsers}`}
              </span>
              <FaArrowRight
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                className={`hover-anim cursor-pointer ${currentPage === totalPages ? "opacity-40 pointer-events-none" : ""}`}
              />
            </div>
          </div>
          <div className="flex flex-col items-center mt-4 sm:mt-0 sm:flex-row">
            {showLeftDots && (
              <>
                <span
                  onClick={() => setCurrentPage(firstPage)}
                  className={`px-2 cursor-pointer ${currentPage === firstPage ? "text-primary" : "text-text-secondary"}`}
                >
                  {firstPage}
                </span>
                <span className="text-text-secondary">...</span>
              </>
            )}
            {pages.map((page) => (
              <span
                key={`page-${page}`}
                onClick={() => setCurrentPage(page)}
                className={`px-2 cursor-pointer ${currentPage === page ? "text-primary" : "text-text-secondary"}`}
              >
                {page}
              </span>
            ))}
            {showRightDots && (
              <>
                <span className="text-text-secondary">...</span>
                <span
                  onClick={() => setCurrentPage(lastPage)}
                  className={`px-2 cursor-pointer ${currentPage === lastPage ? "text-primary" : "text-text-secondary"}`}
                >
                  {lastPage}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
      {showAddModal && (
        <div className="absolute inset-0 bg-bg-main/60 z-40 flex justify-center items-center">
          <div className="bg-container max-w-[500px] w-full pt-[20px] rounded-[24px] border-2 border-stroke">
            <div className="flex justify-between items-center px-[24px]">
              <div className="text-text-primary text-[24px] font-bold">Добавить пользователя</div>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-[24px] h-[24px] bg-input rounded-full flex items-center justify-center text-text-primary"
              >
                ✕
              </button>
            </div>
            <div className="my-[20px] mx-[24px] py-[14px] px-[20px]">
              <div className="flex justify-between items-center">
                <InputLabel text="Статус" required />
              </div>
              <select
                value={addUserData.status}
                onChange={(e) => setAddUserData({ ...addUserData, status: parseInt(e.target.value) })}
                className="w-full bg-input border border-stroke rounded-[10px] p-[12px] text-text-primary"
              >
                <option value={1}>Пользователь</option>
                <option value={0}>В бане</option>
                <option value={2}>Админ</option>
              </select>
              <div className="flex justify-between items-center mt-4">
                <InputLabel text="Логин" required />
                <Button
                  onClick={() => setAddUserData({ ...addUserData, login: generateLogin() })}
                  className="text-[12px] px-2 py-1"
                >
                  Gen
                </Button>
              </div>
              <Input
                className="w-full"
                type="text"
                placeholder="Логин"
                value={addUserData.login}
                setValue={(e) => setAddUserData({ ...addUserData, login: e.target.value })}
              />
              <div className="flex justify-between items-center mt-4">
                <InputLabel text="Пароль" required />
                <Button
                  onClick={() => setAddUserData({ ...addUserData, password: generatePassword() })}
                  className="text-[12px] px-2 py-1"
                >
                  Gen
                </Button>
              </div>
              <Input
                className="w-full"
                type="password"
                placeholder="Пароль"
                value={addUserData.password}
                setValue={(e) => setAddUserData({ ...addUserData, password: e.target.value })}
              />
              <div className="flex justify-between items-center mt-4">
                <InputLabel text="Email" required />
              </div>
              <div className="flex items-center">
                <Input
                  className="w-full rounded-r-none"
                  type="text"
                  placeholder="admin"
                  value={addUserData.email}
                  setValue={(e) => setAddUserData({ ...addUserData, email: e.target.value })}
                />
                <select
                  value={addUserData.domain}
                  onChange={(e) => setAddUserData({ ...addUserData, domain: e.target.value })}
                  className="bg-input border border-stroke rounded-l-none p-[12px] text-text-primary"
                >
                  {domains.map((domain) => (
                    <option key={domain} value={domain}>@{domain}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-between items-center mt-4">
                <InputLabel text="Имя" />
                <Button
                  onClick={() => setAddUserData({ ...addUserData, name: generateName() })}
                  className="text-[12px] px-2 py-1"
                >
                  Gen
                </Button>
              </div>
              <Input
                className="w-full"
                type="text"
                placeholder="Имя"
                value={addUserData.name}
                setValue={(e) => setAddUserData({ ...addUserData, name: e.target.value })}
              />
              <div className="flex justify-between items-center mt-4">
                <InputLabel text="Фамилия" />
                <Button
                  onClick={() => setAddUserData({ ...addUserData, surname: generateSurname() })}
                  className="text-[12px] px-2 py-1"
                >
                  Gen
                </Button>
              </div>
              <Input
                className="w-full"
                type="text"
                placeholder="Фамилия"
                value={addUserData.surname}
                setValue={(e) => setAddUserData({ ...addUserData, surname: e.target.value })}
              />
              {addError && <p className="text-red-500 mt-[10px]">{addError}</p>}
            </div>
            <div className="flex justify-center items-center my-[20px] mx-[24px]">
              <button
                onClick={() => setShowAddModal(false)}
                className="p-[12px] bg-bg-active text-text-secondary rounded-[10px] w-[176px] text-center mr-[10px] hover-anim"
              >
                Отмена
              </button>
              <button
                onClick={handleAddUser}
                className="p-[12px] bg-primary text-[#fff] rounded-[10px] w-[176px] text-center hover-anim"
              >
                Добавить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;