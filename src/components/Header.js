import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { MdOutlineSearch, MdMenu, MdClose, MdLogout } from "react-icons/md";
import { navigation } from "../constants/navigation";
import { searchHistory, userStorage } from '../utils/localStorage';
import SearchHistory from './search/SearchHistory';
import { clearMyList } from '../store/movieSlice';
import logo from "../assets/movie.png";
import userIcon from "../assets/userIcon.png";

const Header = () => {
  const dispatch = useDispatch();
  const [searchInput, setSearchInput] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [showSearchHistory, setShowSearchHistory] = useState(false);
  const [recentSearches, setRecentSearches] = useState(searchHistory.get());
  const navigate = useNavigate();
  const userMenuRef = useRef(null);
  const searchRef = useRef(null);

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
      setSearchInput(""); // 검색 후 입력창 초기화
    }
  };

  const handleSearchSelect = (term) => {
    setSearchInput(term);
    navigate(`/search?q=${term}`);
    setShowSearchHistory(false);
  };

  const handleLogout = () => {
    // userStorage를 사용하여 모든 사용자 데이터 초기화
    userStorage.clearUserData();
    
    // Redux store 초기화
    dispatch(clearMyList());
    
    alert('로그아웃되었습니다.');
    navigate('/signin');
  };

  return (
    <>
      <header className="fixed top-0 w-full h-16 bg-neutral-600 bg-opacity-75 flex items-center justify-between px-5 sm:px-10 z-50">
        {/* Logo Section */}
        <Link to="/" className="flex items-center mr-6">
          <img src={logo} alt="logo" className="w-12 sm:w-16 md:w-20" />
        </Link>

        {/* Desktop Navigation Menu */}
        <nav className="hidden md:flex items-center gap-6">
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
          <div className="hidden sm:block relative" ref={searchRef}>
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
                <MdOutlineSearch size={30} />
              </button>
            </form>

            {/* 최근 검색어 히스토리 */}
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
          <div className="relative" ref={userMenuRef}>
            <div 
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden cursor-pointer 
                         active:scale-95 transition-all flex items-center justify-center"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            >
              <img src={userIcon} alt="User Icon" className="w-full h-full" />
            </div>

            {/* User Dropdown Menu */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 
                           hover:bg-gray-100 w-full transition-colors duration-200"
                >
                  <MdLogout />
                  로그아웃
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white hover:text-red-800 transition-colors duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-16 bg-neutral-800 bg-opacity-95 z-40 md:hidden">
          <nav className="flex flex-col items-center pt-8 gap-6">
            {navigation.map((nav) => (
              <NavLink
                key={nav.label}
                to={nav.href}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2 text-white hover:text-red-800 font-bold 
                   transition-colors duration-200 ${
                    isActive ? "text-red-800 font-bold" : ""
                  }`
                }
              >
                {nav.icon}
                <span>{nav.label}</span>
              </NavLink>
            ))}

            {/* Mobile Search with History */}
            <div className="w-4/5 max-w-xs relative" ref={searchRef}>
              <form
                className="flex items-center gap-2"
                onSubmit={handleSearchSubmit}
              >
                <input
                  type="text"
                  placeholder="영화 제목을 입력하세요..."
                  className="w-full bg-transparent text-white border-b border-white 
                           focus:outline-none px-2 py-1"
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

              {/* Mobile 최근 검색어 히스토리 */}
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

            {/* Mobile Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-white hover:text-red-800 
                       font-bold transition-colors duration-200"
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