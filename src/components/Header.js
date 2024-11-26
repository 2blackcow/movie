import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  MdOutlineSearch,
  MdMenu,
  MdClose,
  MdLogout,
  MdPerson,
} from "react-icons/md";
import { navigation } from "../constants/navigation";
import { searchHistory, userStorage } from "../utils/localStorage";
import SearchHistory from "./search/SearchHistory";
import { clearMyList } from "../store/movieSlice";
import logo from "../assets/movie.png";

const Header = () => {
  const dispatch = useDispatch();
  const [searchInput, setSearchInput] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [showSearchHistory, setShowSearchHistory] = useState(false);
  const [recentSearches, setRecentSearches] = useState(searchHistory.get());
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();
  const userMenuRef = useRef(null);
  const searchRef = useRef(null);
  const [isMobileView, setIsMobileView] = useState(false);

  // 화면 크기 감지
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 1050);
    };

    handleResize(); // 초기 실행
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      setUserEmail(currentUser);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchHistory(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchFocus = () => {
    setShowSearchHistory(true);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      const updatedSearches = searchHistory.add(searchInput.trim());
      setRecentSearches(updatedSearches);
      navigate(`/search?q=${searchInput}`);
      setShowSearchHistory(false);
      setSearchInput("");
      setIsMenuOpen(false);
    }
  };

  const handleSearchSelect = (term) => {
    setSearchInput(term);
    navigate(`/search?q=${term}`);
    setShowSearchHistory(false);
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    userStorage.clearUserData();
    dispatch(clearMyList());
    setUserEmail("");
    alert("로그아웃되었습니다.");
    navigate("/signin");
  };

  return (
    <>
      <header className="fixed top-0 w-full h-16 bg-neutral-600 bg-opacity-75 backdrop-blur-sm flex items-center justify-between px-5 sm:px-10 z-50">
        {/* Logo Section */}
        <Link to="/" className="flex items-center mr-6">
          <img src={logo} alt="logo" className="w-12 sm:w-16" />
        </Link>

        {/* Desktop Navigation Menu */}
        <nav className="hidden lg:flex items-center gap-6">
          {navigation.map((nav) => (
            <NavLink
              key={nav.label}
              to={nav.href}
              className={({ isActive }) =>
                `text-white hover:text-red-800 font-bold ${
                  isActive ? "text-red-800 font-bold" : ""
                }`
              }
            >
              {nav.label}
            </NavLink>
          ))}
        </nav>

        {/* Search and User Section */}
        <div className="ml-auto flex items-center gap-4">
          {/* Search Bar */}
          <div className="relative hidden sm:block" ref={searchRef}>
            <form
              className="flex items-center gap-2"
              onSubmit={handleSearchSubmit}
            >
              <input
                type="text"
                placeholder="영화 제목을 입력하세요..."
                className="bg-transparent text-white border-b border-white focus:outline-none px-2 py-1 w-44 sm:w-64"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onFocus={handleSearchFocus}
              />
              <button
                type="submit"
                className="hover:text-red-700 transition-colors duration-200"
              >
                <MdOutlineSearch size={24} />
              </button>
            </form>

            {showSearchHistory && (
              <SearchHistory
                searches={recentSearches}
                onSelect={handleSearchSelect}
                onClear={() => {
                  searchHistory.clear();
                  setRecentSearches([]);
                }}
                onRemoveItem={(term) => {
                  const updated = searchHistory.removeItem(term);
                  setRecentSearches(updated);
                }}
                setRecentSearches={setRecentSearches}
              />
            )}
          </div>

          {/* User Menu */}
          <div className="relative hidden sm:block" ref={userMenuRef}>
            <div
              className="flex items-center gap-2 cursor-pointer text-white hover:text-red-800 transition-colors duration-200"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            >
              <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-neutral-700">
                <MdPerson size={20} />
              </div>
              {/* 반응형으로 이메일 표시 수정 */}
              <span className="hidden text-sm md:block md:max-w-[150px] lg:max-w-[200px] xl:max-w-none truncate">
                {userEmail || "사용자"}
              </span>
            </div>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200 break-words">
                  {userEmail}
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full transition-colors duration-200"
                >
                  <MdLogout />
                  로그아웃
                </button>
              </div>
            )}
          </div>
          {/* Menu Toggle Button - Always Visible */}
          <button
            className="text-white hover:text-red-800 transition-colors duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
          </button>
        </div>
      </header>

      {/* Slide-in Navigation Menu */}
      {isMenuOpen && (
        <div className="fixed inset-y-0 right-0 top-16 w-64 bg-neutral-800 bg-opacity-95 z-40 transform transition-transform duration-300 ease-in-out shadow-xl">
          <nav className="flex flex-col items-center pt-8 gap-6">
            {/* User Info */}
            <div className="flex items-center gap-2 text-white mb-4">
              <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-neutral-700">
                <MdPerson size={24} />
              </div>
              <span className="text-sm">{userEmail || "사용자"}</span>
            </div>

            {/* Navigation Links */}
            {navigation.map((nav) => (
              <NavLink
                key={nav.label}
                to={nav.href}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2 text-white hover:text-red-800 font-bold transition-colors duration-200 ${
                    isActive ? "text-red-800 font-bold" : ""
                  }`
                }
              >
                {nav.icon}
                <span>{nav.label}</span>
              </NavLink>
            ))}

            {/* Mobile Search */}
            <div className="w-4/5 max-w-xs relative sm:hidden" ref={searchRef}>
              <form
                className="flex items-center gap-2"
                onSubmit={handleSearchSubmit}
              >
                <input
                  type="text"
                  placeholder="영화 제목을 입력하세요..."
                  className="w-full bg-transparent text-white border-b border-white focus:outline-none px-2 py-1"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onFocus={handleSearchFocus}
                />
                <button
                  type="submit"
                  className="hover:text-red-700 transition-colors duration-200"
                >
                  <MdOutlineSearch size={24} />
                </button>
              </form>

              {showSearchHistory && (
                <SearchHistory
                  searches={recentSearches}
                  onSelect={handleSearchSelect}
                  onClear={() => {
                    searchHistory.clear();
                    setRecentSearches([]);
                  }}
                  onRemoveItem={(term) => {
                    const updated = searchHistory.removeItem(term);
                    setRecentSearches(updated);
                  }}
                  setRecentSearches={setRecentSearches}
                />
              )}
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-white hover:text-red-800 font-bold transition-colors duration-200 mt-4"
            >
              <MdLogout />
              <span>로그아웃</span>
            </button>
          </nav>
        </div>
      )}
    </>
  );
};

export default Header;
